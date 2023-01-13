import excuteQuery from "../../../../database";
import httpStatus from "http-status";

export default async function handler(req, res) {
  const method = req.method
  const { uom_id } = req.query



  if (method === "PUT") {
    const { uom_name } = req.body
    try {
      await excuteQuery({
        query: `
          update uom set uom_name='${uom_name}' where id=${uom_id}
        `
      })
        .then(async result => {
          if (result.protocol41) {
            const getData = await excuteQuery({
              query: `select * from uom where id=${uom_id}`
            })
            res.status(200).json({
              status: httpStatus[200],
              code: 200,
              data: getData[0]
            })
          }
          else {
            res.status(200).json({
              status: httpStatus[200],
              code: 200,
              data: result,
            })
          }

        })
        .catch(err => {
          res.status(400).json({
            status: httpStatus[400],
            code: 400,
            message: err,
          });
        })
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }

  }
  else if (method === "DELETE") {

    try {
      await excuteQuery({
        query: `
          delete from uom where id=${uom_id}
        `
      })
        .then(result => {
          if (result.protocol41) {

            res.status(200).json({
              status: httpStatus[200],
              code: 200,
              data: {
                message: `Successfully deleted data`
              },
            })
          }
          else {
            res.status(200).json({
              status: httpStatus[200],
              code: 200,
              data: result,
            })
          }

        })
        .catch(err => {
          res.status(400).json({
            status: httpStatus[400],
            code: 400,
            message: err,
          });
        })
    } catch (error) {
      res.status(500).json({
        status: httpStatus[500],
        code: 500,
        message: error,
      });
    }

  }
  else {
    res.status(400).json({
      code: 400,
      status: httpStatus[400],
      message: "Error Method !"
    })
  }
}