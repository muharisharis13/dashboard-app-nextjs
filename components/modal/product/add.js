// @refresh reset
import { Modal, Select } from "../..";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { Axios } from "../../../utils";
import $ from "jquery";

const { SelectCategory, SelectedUOM, SelectedTypePrice } = Select;

const ModalAdd = ({ getDataProduct }) => {
  // const router = useRouter();
  const selectedCategory = useWatch({
    name: "selected",
  });
  const { setValue: setValueFrom } = useFormContext();
  const { register, getValues, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      param: {
        product_code: null,
        product_name: null,
        capital_price: null,
        price: null,
        stock: null,
        min_stock: null,
        uom_id: null,
        category_id: null,
        type_price: null,
      },
    },
  });

  const param = getValues("param");

  const use_barcode = useWatch({
    name: "use_barcode",
    control,
  });

  const btnSimpan = async (e) => {
    const { param } = e;
    const body = {
      ...param,
      category_id: selectedCategory["category"]?.value,
      uom_id: selectedCategory["uom"]?.value,
      type_price: selectedCategory["type_price"]?.value,
    };
    setValueFrom("loading", true);
    await Axios.post(`inventory/product`, body)
      .then((res) => {
        console.log({ res });
        const { data } = res;
        if (!data.data?.error) {
          setValueFrom("toast", {
            title: "Success",
            content: `Success add product`,
            show: true,
            type: "success",
          });
          $("#btnAdd").click();
          setValue("param", {
            product_code: null,
            product_name: null,
            capital_price: null,
            price: null,
            stock: null,
            min_stock: null,
            uom_id: null,
            category_id: null,
            type_price: null,
          });
          setValueFrom("selected", {
            category: "",
            uom: "",
            type_price: "",
          });
          getDataProduct();
        } else {
          alert(data.data?.error?.sqlMessage);
        }
        router.push("/inventory/product", undefined, { shallow: true });
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => setValueFrom("loading", false));
  };

  return (
    <Modal
      idModal="ModalAdd"
      title="Add Product"
      childrenFooter={[
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit(btnSimpan)}
          key={0}
        >
          Add Product
        </button>,
      ]}
    >
      <div className="row">
        {Object.keys(param)?.map((item, idx) => (
          <div className="col-md-6 col-sm-12 p-2" key={idx}>
            <div>
              <label for="defaultFormControlInput" className="form-label">
                {item.replace("_", " ").replace("id", "")}
              </label>
              {item === "category_id" ? (
                <SelectCategory />
              ) : item === "type_price" ? (
                <SelectedTypePrice />
              ) : item === "uom_id" ? (
                <SelectedUOM />
              ) : (
                <input
                  type={
                    item === "capital_price" ||
                    item === "price" ||
                    item === "stock" ||
                    item === "min_stock"
                      ? "number"
                      : "text"
                  }
                  className="form-control"
                  placeholder={item.replace("_", " ")}
                  aria-describedby={item.replace}
                  {...register(`param.${item}`)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ModalAdd;
