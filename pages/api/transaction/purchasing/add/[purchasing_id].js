import excuteQuery from "../../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const { purchasing_id } = req.query;
  const method = req.method;

  if (method === "POST") {
    try {
      const { product_id } = req.body;
      const checkProductInPurchase = await excuteQuery({
        query: `select * from purchasing_detail where purchasing_id=${purchasing_id} and product_id=${product_id}`,
      });

      if (checkProductInPurchase.length === 0) {
        const data = await excuteQuery({
          query: `
          insert into purchasing_detail
          (purchasing_id,product_id,qty, sub_total)
          values
          (${purchasing_id},${product_id},1,0)
          `,
        });

        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          data: data,
        });
      } else {
        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          message: "Product already exist !",
        });
      }
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
