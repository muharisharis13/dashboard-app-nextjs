import Select from "react-select/creatable";
import { useEffect } from "react";
import { Axios } from "../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";

const SelectUom = () => {
  const { setValue, control } = useForm({
    defaultValues: {
      data: [],
    },
  });

  const { setValue: setValueContext } = useFormContext();

  const dataUom = useWatch({
    name: "data",
    control,
  });

  const selectedUom = useWatch({
    name: "selected.uom",
  });

  const getData = async () => {
    const result = await Axios.get(`inventory/uom?limit=*`);
    const data = result.data;

    if (data?.code === 200) {
      setValue(
        "data",
        data?.data?.map((item) => ({
          value: item.id,
          label: item.uom_name,
        }))
      );
    }
  };

  const addData = async (props) => {
    setValueContext("loading", true);
    await Axios.post("inventory/uom", {
      uom_name: props,
    }).then((res) => {
      const data = res.data;
      if (data.code === 200) {
        // alert("Berhasil");
        setValueContext("toast", {
          show: true,
          title: "Success",
          content: `Berhasil Menambahkan ${data?.data?.uom_name}`,
          type: "success",
        });
        getData();
        setValueContext("selected.category", {
          value: data?.data?.id,
          label: data?.data?.uom_name,
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
      setValueContext("selected.uom", e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Select
      isClearable
      placeholder="Select UOM"
      value={selectedUom}
      onChange={handleOnchangeSelected}
      options={dataUom}
      // components={{ Menu }}
    />
  );
};

export default SelectUom;
