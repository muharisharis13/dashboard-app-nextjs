import executeQuery from "../../../database";
import httpStatus from "http-status";
import { responseJson } from "../../../utils/server"

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;
  const { firstname, lastname } = req.body


  if (method === 'PUT') {
    try {
      const data = await executeQuery({
        query: `update user set firstname='${firstname}',lastname='${lastname}' where id=${id}`
      })
      if (data) {
        res.status(200).json({
          code: 200,
          status: httpStatus[200],
          data
        })
      }
      else {
        res.status(400).json({
          code: 400,
          status: httpStatus[400],
          data: 'User not found !'
        })
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: httpStatus[500],
        data: error
      })
    }

  }
  else {
    try {
      const data = await executeQuery({
        query: "select * from user where id=" + id,
      });

      res.status(200).json({
        status: httpStatus[200],
        code: 200,
        data: data[0],
      });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        data: error,
      });
    }

  }
}
