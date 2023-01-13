import { Axios } from "../../utils";

const User = () => {
  async function getListUser() {
    const { data } = await Axios.get(`user`);
    return data;
  }

  async function getDetailUser({ id }) {
    const { data } = await Axios.get(`user/${id}`);
    return data;
  }

  let data = {
    user: {
      getListUser,
      getDetailUser,
    },
  };
  return data;
};

export default User();
