import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    const {
      product_code,
      product_name,
      capital_price,
      price,
      stock,
      min_stock,
      uom_id,
      category_id,
      type_price,
    } = req.body;

    try {
      await excuteQuery({
        query: `
         insert into
         product
         (product_code, product_name, capital_price, price, stock, min_stock, uom_id, category_id, type_price)
         values
         ('PRD${product_code ? product_code : new Date().getTime()}', '${product_name}', ${capital_price}, ${price}, ${stock}, ${min_stock}, ${uom_id}, ${category_id}, '${type_price}')
        `,
      })
        .then((result) => {
          res.status(200).json({
            code: 200,
            status: httpStatus[200],
            data: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            code: 400,
            status: httpStatus[400],
            data: err,
          });
        });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        data: error,
      });
    }
  } else {
    const { page = 1, product_name, product_code } = req.query;
    const per_page = 10;
    const start = page > 1 ? page * per_page - per_page : 0;

    console.log("query", req.query);

    const totalRow = await excuteQuery({
      query: `select count(*) as totalRow  from product 
      where ${product_name
          ? `product.product_name LIKE '%${product_name}%'`
          : product_code
            ? ` product.product_code LIKE '%${product_code}%'`
            : `product.product_name LIKE '%%'`
        }
       
      
          
          `,
    });
    const newPage = Math.ceil(totalRow[0]?.totalRow / per_page);
    try {
      const data = await excuteQuery({
        query: `
          select product.* , uom.uom_name , category.category_name
          from product
          left join uom 
          on product.uom_id = uom.id
          left join category 
          on product.category_id = category.id
          where ${product_name
            ? `product.product_name LIKE '%${product_name}%'`
            : product_code
              ? ` product.product_code LIKE '%${product_code}%'`
              : `product.product_name LIKE '%%'`
          } 
          order by createdAt DESC
          
          LIMIT ${start} , ${per_page}
          `,
      });

      res.status(200).json({
        status: httpStatus[200],
        code: 200,
        data: data,
        page: parseInt(page),
        last_page: newPage,
        per_page: per_page,
        total: totalRow[0]?.totalRow,
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
