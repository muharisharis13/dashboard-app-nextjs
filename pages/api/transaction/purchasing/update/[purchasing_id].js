import excuteQuery from "../../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const { purchasing_id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { qty, purchasing_detail_id, product_id, price } = req.body;

    try {
      const data = await excuteQuery({
        query: `
        update purchasing_detail
        set ${qty && `qty=${qty}`} ${
          price
            ? `,price=${price}, sub_total=${parseInt(price) * parseInt(qty)}`
            : ""
        }
        where purchasing_id=${purchasing_id} and id=${purchasing_detail_id} and product_id=${product_id}
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
