import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    const { user_id, desc, list_product = [] } = req.body;

    // console.log(r)

    try {
      await excuteQuery({
        query: `
          insert into
          purchasing
          (user_id,purchasing_desc)
          values
          (${user_id},'${desc}')
        `,
      })
        .then((result) => {
          if (result.insertId) {
            list_product.map(async (item) => {
              await excuteQuery({
                query: `
                  insert into
                  purchasing_detail
                  (purchasing_id,product_id,qty)
                  values
                  (${result.insertId}, ${item.product_id},${item.qty})
                `,
              })
                .then((resultProduct) => {
                  res.status(200).json({
                    status: httpStatus[200],
                    code: 200,
                    data: resultProduct,
                  });
                })
                .catch((errProduct) => {
                  res.status(400).json({
                    status: httpStatus[400],
                    code: 400,
                    message: errProduct,
                  });
                });
            });
          } else {
            res.status(400).json({
              status: httpStatus[400],
              code: 400,
              message: "Something Error With list_product",
            });
          }
        })
        .catch((err) => {
          res.status(400).json({
            status: httpStatus[400],
            code: 400,
            message: err,
          });
        });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }
  } else {
    const { page = 1, limit, status, firstname } = req.query;

    const per_page = 10;

    const start = page > 1 ? page * per_page - per_page : 0;

    const totalRow = await excuteQuery({
      query: `select count(*) as totalRow  from purchasing where visibility=1
      and purchasing.purchasing_status like '%${status ?? ""}%'`,
    });

    const last_page = Math.ceil(totalRow[0]?.totalRow / per_page);

    try {
      await excuteQuery({
        query: `
        select purchasing.*, user.firstname 
        from purchasing
        left join user
        on purchasing.user_id = user.id
        where visibility=1
        and purchasing.purchasing_status like '%${status ?? ""}%'
        and user.firstname like '%${firstname ?? ""}%'
        ${limit === "*" ? "" : `LIMIT ${start} , ${per_page}`}
        `,
      }).then(async (result) => {
        if (limit === "*") {
          res.status(200).json({
            status: httpStatus[200],
            code: 200,
            data: result,
          });
        } else {
          res.status(200).json({
            status: httpStatus[200],
            code: 200,
            data: result,
            page: parseInt(page),
            last_page: last_page,
            per_page: per_page,
            total: totalRow[0]?.totalRow,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }
  }
}
