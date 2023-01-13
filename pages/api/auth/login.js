import excuteQuery from "../../../database";
import httpStatus from "http-status";
import { crypto, token } from "../../../utils/server";

const { hashPassword } = crypto;

const getTokenById = async (id) => {
  if (id) {
    return await excuteQuery({
      query: `select * from token where id_user=${id}`,
    });
  } else {
    return "Id is Required";
  }
};
export default async function handler(req, res) {
  const { method, body } = req;
  const { username, password } = body;

  if (method === "POST") {
    try {
      const data = await excuteQuery({
        query: `select id,username,firstname,lastname,createdAt,updatedAt,role_id from user where username='${username}' and password='${hashPassword(
          password
        )}'`,
      });

      if (data.length > 0) {
        console.log("sebelum");
        const dataToken = data[0];
        const tokenData = token.createToken({ ...dataToken });

        const refresh_token = token.createRefreshToken({ ...dataToken });
        getTokenById(data[0].id).then(async (resToken) => {
          if (resToken && resToken.length > 0) {
            await excuteQuery({
              query: `update token set token='${tokenData}', refresh_token='${refresh_token}', updatedAt=CURRENT_TIMESTAMP where id_user=${data[0].id}`,
            });
          } else {
            await excuteQuery({
              query: `insert into token (token,refresh_token,id_user) values ('${tokenData}','${refresh_token}',${data[0].id})`,
            });
          }
        });

        res.status(200).json({
          code: 200,
          status: httpStatus[200],
          data: {
            ...data[0],
            access: {
              type: "Bearer",
              token: tokenData,
              refreshToken: refresh_token,
            },
          },
        });
      } else {
        res.status(401).json({
          code: 401,
          status: httpStatus[401],
          data: "username or password wrong !",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: httpStatus[500],
        data: error,
      });
    }
  } else {
    res.status(400).json({
      code: 400,
      status: httpStatus[400],
      data: "Invalid Method !",
    });
  }
}
