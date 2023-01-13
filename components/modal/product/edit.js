import { Modal, Select } from "../../../components";
import { Axios } from "../../../utils";
import { useEffect } from "react";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import $ from "jquery";

const { SelectCategory, SelectedUOM, SelectedTypePrice } = Select;

const ModalEdit = ({ propsParam, getDataProduct }) => {
  const { id } = propsParam;
  const { control, setValue, register, handleSubmit } = useForm({
    defaultValues: {
      data: {},
    },
  });

  const { setValue: setValueContext } = useFormContext();

  const dataDetail = useWatch({
    name: "data",
    control,
  });

  const selectedContext = useWatch({ name: "selected" });

  const getDataDetail = async () => {
    const result = await Axios.get(`inventory/product/${id}`);
    const data = result.data;
    setValueContext("loading", true);
    if (data.code === 200) {
      setValue("data", data.data);
      setValueContext("selected.category", {
        value: data?.data?.category_id,
        label: data?.data?.category_name,
      });
      setValueContext("selected.uom", {
        value: data?.data?.uom_id,
        label: data?.data?.uom_name,
      });
      setValueContext("selected.type_price", {
        value: data?.data?.type_price,
        label: data?.data?.type_price == "fix" ? "FIX" : "NO FIX",
      });
    }
    setValueContext("loading", false);
  };

  const EditData = async (e) => {
    const { data: dataParam } = e;
    setValueContext("loading", true);
    const body = {
      ...dataParam,
      uom_id: selectedContext["uom"]?.value,
      category_id: selectedContext["category"]?.value,
      type_price: selectedContext["type_price"]?.value,
    };

    await Axios.put(`inventory/product/${id}`, body)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 200) {
          setValueContext("toast", {
            title: `Success updated ${dataDetail?.product_code}`,
            content: data,
            show: true,
            type: "success",
          });
          $("#closeModal").click();
          getDataProduct();
        } else {
          alert("something wrong !");
        }
        console.log({ res: res.data });
        setValueContext("loading", false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (id) {
      getDataDetail();
    }
  }, [id]);

  return (
    <Modal
      size="lg"
      idModal="ModalEdit"
      title={`Product ${dataDetail?.product_code}`}
      childrenFooter={[
        <button
          className="btn btn-primary"
          onClick={handleSubmit(EditData)}
          key={0}
        >
          Update {dataDetail?.product_code}
        </button>,
      ]}
    >
      <div className="row">
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              aria-describedby="product_name"
              {...register("data.product_name")}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Category Product
            </label>
            <SelectCategory />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Category UOM
            </label>
            <SelectedUOM />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Capital Price
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              aria-describedby="capital_price"
              {...register("data.capital_price")}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Price
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              aria-describedby="price"
              {...register("data.price")}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Min. Stock
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              aria-describedby="min_stock"
              {...register("data.min_stock")}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Stock
            </label>
            <input
              disabled
              type="text"
              className="form-control"
              placeholder="Product Name"
              aria-describedby="stock"
              {...register("data.stock")}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-2">
          <div>
            <label for="defaultFormControlInput" className="form-label">
              Type Price
            </label>
            <SelectedTypePrice />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEdit;
