import { Table, Search, Pagination, Swal } from "../../../components";
import { Axios, queryString, formatter } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const { Sweetalert2Question } = Swal;

const UOM = () => {
  const { setValue: setValueFrom } = useFormContext();
  const { control, setValue, handleSubmit, register } = useForm({
    defaultValues: {
      data: [],
      total_page: 1,
      current_page: 1,
      search: null,
      param: {
        uom_name: null,
      },
    },
  });

  const data = useWatch({
    name: "data",
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

  const getData = async (paramQuery) => {
    const query = queryString(
      paramQuery
        ? {
            ...paramQuery,
          }
        : {
            page: current_page,
            uom_name: search,
          }
    );

    setValueFrom("loading", true);
    const result = await Axios.get(`inventory/uom?&${query}`);

    const data = result?.data;
    if (data?.code == 200) {
      setValue(
        "data",
        data?.data?.map((item, idx) => ({
          ...item,
          uom_name: item.uom_name ?? "NULL",
          action: [
            <button
              className="btn"
              onClick={() => btnDelete(item.id, item.uom_name)}
              key={0}
            >
              <i className="bx bx-trash text-danger"></i>
            </button>,
          ],
        }))
      );
      setValue("current_page", data?.page);
      setValue("total_page", data?.last_page);
    }
    setValueFrom("loading", false);
  };

  useEffect(() => {
    getData();
  }, [current_page]);

  const btnPagination = (newPage) => {
    setValue("current_page", newPage);
  };

  const btnDelete = async (id, uom_name) => {
    await Sweetalert2Question({
      title: "Warning",
      text: `Are You Sure Deleted ${uom_name} ?`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setValueFrom("loading", true);
        await Axios.delete(`inventory/uom/${id}`)
          .then((res) => {
            if (res.data.code === 200) {
              setValueFrom("toast", {
                title: "Success Deleted",
                content: "Success Deleted " + uom_name,
                show: true,
                type: "success",
              });
            }
          })
          .finally(() => {
            setValueFrom("loading", false);
            getData();
          });
      }
    });
  };

  const btnEdit = async (e, uom_id) => {
    const { data } = e;
    const getDataDetail = data.find((find) => find.id === uom_id);
    const body = {
      uom_name: getDataDetail?.uom_name,
    };
    setValueFrom("loading", true);
    await Axios.put(`inventory/uom/${uom_id}`, body)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          setValueFrom("toast", {
            title: "Successfully Edit",
            content: "Successfully Edit " + data?.data?.uom_name,
            show: true,
            type: "success",
          });
        }
        console.log({ res });
      })
      .finally(() => {
        setValueFrom("loading", false);
        getData();
      });
  };

  const btnAdd = async (e) => {
    setValueFrom("loading", true);
    await Axios.post(`inventory/uom`, {
      uom_name: e?.param?.uom_name,
    })
      .then((res) => {
        const data = res.data;

        if (data.code === 200) {
          setValueFrom("toast", {
            title: "Success",
            content: "Successfully add new " + data?.data?.uom_name,
            show: true,
            type: "success",
          });
        }
      })
      .finally(() => {
        setValueFrom("loading", false);
        getData();
        setValue("param.uom_name", "");
      });
  };

  const btnSearch = (e) => {
    setValue("searh", e.search);
    getData({
      uom_name: e.search,
      page: 1,
    });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="collapse"
            data-bs-target="#collapseAddCat"
          >
            Add UOM
          </button>

          <div className=" mt-2 collapse" id="collapseAddCat">
            <form onSubmit={handleSubmit(btnAdd)}>
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div>
                    <label htmlFor="uomName" className="form-label">
                      UOM Name
                    </label>
                    <input
                      type="text"
                      placeholder="UOM Name"
                      className="form-control"
                      {...register("param.uom_name")}
                    />
                    <small>
                      <i>Nb : please enter after input uom name for save*</i>
                    </small>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <Search
                placeholder="Search UOM"
                btnSearch={handleSubmit(btnSearch)}
                register={register}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Table
                data={data.map((item, idx) => ({
                  ...item,
                  uom_name: (
                    <form onSubmit={handleSubmit((e) => btnEdit(e, item.id))}>
                      <input
                        className="form-control"
                        {...register(`data.${idx}.uom_name`)}
                      />
                    </form>
                  ),
                }))}
                column={column}
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
    </div>
  );
};

export default UOM;

const column = [
  {
    title: "ID UOM",
    key: "id",
  },
  {
    title: "UOM Name",
    key: "uom_name",
  },
  {
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
