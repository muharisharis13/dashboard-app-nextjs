import excuteQuery from "../../../../database";
import httpStatus from "http-status";

const handler = async (req, res) => {
  const method = req.method;

  if (method === "POST") {
    const { user_id, total, input_cash, list_product = [] } = req.body;

    try {
      let TotalBelanja = list_product
        .map((item) => parseInt(item.qty) * parseInt(item.price))
        .reduce((prev, next) => prev + next, 0);

      if (TotalBelanja === total) {
        await excuteQuery({
          query: `
            insert into selling
            (user_id,total,input_cash)
            values
            (${user_id},${total},${input_cash})
          `,
        })
          .then((result) => {
            if (result.insertId) {
              list_product.map(async (item) => {
                await excuteQuery({
                  query: `
                  insert into selling_detail
                  (selling_id, product_id, qty, price, sub_total)values
                  (${result.insertId}, ${item.product_id}, ${item.qty}, ${
                    item.price
                  }, ${parseInt(item.qty) * parseInt(item.price)})
                `,
                })
                  .then((resultProduct) => {
                    res.status(200).json({
                      status: httpStatus[200],
                      code: 200,
                      data: resultProduct,
                    });
                  })
                  .catch((err) => {
                    res.status(400).json({
                      status: httpStatus[400],
                      code: 400,
                      message: err,
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
              code: 400,
              status: httpStatus[400],
              message: err,
            });
          });
      } else {
        res.status(400).json({
          code: 400,
          status: httpStatus[400],
          message: "Total is not same with total list_product",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: httpStatus[500],
        message: "Internal Error",
      });
    }
  } else {
    const { page = 1, limit, firstname } = req.query;

    const per_page = 10;

    const start = page > 1 ? page * per_page - per_page : 0;

    const totalRow = await excuteQuery({
      query: `select count(*) as totalRow  from selling `,
    });

    const last_page = Math.ceil(totalRow[0]?.totalRow / per_page);

    const totalRowSellingDetail = await excuteQuery({
      query: `select * from selling_detail`,
    });

    try {
      await excuteQuery({
        query: `
        select selling.*, user.firstname 
        from selling
        left join user
        on selling.user_id = user.id
        where 
        user.firstname like '%${firstname ?? ""}%'
        order by createdAt DESC
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
          const data = result.map((item) => ({
            ...item,
            totalItem: totalRowSellingDetail?.filter(
              (filter) => filter.selling_id === item.id
            ).length,
          }));
          res.status(200).json({
            status: httpStatus[200],
            code: 200,
            data: data,
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
};

export default handler;
