import axios from "axios";
import Cookies from "./cookie"

const baseURL = `https://dashboard-app-nextjs.vercel.app/api`;
const timeout = 16000;

const instance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token2}`
  },
});

instance.interceptors.request.use(async (config) => {
  let token = Cookies.get('token')

  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
})

const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  const username = Cookies.get('username')

  console.log("ini refresh")
  return instance.post("/auth/refreshToken", {
    refreshToken,
    username
  })
}


instance.setToken = (token) => {
  instance.defaults.headers["Authorization"] = `Bearer ${token}`;

  Cookies.set({
    label: 'token',
    value: token
  })
}

let isRefreshing = false;

let requests = []

instance.interceptors.response.use(undefined, async (err) => {
  const error = err.response;
  if (error && error.code === 401) {
    const config = error.config;
    if (!isRefreshing) {
      isRefreshing = true;
      return refreshToken()
        .then(res => {
          const { token, refreshToken } = res.data.data;
          Cookies.set({
            label: 'refreshToken',
            value: refreshToken
          })
          instance.setToken(token);
          requests.forEach(cb => cb(token))
          requests = [];
          return instance(config)
        })
        .catch(async res => {
          console.error("RefreshToken Error =>", res);
          let token = Cookies.get("token")

          requests.forEach(cb => cb(token));

        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    else {
      return new Promise((resolve) => {
        requests.push(token => {
          config.baseURL = baseURL;
          config.headers['Authorization'] = `Bearer ${token}`;

          resolve(instance(config))
        })
      })
    }
  }

})

export default instance;
