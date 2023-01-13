import { Table, Search, Pagination, Swal, Badges } from "../../../components";
import { Axios, queryString, formatter } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import Components from "../../../components/purchasing";
import Modal from "../../../components/modal/purchasing";

const { DateFormat, MoneyFormat } = formatter;
const { PurchasingCollapse } = Components();
const { ModalCreate } = Modal();
const Purchasing = () => {
  const { setValue: setValueFrom, control: controlContext } = useFormContext();
  const { control, setValue, register, handleSubmit } = useForm({
    defaultValues: {
      data: [],
      total_page: 1,
      current_page: 1,
      search: null,
      param: {
        checked: "",
      },
      search: "",
      data_detail: {},
    },
  });

  const param = useWatch({
    name: "param",
    control,
  });

  const data = useWatch({
    name: "data",
    control,
  });

  const data_detail = useWatch({
    name: "data_detail",
    control,
  });

  const current_page = useWatch({
    name: "current_page",
    control,
  });
  const total_page = useWatch({
    name: "total_page",
    control,
  });
  const search = useWatch({
    name: "search",
    control,
  });

  const selectedContext = useWatch({
    name: "selected",
    control: controlContext,
  });
  const loading = useWatch({ name: "loading" });

  const getData = async (paramQuery) => {
    const query = queryString(
      paramQuery ?? {
        page: current_page,
        status: param.checked,
        firstname: search,
      }
    );
    setValueFrom("loading", true);
    // $("#btn-action-purchasing").click();
    await Axios.get(`transaction/purchasing?&${query}`)
      .then((res) => {
        const data = res.data;
        console.log({ data });
        if (data.code === 200) {
          setValue("data", data.data);
          setValue("current_page", data?.page);
          setValue("total_page", data?.last_page);
        }
      })

      .catch((err) => {
        console.error({ err });
      })
      .finally(() => setValueFrom("loading", false));
  };

  const getDetail = async (id) => {
    setValueFrom("loading", true);
    await Axios.get(`transaction/purchasing/${id}`)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          setValue("data_detail", data.data);
        }
      })

      .catch((err) => {
        console.error({ err });
      })
      .finally(() => setValueFrom("loading", false));
  };

  const addProductDetail = async () => {
    await Axios.post(`transaction/purchasing/add/${data_detail?.id}`, {
      product_id: selectedContext.product?.value,
    }).then((res) => {
      const data = res.data;
      if (data?.code === 200 && data.data) {
        setValueFrom("toast", {
          title: "Success",
          content: "Success Add Product",
          show: true,
          type: "success",
        });
        getDetail(data_detail?.id);
      } else {
        setValueFrom("toast", {
          title: "Error",
          content: data.message,
          show: true,
          type: "danger",
        });
      }
      setValueFrom("selected.product", "");
    });
  };

  // useEffect(() => {
  //   if (data_detail?.id && selectedContext.product?.value) addProductDetail();
  // }, [selectedContext.product?.value]);

  useEffect(() => {
    setValueFrom("loading", true);
  }, []);

  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);

  const btnPagination = (newPage) => {
    setValueFrom("loading", true);
    setValue("current_page", newPage);
  };

  const btnFilterStatus = (e, item) => {
    console.log({ item });
    setValueFrom("loading", true);
    setValue("param.checked", item);
  };

  const btnSearch = (e) => {
    setValueFrom("loading", true);
  };

  const btnDelete = async (idProductDetail) => {
    const body = {
      purchasing_detail_id: idProductDetail,
    };
    await Axios.delete(`transaction/purchasing/delete/${data_detail?.id}`, {
      data: body,
    }).then((res) => {
      const data = res.data;
      if (data?.code === 200 && data.data?.protocol41) {
        setValueFrom("toast", {
          title: "Success",
          content: "Success Delete Product",
          show: true,
          type: "success",
        });
        getDetail(data_detail?.id);
      } else {
        setValueFrom("toast", {
          title: "Error",
          content: "Something Wrong",
          show: true,
          type: "danger",
        });
      }
    });
  };

  const updateQtyDetailProduct = async (e, itemId) => {
    // console.log({ e });
    const getDataDetailProduct = data_detail.list_product.find(
      (filter) => filter.id === itemId
    );
    const body = {
      purchasing_detail_id: itemId,
      product_id: getDataDetailProduct?.product_id,
      qty: parseInt(getDataDetailProduct?.qty),
      price: parseInt(getDataDetailProduct?.price),
    };

    await Axios.put(
      `transaction/purchasing/update/${data_detail?.id}`,
      body
    ).then((res) => {
      const data = res.data;
      if (data.code === 200 && data.data) {
        setValueFrom("toast", {
          title: "Success",
          content: "Success Update QTY or Price",
          show: true,
          type: "success",
        });
        getDetail(data_detail?.id);
      } else {
        setValueFrom("toast", {
          title: "Error",
          content: "Something Wrong",
          show: true,
          type: "danger",
        });
      }
    });
  };

  const btnProcced = async () => {
    const body = {
      purchasing_status:
        data_detail?.purchasing_status === "waiting"
          ? "process"
          : data_detail?.purchasing_status === "process"
          ? "complete"
          : "",
    };
    await Axios.put(`transaction/purchasing/proced/${data_detail?.id}`, body)
      .then((res) => {
        console.log(res.data);
        const data = res.data;

        if (data?.message) {
          setValueFrom("toast", {
            title: "Error",
            content: data?.message,
            show: true,
            type: "danger",
          });
        } else {
          setValueFrom("toast", {
            title: "Success",
            content: data?.data,
            show: true,
            type: "success",
          });
        }
        getDetail(data_detail?.id);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const btnCancel = async () => {
    const body = {
      purchasing_status: "cancel",
    };
    await Axios.put(`transaction/purchasing/proced/${data_detail?.id}`, body)
      .then((res) => {
        console.log(res.data);
        const data = res.data;

        if (data?.message) {
          setValueFrom("toast", {
            title: "Error",
            content: data?.message,
            show: true,
            type: "danger",
          });
        } else {
          setValueFrom("toast", {
            title: "Success",
            content: data?.data,
            show: true,
            type: "success",
          });
        }
        getDetail(data_detail?.id);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body ">
          <div className="row mt-2">
            <div className="col-md-4">
              <Search
                placeholder="Search Purchasing"
                register={register}
                btnSearch={handleSubmit(btnSearch)}
              />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-2 d-flex align-items-center">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#ModalAddPurchasing"
                id="btnAddPurchasing"
              >
                Create Purchase
              </button>
            </div>
            <div className="col-md-6">
              <label className="text-uppercase" style={{ fontWeight: "bold" }}>
                Filter Status
              </label>
              <div className="d-flex gap-2 p-2">
                {statusArr.map((item, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={item === "" ? "Semua" : item}
                      onChange={(e) => btnFilterStatus(e, item)}
                      name="radio-filter"
                      checked={param.checked === item ? true : false}
                    />
                    <label
                      className="form-check-label text-capitalize"
                      htmlFor={item === "" ? "Semua" : item}
                    >
                      {" "}
                      {item === "" ? "Semua" : item}{" "}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-12">
              <Table
                column={column}
                data={data.map((item) => ({
                  ...item,
                  createdAt: DateFormat(item.createdAt),
                  purchasing_total: MoneyFormat(item.purchasing_total),
                  purchasing_desc: item.purchasing_desc?.slice(0, 20),
                  purchasing_status: (
                    <Badges
                      label={item.purchasing_status}
                      type={
                        item.purchasing_status == "waiting"
                          ? "warning"
                          : item.purchasing_status == "process"
                          ? "info"
                          : item.purchasing_status == "complete"
                          ? "success"
                          : "danger"
                      }
                    />
                  ),
                  action: [
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapseDetail${item.id}`}
                      className="btn btn-sm"
                      onClick={() => getDetail(item.id)}
                      id="btn-action-purchasing"
                      key={0}
                    >
                      <i className="bx bx-edit text-primary"></i>
                    </button>,
                  ],
                }))}
              />
            </div>
            <div className="col-md-12 text-uppercase">
              <Pagination
                btnPagination={btnPagination}
                current={current_page}
                total={total_page}
              />
            </div>
          </div>
        </div>
      </div>

      <PurchasingCollapse
        data_detail={data_detail}
        btnDelete={btnDelete}
        register={register}
        updateQtyDetailProduct={updateQtyDetailProduct}
        handleSubmit={handleSubmit}
        btnProcced={btnProcced}
        btnCancel={btnCancel}
        addProductDetail={addProductDetail}
      />

      <ModalCreate />
    </div>
  );
};

export default Purchasing;

const statusArr = ["waiting", "process", "complete", "cancel", ""];

const column = [
  {
    title: "#",
    key: "id",
  },
  {
    title: "Name",
    key: "firstname",
    className: "text-capitalize",
  },
  {
    title: "Status",
    key: "purchasing_status",
  },
  {
    title: "Descriptions",
    key: "purchasing_desc",
    className: "text-truncate",
  },
  {
    title: "Total",
    key: "purchasing_total",
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
