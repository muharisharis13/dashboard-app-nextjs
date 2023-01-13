import excuteQuery from "../../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const { purchasing_id } = req.query;
  const method = req.method;

  if (method === "DELETE") {
    const { purchasing_detail_id } = req.body;

    try {
      const data = await excuteQuery({
        query: `
        delete from purchasing_detail
        where id=${purchasing_detail_id} and purchasing_id=${purchasing_id}
        `,
      });
      res.status(200).json({
        status: httpStatus[200],
        code: 200,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: httpStatus[400],
      code: 400,
      message: "unavailable Method !",
    });
  }
}
