import { Table, Search, Pagination, Swal } from "../../../components";
import { Axios, queryString, formatter } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const { Sweetalert2Question } = Swal;

const { DateFormat } = formatter;
const Category = () => {
  const { setValue: setValueFrom } = useFormContext();
  const { control, setValue, handleSubmit, register } = useForm({
    defaultValues: {
      data: [],
      total_page: 1,
      current_page: 1,
      search: null,
      category_name: "",
    },
  });

  const dataProduct = useWatch({
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

  const getDataProduct = async (paramQuery) => {
    const query = queryString(
      paramQuery ?? {
        page: current_page,
        category_name: search,
      }
    );
    setValueFrom("loading", true);
    const result = await Axios.get(`inventory/category?&${query}`);
    const data = result?.data;

    if (data.code == 200) {
      console.log(data?.data);
      setValue(
        "data",
        data?.data?.map((item, idx) => ({
          ...item,
          createdAt: DateFormat(item.createdAt),
          category_name: item.category_name,
          action: [
            <button
              className="btn"
              onClick={() => btnDelete(item.id, item.category_name)}
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
    getDataProduct();
  }, [current_page]);

  const btnSearch = (e) => {
    getDataProduct({
      category_name: e?.search,
      page: 1,
    });
  };

  const btnPagination = (newPage) => {
    setValue("current_page", newPage);
  };

  const btnAddCategory = async (e) => {
    setValueFrom("loading", true);
    await Axios.post(`inventory/category`, {
      category_name: e?.category_name,
    })
      .then((res) => {
        const data = res.data;

        if (data.code === 200) {
          setValueFrom("toast", {
            title: "Success",
            content: "Successfully add new " + data?.data?.category_name,
            show: true,
            type: "success",
          });
        }
      })
      .finally(() => {
        setValueFrom("loading", false);
        getDataProduct();
        setValue("category_name", "");
      });
  };

  const btnEdit = async (e, idx) => {
    const { data } = e;
    const getDataDetail = data.find((find) => find.id === idx);
    const body = {
      category_name: getDataDetail?.category_name,
    };
    setValueFrom("loading", true);
    await Axios.put(`inventory/category/${idx}`, body)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          setValueFrom("toast", {
            title: "Successfully Edit",
            content: "Successfully Edit " + data?.data?.category_name,
            show: true,
            type: "success",
          });
        }
        console.log({ res });
      })
      .finally(() => {
        setValueFrom("loading", false);
        getDataProduct();
      });
  };

  const btnDelete = async (id, category_name) => {
    await Sweetalert2Question({
      title: "Warning",
      text: `Are You Sure Deleted ${category_name} ?`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setValueFrom("loading", true);
        await Axios.delete(`inventory/category/${id}`)
          .then((res) => {
            console.log({ res });
            if (res.data.code === 200) {
              setValueFrom("toast", {
                title: "Success Deleted",
                content: "Success Deleted " + category_name,
                show: true,
                type: "success",
              });
            }
          })
          .finally(() => {
            setValueFrom("loading", false);
            getDataProduct();
          });
      }
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
            Add Category
          </button>

          <div className=" mt-2 collapse" id="collapseAddCat">
            <form onSubmit={handleSubmit(btnAddCategory)}>
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div>
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="Category Name"
                      className="form-control"
                      {...register("category_name")}
                    />
                    <small>
                      <i>
                        Nb : please enter after input category name for save*
                      </i>
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
              <Search btnSearch={handleSubmit(btnSearch)} register={register} />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Table
                data={dataProduct.map((item, idx) => ({
                  ...item,
                  category_name: (
                    <form onSubmit={handleSubmit((e) => btnEdit(e, item.id))}>
                      <input
                        className="form-control"
                        {...register(`data.${idx}.category_name`)}
                      />
                    </form>
                  ),
                }))}
                column={column}
              />
            </div>
            <div className="col-md-12">
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

export default Category;

const column = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Category Name",
    key: "category_name",
  },
  {
    title: "Created At",
    key: "createdAt",
  },
  {
    title: "Action",
    key: "action",
    className: "text-end",
  },
];
