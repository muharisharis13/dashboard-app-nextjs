import excuteQuery from "../../../../database";
import httpStatus from "http-status";

const handler = async (req, res) => {
  const method = req.method;
  const { selling_id } = req.query;

  if (method === "GET") {
    try {
      await excuteQuery({
        query: `
          select selling_detail.*, product.product_name 
          from selling_detail
          left join product
          on selling_detail.product_id = product.id
          where selling_id=${selling_id}
        `,
      }).then((result) => {
        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          data: result,
        });
      });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }
  }
};

export default handler;
