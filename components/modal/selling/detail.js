import { Modal, Table } from "../..";
import { Axios, formatter } from "../../../utils";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

const { DateFormat, MoneyFormat } = formatter;

const ModalDetailSelling = ({ param = {} }) => {
  const { selling_id } = param;
  const { control, setValue } = useForm({
    defaultValues: {
      dataDetail: [],
    },
  });

  const dataDetail = useWatch({
    name: "dataDetail",
    control,
  });

  const getDataDetail = async () => {
    await Axios.get(`transaction/selling/${selling_id}`).then((res) => {
      const data = res.data;
      console.log({ data });
      if (data?.code === 200) {
        setValue("dataDetail", data.data);
      }
    });
  };

  useEffect(() => {
    getDataDetail();
  }, [selling_id]);
  return (
    <Modal
      idModal="ModalDetailSelling"
      title="Detail Modal"
      size="xl"
      childrenFooter={[]}
    >
      <Table
        column={column}
        data={dataDetail.map((item) => ({
          ...item,
          createdAt: DateFormat(item.createdAt),
          price: `Rp. ${MoneyFormat(item.price)}`,
          sub_total: `Rp. ${MoneyFormat(item.sub_total)}`,
        }))}
      />
    </Modal>
  );
};

export default ModalDetailSelling;

const column = [
  {
    title: "product name",
    key: "product_name",
  },
  {
    title: "qty",
    key: "qty",
  },
  {
    title: "price",
    key: "price",
  },
  {
    title: "sub total",
    key: "sub_total",
  },
  {
    title: "Tanggal",
    key: "createdAt",
  },
];
