import { Table, Pagination } from "../../../components";
import { Axios, formatter, queryString } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import Modal from "../../../components/modal/selling";

const { MoneyFormat, DateFormat } = formatter;
const { ModalDetailSelling } = Modal();

const Selling = () => {
  const { setValue: setValueContext } = useFormContext();
  const { control, setValue } = useForm({
    defaultValues: {
      dataSelling: [],
      total_page: 1,
      current_page: 1,
      param: {
        selling_id: null,
      },
    },
  });

  // const dataProduct = useWatch({ name: "data", control });
  const dataProduct = useWatch({
    name: "dataSelling",
    control,
  });

  const total_page = useWatch({
    control,
    name: "total_page",
  });

  const current_page = useWatch({
    name: "current_page",
    control,
  });

  const loading = useWatch({
    name: "loading",
  });
  const param = useWatch({
    name: "param",
    control,
  });

  const query = queryString({
    page: current_page,
  });

  const getData = async () => {
    setValueContext("loading", true);
    await Axios.get(`transaction/selling?${query}`)
      .then((res) => {
        const data = res.data;
        if (data?.code === 200) {
          setValue("dataSelling", data?.data);
          setValue("current_page", data?.page);
          setValue("total_page", data?.last_page);
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setValueContext("loading", false);
      });
  };
  useEffect(() => {
    setValueContext("loading", true);
  }, []);

  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);

  const btnPagination = (newPage) => {
    setValueContext("loading", true);
    setValue("current_page", newPage);
  };

  const btnDetail = (id) => {
    setValue("param.selling_id", id);
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <Table
                column={column}
                data={dataProduct.map((item) => ({
                  ...item,
                  createdAt: DateFormat(item.createdAt),
                  total: `Rp. ${MoneyFormat(item.total)}`,
                  input_cash: `Rp. ${MoneyFormat(item.input_cash)}`,
                  action: [
                    <button
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalDetailSelling"
                      id="btnDetailSelling"
                      onClick={() => btnDetail(item.id)}
                      key={0}
                    >
                      <i className="bx bx-edit text-primary"></i>
                    </button>,
                  ],
                }))}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Pagination
                btnPagination={btnPagination}
                total={total_page}
                current={current_page}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalDetailSelling param={param} />
    </div>
  );
};

export default Selling;

const column = [
  {
    title: "Admin Name",
    key: "firstname",
    className: "text-uppercase",
  },
  {
    title: "Total",
    key: "total",
  },
  {
    title: "Di Bayar",
    key: "input_cash",
  },

  {
    title: "Total Item",
    key: "totalItem",
  },
  {
    title: "Tanggal",
    key: "createdAt",
  },
  {
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
