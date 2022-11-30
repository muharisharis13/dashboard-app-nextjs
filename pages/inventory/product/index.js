import { Table, Search, Pagination, Modal } from "../../../components";
import { useForm, useWatch } from "react-hook-form";

const column = [
  {
    title: "Kode Barang",
    key: "product_code",
  },
  {
    title: "Product Name",
    key: "product_name",
  },
  {
    title: "Qty",
    key: "product_qty",
  },
  {
    title: "Min. Qty",
    key: "product_min_qty",
  },
  {
    title: "UOM",
    key: "product_uom",
  },
  {
    title: "Category",
    key: "product_category",
  },
];

const action = ["Edit", "Hapus"];

const Product = () => {
  const { control, setValue } = useForm({
    defaultValues: {
      data: [
        {
          product_code: "PRD001",
          product_name: "Aqua",
          product_qty: 10,
          product_min_qty: 1,
          product_uom: "PCS",
          product_category: "Minuman",
        },
        {
          product_code: "PRD001",
          product_name: "Termos",
          product_qty: 10,
          product_min_qty: 1,
          product_uom: "PCS",
          product_category: "Alat",
        },
      ],
      total_page: 50,
      current_page: 1,
    },
  });
  const dataProduct = useWatch({
    name: "data",
    control,
  });
  const current_page = useWatch({
    name: "current_page",
    control,
  });
  const total_page = useWatch({
    name: "total_page",
    control,
  });

  const btnSearch = (e) => {
    e.preventDefault();
    alert("hello");
  };

  const btnPagination = (newPage) => {
    setValue("current_page", newPage);
  };

  const initDropdownTable = () => {
    return (
      <td className=" text-end">
        <div className="dropdown">
          <button
            type="button"
            className="btn p-0 dropdown-toggle hide-arrow"
            data-bs-toggle="dropdown"
          >
            <i className="bx bx-dots-vertical-rounded"></i>
          </button>
          <div className="dropdown-menu">
            {action.map((itemAction, idxAction) => (
              <a
                className="dropdown-item"
                key={idxAction}
                data-bs-toggle={itemAction === "Edit" ? "modal" : null}
                data-bs-target={itemAction === "Edit" ? "#ModalEdit" : null}
              >
                {itemAction}
              </a>
            ))}
          </div>
        </div>
      </td>
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <Search btnSearch={btnSearch} />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Table
                data={dataProduct}
                column={column}
                action={initDropdownTable()}
              />
            </div>
            <div className="col-md-12">
              <Pagination
                btnPagination={btnPagination}
                current={current_page}
                total={total_page}
              />
            </div>
          </div>
        </div>
        <Modal idModal="ModalEdit">hahah</Modal>
      </div>
    </div>
  );
};

export default Product;
