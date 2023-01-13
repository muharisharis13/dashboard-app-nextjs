import { PageError } from "../components";

const Table = ({ data = [], column = [], action }) => {
  return (
    <div
      className="table-responsive text-nowrap"
      style={{ minHeight: "500px" }}
    >
      <table className="table">
        <thead>
          <tr>
            {column.map((item, idx) => {
              return (
                <th className={item.className} key={idx}>
                  {item.title}
                </th>
              );
            })}
            {action ? <th className="text-end">Action</th> : null}
          </tr>
        </thead>
        <tbody className="table-border-bottom-0">
          {data.length > 0 ? (
            data.map((item, idx) => {
              return (
                <tr key={idx}>
                  {column.map((itemColumn, idxColumn) => (
                    <td className={itemColumn.className} key={idxColumn}>
                      {item[itemColumn.key] ?? "-"}
                    </td>
                  ))}
                  {action ? <td className="text-end">{action}</td> : null}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={action ? column.length + 1 : column.length}
                className="text-center"
              >
                <PageError title="Data Not Found" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
