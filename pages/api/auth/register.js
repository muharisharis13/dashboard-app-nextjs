import excuteQuery from "../../../database";
import httpStatus from "http-status";
import { crypto } from "../../../utils/server";

export default async function handler(req, res) {
  const { method, body } = req;
  const { firstname, lastname, password, role_id, username } = body;

  if (method === "POST") {
    try {
      const data = await excuteQuery({
        query: `insert into user set firstname='${firstname}',lastname='${lastname}',password='${crypto.hashPassword(
          password
        )}',role_id=${role_id},username='${username}'`,
      });

      res.status(200).json({
        code: 200,
        status: httpStatus[200],
        data,
      });
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
