import Select from "react-select/creatable";
import { useEffect } from "react";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { Axios } from "../../utils";

const SelectCategory = () => {
  const { setValue, control } = useForm({
    defaultValues: {
      data: [],
      param: {
        category_name: ""
      }
    },
  });

  const { setValue: setValueContext } = useFormContext();

  const dataCategory = useWatch({
    name: "data",
    control,
  });

  const selectedCategory = useWatch({
    name: "selected.category",
  });

  const param = useWatch({
    name: "param",
    control
  })

  const getData = async () => {
    const result = await Axios.get(`inventory/category?category_name=${param?.category_name}`);
    const data = result.data;

    if (data?.code === 200) {
      setValue(
        "data",
        data?.data?.map((item) => ({
          value: item.id,
          label: item.category_name,
        }))
      );
    }
  };

  const addData = async (props) => {
    setValueContext("loading", true);
    await Axios.post("inventory/category", {
      category_name: props,
    }).then((res) => {
      const data = res.data;

      if (data.code === 200) {
        setValueContext("toast", {
          show: true,
          title: "Success",
          content: `Berhasil Menambahkan ${data?.data?.category_name}`,
          type: "success",
        });
        getData();
        setValueContext("selected.category", {
          value: data?.data?.id,
          label: data?.data?.category_name,
        });
        setValueContext("loading", false);
      }
    });
  };

  const handleOnchangeSelected = (e) => {
    const isNew = e?.__isNew__;

    if (isNew) {
      addData(e?.value);
    } else {
      setValueContext("selected.category", e);
    }
  };

  const hanledOnInputchange = (e) => {
    setValue("param.category_name", e)
  }

  useEffect(() => {
    getData();
  }, [param.category_name]);
  return (
    <Select
      isClearable
      placeholder="Select Category"
      value={selectedCategory}
      onChange={handleOnchangeSelected}
      options={dataCategory}
      onInputChange={hanledOnInputchange}
    />
  );
};

export default SelectCategory;
