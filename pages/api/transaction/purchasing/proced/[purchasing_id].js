import excuteQuery from "../../../../../database";
import httpStatus from "http-status";

const checkingPriceIsNull = (data = []) => {
  if (data.length > 0) {
    const isNull = data.filter((filter) => filter.price === null);

    if (isNull.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export default async function handler(req, res) {
  const { purchasing_id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { purchasing_status } = req.body;
    try {
      //check price apakah sudah terisi semua ?
      const getDetailPurchasing = await excuteQuery({
        query: `
        select * from purchasing_detail
        where purchasing_id=${purchasing_id}
      `,
      });

      if (!checkingPriceIsNull(getDetailPurchasing)) {
        const resultSum = getDetailPurchasing
          .map((item) => item.sub_total)
          .reduce((prev, current) => JSON.parse(prev) + JSON.parse(current));
        const data = await excuteQuery({
          query: `
          update purchasing
          set purchasing_status='${purchasing_status}', purchasing_total=${resultSum}
          where id=${purchasing_id}
          `,
        });

        if (purchasing_status === "complete") {
          getDetailPurchasing.map(async (item) => {
            const getProductDetail = await excuteQuery({
              query: `
                select * from product where id=${item.product_id}
              `,
            });
            await excuteQuery({
              query: `
              update product
              set stock=${
                parseInt(item.qty) + parseInt(getProductDetail[0].stock)
              } , ${
                parseInt(item.price) > getProductDetail[0].capital_price
                  ? `capital_price=${parseInt(item.price)}`
                  : `capital_price=${getProductDetail[0].capital_price}`
              }

              where id=${getProductDetail[0].id}
              `,
            });
          });
        }

        if (data.protocol41) {
          res.status(200).json({
            status: httpStatus[200],
            code: 200,
            data: "Purchasing Success to " + purchasing_status,
          });
        } else {
          res.status(400).json({
            status: httpStatus[400],
            code: 400,
            data: data,
          });
        }
      } else {
        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          message: "Please update your price !",
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
