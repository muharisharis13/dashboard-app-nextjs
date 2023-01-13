import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    const { category_name } = req.body;

    try {
      const data = await excuteQuery({
        query: `
         insert into
         category
         (category_name)
         values
         ('${category_name}')
        `,
      });
      const id = data?.insertId;

      const getDetail = await excuteQuery({
        query: `
          select * from category where id=${id}
        `,
      });

      res.status(200).json({
        status: httpStatus[200],
        code: 200,
        data: getDetail[0],
      });
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        data: error,
      });
    }
  } else {
    const { page = 1, category_name } = req.query;
    const per_page = 10;

    const start = page > 1 ? page * per_page - per_page : 0;

    const totalRow = await excuteQuery({
      query: `select count(*) as totalRow  from category ${category_name
        ? `where category_name LIKE '%${category_name}%' `
        : ""
        }`,
    });
    const newPage = Math.ceil(totalRow[0]?.totalRow / per_page);
    try {
      const data = await excuteQuery({
        query: `
          select * from category
          ${category_name
            ? `where category_name LIKE '%${category_name}%' `
            : ""
          }
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
