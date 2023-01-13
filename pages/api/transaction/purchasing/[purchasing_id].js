import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const { purchasing_id } = req.query;
  const method = req.method;

  try {
    await excuteQuery({
      query: `
        select purchasing.* , user.firstname
        from purchasing
        left join user
        on purchasing.user_id = user.id
        where visibility=1 and purchasing.id=${purchasing_id}
      `,
    }).then(async (result) => {
      await excuteQuery({
        query: `
         select purchasing_detail.* , product.product_name, product.stock, product.uom_id, product.category_id,product.product_code,product.capital_price, uom.uom_name, category.category_name
         from purchasing_detail
         left join product
         on purchasing_detail.product_id = product.id
         left join uom
         on product.uom_id = uom.id
         left join category
         on product.category_id = category.id
         where purchasing_detail.purchasing_id=${result[0].id}
        `,
      }).then((resultPurchasingDetail) => {
        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          data: {
            ...result[0],
            list_product: resultPurchasingDetail,
          },
        });
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
