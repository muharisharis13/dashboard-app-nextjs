const Pagination = ({
  total = 50,
  current = 2,
  btnPagination = () => null,
}) => {
  const handlePageChanged = (newPage) => {
    btnPagination(newPage);
  };
  let newTotal = Array.from(Array(total).keys());

  let start = current - 3 < 0 ? 0 : current - 3;
  let end = current + 3 > total ? total : current + 3;

  const initPaging2 = () => {
    return (
      <ul className="pagination">
        <li
          className={
            current === 1 ? "page-item first disabled" : "page-item first"
          }
        >
          <a className="page-link" onClick={() => handlePageChanged(1)}>
            <i className="tf-icon bx bx-chevrons-left"></i>
          </a>
        </li>
        <li
          className={
            current === 1 ? "page-item prev disabled" : "page-item prev"
          }
        >
          <a
            className="page-link"
            onClick={() => handlePageChanged(current - 1)}
          >
            <i className="tf-icon bx bx-chevron-left"></i>
          </a>
        </li>
        {newTotal.slice(start, end).map((item, idx) => (
          <li
            className={` page-item ${item + 1 === current ? "active" : null}`}
            style={{ cursor: "pointer" }}
            key={idx}
          >
            <a
              className="page-link"
              onClick={() => handlePageChanged(item + 1)}
            >
              {item + 1}
            </a>
          </li>
        ))}
        <li
          className={
            current === total ? "page-item next disabled" : "page-item next"
          }
        >
          <a
            className="page-link"
            onClick={() => handlePageChanged(current + 1)}
          >
            <i className="tf-icon bx bx-chevron-right"></i>
          </a>
        </li>
        <li
          className={
            current === total ? "page-item last disabled" : "page-item last"
          }
        >
          <a className="page-link" onClick={() => handlePageChanged(total)}>
            <i className="tf-icon bx bx-chevrons-right"></i>
          </a>
        </li>
      </ul>
    );
  };

  return <nav aria-label="Page navigation">{initPaging2()}</nav>;
};

export default Pagination;
