import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method;
  if (method === "POST") {
    const { uom_name } = req.body;
    try {
      const data = await excuteQuery({
        query: `
        insert into
        uom
        (uom_name)
        values
        ('${uom_name}')
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
        data: error,
      });
    }
  } else {
    const { page = 1, uom_name, limit } = req.query;
    const per_page = 10;

    const start = page > 1 ? page * per_page - per_page : 0;

    const totalRow = await excuteQuery({
      query: `select count(*) as totalRow  from uom  ${
        uom_name ? `where uom_name LIKE '%${uom_name}%' ` : ""
      }`,
    });
    const last_page = Math.ceil(totalRow[0]?.totalRow / per_page);
    try {
      const data = await excuteQuery({
        query: `
          select * from uom
          ${uom_name ? `where uom_name LIKE '%${uom_name}%' ` : ""}
          ${limit === "*" ? "" : `LIMIT ${start} , ${per_page}`}
        `,
      });

      if (limit === "*") {
        res.status(200).json({
          status: httpStatus[200],
          code: 200,
          data: data,
        });
      } else {
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
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        data: error,
      });
    }
  }
}
