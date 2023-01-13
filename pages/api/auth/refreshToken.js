import excuteQuery from "../../../database";
import httpStatus from "http-status";
import { token } from "../../../utils/server"

const { verifyRefreshToken, createToken, createRefreshToken } = token

export default async function handler(req, res) {
  const { method, body } = req
  // const { refreshToken, username } = body
  const { refreshToken, username } = JSON.parse(body)

  // console.log({ body: JSON.parse(body) })

  if (method === "POST") {

    try {
      const isValid = verifyRefreshToken(username, refreshToken)

      if (!isValid) {
        return res
          .status(401)
          .json({
            code: 401,
            message: httpStatus[401],
            data: "Invalid token,try login again",
          });
      }


      const token = await excuteQuery({
        query: `select * from token where refresh_token='${refreshToken}'`
      })



      if (token.length > 0) {
        const getUser = await excuteQuery({
          query: `select id,firstname,lastname,createdAt,updatedAt,role_id,username from user where username='${username}'and id='${token[0].id_user}'`
        })



        if (getUser.length > 0) {
          const dataToken = getUser[0]
          const newToken = createToken({ ...dataToken })
          const newRefreshToken = createRefreshToken({ ...dataToken })

          const updateToken = await excuteQuery({
            query: `update token set token='${newToken}',refresh_token='${newRefreshToken}', updatedAt=CURRENT_TIMESTAMP where id_user=${token[0].id_user}`
          })

          res.status(200).json({
            code: 200,
            status: httpStatus[200],
            data: {
              type: "Bearer",
              token: newToken,
              refreshToken: newRefreshToken,
              updateToken
            }
          })
        }
      }


    } catch (error) {
      res.status(500).json({
        code: 500,
        status: httpStatus[500],
        data: error,
      });
    }
  }
  else {
    res.status(400).json({
      code: 400,
      status: httpStatus[400],
      data: "Invalid Method !"
    })
  }
}