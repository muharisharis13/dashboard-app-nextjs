import excuteQuery from "../../../../database";
import httpStatus from "http-status";


export default async function handler(req, res) {
  const method = req.method
  const { id_category } = req.query
  if (method === "DELETE") {
    const data = await excuteQuery({
      query: `
      delete from category where id=${id_category}
      `
    })



    if (data.protocol41) {
      res.status(200).json({
        code: 200,
        status: httpStatus[200],
        data: 'Success Deleted Data'
      })
    }
    else {
      res.status(400).json({
        code: 400,
        status: httpStatus[400],
        data: 'Something wrong input'
      })
    }
  }
  else if (method === "PUT") {
    const { category_name } = req.body;
    try {
      const data = await excuteQuery({
        query: `
        update category
        set category_name='${category_name}', updatedAt=CURRENT_TIMESTAMP
        where id=${id_category}
        `
      })


      if (data.protocol41) {
        const getData = await excuteQuery({
          query: `select * from category where id=${id_category}`
        })
        res.status(200).json({
          code: 200,
          status: httpStatus[200],
          data: getData[0]
        })
      }
      else {
        res.status(400).json({
          code: 400,
          status: httpStatus[400],
          data: 'Something wrong input'
        })
      }



    } catch (error) {
      res.status(400).json({
        code: 400,
        status: httpStatus[400],
        data: error
      })
    }

  }
  else {
    res.status(400).json({
      status: httpStatus[400],
      code: 400,
      data: "Unvailable Method !",
    });
  }
}