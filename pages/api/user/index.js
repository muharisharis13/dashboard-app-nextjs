import executeQuery from "../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  try {
    const data = await executeQuery({
      query: "select * from user",
    });
    res.status(200).json({
      status: httpStatus[200],
      code: 200,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: httpStatus[500],
      code: 500,
      data: error,
    });
  }
}
