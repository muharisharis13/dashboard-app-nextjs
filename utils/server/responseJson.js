import httpStatus from "http-status";


export default function responseJson({
  res, code, data
}) {
  return res.json({
    status: httpStatus[code],
    code,
    data
  })
}