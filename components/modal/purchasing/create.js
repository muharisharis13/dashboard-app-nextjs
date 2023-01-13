import { Modal, Table, Select } from "../..";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { Axios, formatter } from "../../../utils";
import Cookies from "js-cookie";
import $ from "jquery";

const { SelectedProduct } = Select;
const { MoneyFormat } = formatter;

const ModalAdd = () => {
  const { setValue: setValueContext } = useFormContext();
  const { setValue, control, register, handleSubmit } = useForm({
    defaultValues: {
      dataProduct: [],
      descriptions: "",
    },
  });

  const dataProduct = useWatch({
    name: "dataProduct",
    control,
  });

  const selectedProduct = useWatch({
    name: "selected.product",
  });

  const isDuplicateProduct = (data) => {
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
          ...data,
          qty: 1,
        },
      ]);
    }
  };

  const getDetailProduct = async (id) => {
    if (id) {
      await Axios.get(`inventory/product/${id}`).then((res) => {
        const data = res.data;

        if (data.code === 200) {
          isDuplicateProduct(data.data);
        }
      });
    } else {
      alert("no selected product, please select product");
    }
  };

  const btnHandleAddProduct = () => {
    const id = selectedProduct?.value;
    getDetailProduct(id);
  };

  const btnDeleteProduct = (id) => {
    setValue(
      "dataProduct",
      dataProduct.filter((filter) => filter.id !== id)
    );
  };

  const btnCreatePurchasing = async (e) => {
    setValueContext("loading", true);
    if (e.dataProduct.length > 0) {
      const body = {
        user_id: Cookies.get("_id"),
        desc: e.descriptions,
        list_product: e.dataProduct?.map((item) => ({
          product_id: item.id,
          qty: parseInt(item.qty),
        })),
      };

      await Axios.post(`transaction/purchasing`, body)
        .then((res) => {
          const data = res.data;

          if (data.code === 200) {
            if (data.data.protocol41) {
              setValueContext("toast", {
                title: "Success",
                content: "Success Create Purchasing",
                show: true,
                type: "success",
              });
              setValue("dataProduct", []);
              setValue("descriptions", "");
            }
            console.log(data);
            $("#closeModal").click();
          } else {
            console.error(data);
          }
        })
        .finally(() => {
          setValueContext("loading", false);
        });
    } else {
      alert("no selected product, please select product");
    }
  };

  return (
    <Modal
      idModal="ModalAddPurchasing"
      title="Create Purchasing"
      size="xl"
      childrenFooter={[
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit(btnCreatePurchasing)}
          key={0}
        >
          Save changes
        </button>,
      ]}
    >
      <div>
        <label htmlFor="uomName" className="form-label">
          Descriptions
        </label>
        <textarea
          type="text"
          placeholder="Descriptions"
          className="form-control"
          rows={5}
          {...register("descriptions")}
        />
      </div>
      <div>
        <label htmlFor="products" className="form-label">
          Products
        </label>
        <div className="row">
          <div className="col-md-4">
            <SelectedProduct />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={btnHandleAddProduct}>
              Add Product
            </button>
          </div>
        </div>
      </div>

      <hr className=" my-4" />

      <div className="row mt-2">
        <div className="col-md-12">
          <Table
            column={columnProduct}
            data={dataProduct.map((item, idx) => ({
              ...item,
              stock: MoneyFormat(item.stock),
              action: [
                <button
                  className="btn"
                  onClick={() => btnDeleteProduct(item.id)}
                  key={0}
                >
                  <i className="bx bx-trash text-danger"></i>
                </button>,
              ],
              qty: (
                <input
                  type="text"
                  className="form-control"
                  placeholder="QTY"
                  {...register(`dataProduct.${idx}.qty`)}
                />
              ),
            }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalAdd;

const columnProduct = [
  {
    title: "Product Code",
    key: "product_code",
  },
  {
    title: "Product Name",
    key: "product_name",
  },
  {
    title: "QTY",
    key: "qty",
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
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
