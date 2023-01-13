import Select from "react-select";
import { useWatch, useFormContext } from "react-hook-form";

const SelectTypePrice = () => {
  const { setValue: setValueContext } = useFormContext();
  const dataTypePrice = [
    { value: "fix", label: "FIX" },
    { value: "no_fix", label: "NO FIX" },
  ];

  const selectedTypePrice = useWatch({
    name: "selected.type_price",
  });

  const handleOnchangeSelected = (e) => {
    setValueContext("selected.type_price", e);
  };
  return (
    <Select
      placeholder="Select Type Price"
      value={selectedTypePrice}
      onChange={handleOnchangeSelected}
      options={dataTypePrice}
    />
  );
};

export default SelectTypePrice;
