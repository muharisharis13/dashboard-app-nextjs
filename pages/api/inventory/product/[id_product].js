import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const { id_product } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const {
      product_name,
      capital_price,
      price,
      min_stock,
      uom_id,
      category_id,
      type_price,
    } = req.body;

    try {
      const data = await excuteQuery({
        query: `
         update product
         set product_name='${product_name}', capital_price=${capital_price}, price=${price},  min_stock=${min_stock}, uom_id=${uom_id}, category_id=${category_id}, type_price='${type_price}', updatedAt=CURRENT_TIMESTAMP
         where id=${id_product}
        `,
      });

      if (data?.protocol41 === true) {
        res.status(200).json({
          code: 200,
          status: httpStatus[200],
          data: "Success for edited",
        });
      } else {
        res.status(400).json({
          code: 400,
          status: httpStatus[400],
          data: "Something Wrong with input",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        data: error,
      });
    }
  } else if (method === "DELETE") {
    const data = await excuteQuery({
      query: `
        delete from product
        where id=${id_product}
      `,
    });
    if (data?.protocol41 === true) {
      res.status(200).json({
        code: 200,
        status: httpStatus[200],
        data: "Success for deleted",
      });
    } else {
      res.status(400).json({
        code: 400,
        status: httpStatus[400],
        data: "Something Wrong with method",
      });
    }
  } else {
    try {
      const data = await excuteQuery({
        query: `
        select product.*,uom.uom_name,category.category_name
        from product
        left join uom 
        on product.uom_id = uom.id
        left join category 
        on product.category_id = category.id
        where product.id = ${id_product}
        `,
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
