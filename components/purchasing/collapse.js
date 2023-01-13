import { Table, Badges, Select } from "..";
import { formatter } from "../../utils";

const { MoneyFormat } = formatter;
const { SelectedProduct } = Select;

const PurchasingCollapse = ({
  data_detail,
  btnDelete = () => null,
  register,
  updateQtyDetailProduct,
  handleSubmit,
  btnProcced = () => null,
  btnCancel = () => null,
  addProductDetail = () => null,
}) => {
  return (
    <div
      className=" mt-2 collapse"
      id={`collapseDetail${data_detail?.id ? data_detail?.id : 1}`}
    >
      <div className="card">
        <div className="card-body">
          <h2>Detail Purchasing {data_detail?.firstname}</h2>
          <div className="row mt-3">
            <div className="col-md-12">
              <h6>Purchasing Info</h6>
            </div>
            <div className="col-md-2">
              <strong>ID</strong>
            </div>
            <div className="col-md-10">: {data_detail?.id}</div>
            <div className="col-md-2">
              <strong>Name</strong>
            </div>
            <div className="col-md-10">: {data_detail?.firstname}</div>
            <div className="col-md-2">
              <strong>Status</strong>
            </div>
            <div className="col-md-10">
              :{" "}
              <Badges
                label={data_detail.purchasing_status}
                type={
                  data_detail.purchasing_status == "waiting"
                    ? "warning"
                    : data_detail.purchasing_status == "process"
                    ? "info"
                    : data_detail.purchasing_status == "complete"
                    ? "success"
                    : "danger"
                }
              />
            </div>
            <div className="col-md-2">
              <strong>Total</strong>
            </div>
            <div className="col-md-10">
              : Rp. {MoneyFormat(data_detail?.purchasing_total)}
            </div>
            <div className="col-md-2">
              <strong>Descriptions</strong>
            </div>
            <div className="col-md-10">: {data_detail?.purchasing_desc}</div>
          </div>

          <hr className="mt-4 mb-4" />

          <div className="form-horizontal">
            <h6>Product Detail</h6>
            {data_detail.purchasing_status === "waiting" ? (
              <button
                className="btn btn-info"
                data-bs-toggle="collapse"
                data-bs-target="#collapse-detail-addProduct"
              >
                Add Product
              </button>
            ) : null}
          </div>

          <div id="collapse-detail-addProduct" className="collapse mt-2">
            {data_detail.purchasing_status === "waiting" ? (
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="" className="form-label">
                    Product
                  </label>
                  <div className="row">
                    <div className="col-md-6">
                      <SelectedProduct />
                    </div>
                    <div className="col-md-6">
                      <button
                        className="btn btn-primary"
                        onClick={addProductDetail}
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="row">
            <div className="col-md-12">
              <Table
                column={columnProduct}
                data={data_detail?.list_product?.map((item, idx) => ({
                  ...item,
                  capital_price: `Rp. ${MoneyFormat(item.capital_price)}`,
                  sub_total: `Rp. ${MoneyFormat(item.sub_total)}`,
                  price: (
                    <form
                      onSubmit={handleSubmit((e) =>
                        updateQtyDetailProduct(e, item.id)
                      )}
                    >
                      <input
                        className="form-control"
                        {...register(`data_detail.list_product.${idx}.price`)}
                        placeholder="Price"
                        disabled={
                          data_detail?.purchasing_status === "waiting"
                            ? false
                            : true
                        }
                      />
                    </form>
                  ),
                  stock: MoneyFormat(item.stock),
                  category_name: item?.category_name ?? "-",
                  qty: (
                    <form
                      onSubmit={handleSubmit((e) =>
                        updateQtyDetailProduct(e, item.id)
                      )}
                    >
                      <input
                        className="form-control"
                        {...register(`data_detail.list_product.${idx}.qty`)}
                        placeholder="QTY"
                        disabled={
                          data_detail?.purchasing_status === "waiting"
                            ? false
                            : true
                        }
                      />
                    </form>
                  ),
                  action: [
                    data_detail.purchasing_status === "complete" ||
                    data_detail.purchasing_status === "cancel" ? null : (
                      <button
                        className={`btn btn-sm`}
                        onClick={() => btnDelete(item.id)}
                        disabled={
                          data_detail?.purchasing_status === "waiting"
                            ? false
                            : true
                        }
                      >
                        <i className="bx bx-trash text-danger"></i>
                      </button>
                    ),
                  ],
                }))}
              />
            </div>
          </div>
        </div>
        <div className="card-footer text-end gap-3 d-flex justify-content-end">
          {data_detail.purchasing_status === "cancel" ||
          data_detail.purchasing_status === "complete" ? null : (
            <button className="btn btn-danger" onClick={btnCancel}>
              Cancel
            </button>
          )}
          {data_detail.purchasing_status === "cancel" ||
          data_detail.purchasing_status === "complete" ? null : (
            <button className="btn btn-primary" onClick={btnProcced}>
              Continues
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasingCollapse;

const columnProduct = [
  {
    title: "Kode Barang",
    key: "product_code",
  },
  {
    title: "Product Name",
    key: "product_name",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Qty",
    key: "qty",
    className: "text-uppercase",
  },

  {
    title: "Current Stock",
    key: "stock",
  },
  {
    title: "UOM",
    key: "uom_name",
  },

  {
    title: "Sub Total",
    key: "sub_total",
  },
  {
    title: "Capital Price",
    key: "capital_price",
  },
  {
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
