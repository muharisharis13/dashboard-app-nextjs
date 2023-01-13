import excuteQuery from "../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    const { user_id } = req.body;

    try {
      await excuteQuery({
        query: `
        update token
        set token='', refresh_token='', updatedAt=CURRENT_TIMESTAMP
        where id_user=${user_id}
      `,
      }).then((result) => {
        if (result.protocol41) {
          res.status(200).json({
            code: 200,
            status: httpStatus[200],
            data: "Success Logout",
          });
        } else {
          res.status(400).json({
            code: 400,
            status: httpStatus[400],
            data: "Something Error",
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: httpStatus[500],
        data: error,
      });
    }
  }
}
