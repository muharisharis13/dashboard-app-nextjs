import { Select, Table, Swal } from "../../../components";
import { Axios, formatter } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import SwalAlert from "sweetalert2";
import Cookies from "js-cookie";

const { SelectedProductCode } = Select;
const { MoneyFormat } = formatter;
const { Sweetalert2Question } = Swal;

const SellinCashier = () => {
  const { setValue: setValueContext } = useFormContext();
  const { control, setValue, register } = useForm({
    defaultValues: {
      dataProduct: [],
      focusSelect: true,
      radioChecked: "product_code",
      inputCash: 0,
    },
  });

  const dataProduct = useWatch({
    name: "dataProduct",
    control,
  });

  const selectedProduct = useWatch({
    name: "selected.product",
  });

  const focusSelect = useWatch({
    name: "focusSelect",
    control,
  });

  const radioChecked = useWatch({
    name: "radioChecked",
    control,
  });

  const inputCash = useWatch({
    name: "inputCash",
    control,
  });

  const getDetailProduct = async (id) => {
    await Axios.get(`inventory/product/${id}`).then((res) => {
      const data = res.data;

      if (data.code === 200) {
        const getDuplicateProduct = dataProduct.filter(
          (filter) => filter.id === selectedProduct.value
        );
        if (getDuplicateProduct.length === 1) {
          setValue(
            "dataProduct",
            dataProduct.map((item) => ({
              ...item,
              qty: item.id === selectedProduct.value ? item.qty + 1 : item.qty,
            }))
          );
        } else {
          setValue("dataProduct", [
            ...dataProduct,
            {
              ...data.data,
              qty: 1,
            },
          ]);
        }
      }
    });
  };

  useEffect(() => {
    if (selectedProduct?.value) {
      getDetailProduct(selectedProduct?.value);
      setValueContext("selected.product", "");
    }
  }, [selectedProduct?.value]);

  const btnDeleteProduct = (id) => {
    setValue("dataProduct", [
      ...dataProduct.filter((filter) => filter.id !== id),
    ]);
  };

  let TotalBelanja = dataProduct
    .map((item) => parseInt(item.qty) * parseInt(item.price))
    .reduce((prev, next) => prev + next, 0);

  const btnCreateSelling = () => {
    if (inputCash < TotalBelanja) {
      SwalAlert.fire(
        "Warning",
        `Uang Customer Kurang Rp. ${MoneyFormat(
          parseInt(TotalBelanja) - parseInt(inputCash)
        )}`,
        "warning"
      );
    } else {
      Sweetalert2Question({
        title: "Questions",
        text: "Yakin untuk membuat Penjualan ?",
        icon: "warning",
      }).then(async (res) => {
        if (res.isConfirmed) {
          setValueContext("loading", true);

          const body = {
            user_id: Cookies.get("_id"),
            total: TotalBelanja,
            input_cash: inputCash,
            list_product: dataProduct.map((item) => ({
              product_id: item.id,
              qty: item.qty,
              price: item.price,
            })),
          };

          await Axios.post(`transaction/selling`, body)
            .then((res) => {
              const data = res.data;

              if (data.data?.protocol41) {
                SwalAlert.fire(
                  "Information",
                  `Berhasil Melakukan Transaction Selling`,
                  "success"
                );
                setValue("dataProduct", []);
                setValue("focusSelect", true);
                setValue("inputCash", 0);
                setValue("radioChecked", "product_code");
              } else {
                alert("alert else", data.error.sqlMessage);
              }
            })
            .catch((err) => {
              console.log({ err });
            })
            .finally(() => {
              setValueContext("loading", false);
            });
        }
      });
    }
  };

  console.log({ dataProduct });

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <form action="" className="form-label">
                Search Product
              </form>
              <SelectedProductCode
                autoFocus={focusSelect}
                searchBy={radioChecked}
              />
              <span>
                <small className="form-label">
                  Search by :
                  <div className="d-flex gap-2">
                    <div className="form-check">
                      <input
                        type="radio"
                        name="search_type"
                        id="product_code"
                        className="form-check-input"
                        checked={radioChecked === "product_code" ? true : false}
                        onChange={() =>
                          setValue("radioChecked", "product_code")
                        }
                      />
                      <label
                        htmlFor="product_code"
                        className="form-check-label"
                      >
                        By Code
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="search_type"
                        id="product_name"
                        className="form-check-input"
                        checked={radioChecked === "product_name" ? true : false}
                        onChange={() =>
                          setValue("radioChecked", "product_name")
                        }
                      />
                      <label
                        htmlFor="product_name"
                        className="form-check-label"
                      >
                        By Name
                      </label>
                    </div>
                  </div>
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <Table
            column={ColumnProduct}
            data={dataProduct.map((item, idx) => ({
              ...item,
              type_price: item.type_price === "no_fix" ? "NO FIX" : "FIX",
              qty: (
                <input
                  className="form-control"
                  placeholder="Qty"
                  // {...register(`dataProduct.${idx}.qty`)}
                  onChange={(e) =>
                    setValue(
                      `dataProduct.${idx}.qty`,
                      parseInt(e.target.value) >= parseInt(item.stock)
                        ? item.stock
                        : e.target.value
                    )
                  }
                  value={item.qty}
                />
              ),
              action: [
                <button
                  className="btn"
                  onClick={() => btnDeleteProduct(item.id)}
                  key={0}
                >
                  <i className="bx bx-trash text-danger"></i>
                </button>,
              ],
              price:
                item.type_price === "no_fix" ? (
                  <input
                    className="form-control"
                    placeholder="Price"
                    {...register(`dataProduct.${idx}.price`)}
                  />
                ) : (
                  `Rp. ${MoneyFormat(item.price)}`
                ),
              capital_price: MoneyFormat(item.capital_price),
              subtotal: `Rp. ${MoneyFormat(
                parseInt(item.qty) * parseInt(item.price)
              )}`,
            }))}
          />
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className=" w-25">
            <table className="table table-responsive table-borderless">
              <tr>
                <th>Total</th>
                <td>: Rp. {MoneyFormat(TotalBelanja)}</td>
              </tr>
              <tr>
                <th>Cash</th>
                <td className="d-flex align-items-center">
                  :
                  <div className=" h-50">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Cash"
                      {...register("inputCash")}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  {parseInt(inputCash) > parseInt(TotalBelanja)
                    ? "Kembalian"
                    : "Kurang"}
                </th>
                <td>
                  : Rp.{" "}
                  {parseInt(inputCash) > parseInt(TotalBelanja)
                    ? MoneyFormat(parseInt(inputCash) - parseInt(TotalBelanja))
                    : MoneyFormat(parseInt(TotalBelanja) - parseInt(inputCash))}
                </td>
              </tr>
            </table>
          </div>

          <div className="form-horizontal mt-5">
            <button className="btn btn-primary" onClick={btnCreateSelling}>
              Create Selling
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellinCashier;

const ColumnProduct = [
  {
    title: "Product Code",
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
    title: "QTY",
    key: "qty",
  },
  {
    title: "Stock",
    key: "stock",
  },
  {
    title: "Cap. Price",
    key: "capital_price",
  },
  {
    title: "Type Price",
    key: "type_price",
  },
  {
    title: "Subtotal",
    key: "subtotal",
  },
  {
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
