import httpStatus from "http-status";



export default function handler(req, res) {
  res.status(401).json({
    code: 401,
    status: httpStatus[401],
    data: {
      message: "Unauthorized"
    }
  });
};