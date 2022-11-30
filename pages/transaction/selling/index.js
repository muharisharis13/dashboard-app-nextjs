import { Table } from "../../../components";
import { useForm, useWatch } from "react-hook-form";

const Selling = () => {
  const { control } = useForm({
    defaultValues: {
      data: [
        {
          product_code: "PRD001",
          product_name: "Aqua",
          product_qty: 1,
          product_price: 10000,
          product_uom: "PCS",
          product_sub_total: 10000,
        },
      ],
    },
  });

  // const dataProduct = useWatch({ name: "data", control });
  const dataProduct = [];

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <Table column={column} data={dataProduct} />
        </div>
      </div>
    </div>
  );
};

export default Selling;

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
    title: "UOM",
    key: "product_uom",
  },
  {
    title: "Price",
    key: "product_price",
  },
  {
    title: "Qty",
    key: "product_qty",
  },
  {
    title: "Sub Total",
    key: "product_sub_total",
  },
];
