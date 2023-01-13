import Select from "react-select";
import { useWatch, useForm, useFormContext } from "react-hook-form";
import { Axios, queryString } from "../../utils";
import { useEffect } from "react";
import chroma from "chroma-js";

const SelectedProductCode = ({ autoFocus = false, searchBy }) => {
  const { setValue, control } = useForm({
    defaultValues: {
      data: [],
      param: {
        product_code: "",
        product_name: "",
      },
      loadingLocal: false,
    },
  });
  const { setValue: setValueContext } = useFormContext();

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? data.color
            : isFocused
              ? color.alpha(0.1).css()
              : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
            ? chroma.contrast(color, "white") > 2
              ? "white"
              : "black"
            : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
  };

  const dataProduct = useWatch({
    name: "data",
    control,
  });
  const selectedProduct = useWatch({
    name: "selected.product",
  });
  const param = useWatch({
    name: "param",
    control,
  });

  const loading = useWatch({
    name: "loadingLocal",
    control,
  });

  const getData = async () => {
    const query = queryString({ ...param });
    setValue("loadingLocal", true);
    await Axios.get(`inventory/product?&${query}`)
      .then((res) => {
        const data = res.data;
        if (data.code == 200) {
          setValue(
            "data",
            data.data.map((item) => ({
              value: item.id,
              label: `${item.product_code} ${item.product_name} `,
              color: item.stock < item.min_stock ? "#ff3e1d" : "#233446",
            }))
          );
        }
        setValue("loadingLocal", false);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    getData();
  }, [param.product_code, param.product_name]);

  const handleOnInputChange = (e) => {
    if (searchBy === "product_code") {
      setValue("param.product_code", e);
      setValue("param.product_name", "");
    } else {
      setValue("param.product_name", e);
      setValue("param.product_code", "");
    }
  };

  return (
    <Select
      isClearable
      placeholder="Select Product Code"
      options={dataProduct}
      value={selectedProduct}
      onInputChange={handleOnInputChange}
      isLoading={loading}
      onChange={(e) => setValueContext("selected.product", e)}
      styles={colourStyles}
      autoFocus={autoFocus}
    />
  );
};

export default SelectedProductCode;
