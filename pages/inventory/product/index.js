import { Table, Search, Pagination, Swal } from "../../../components";
import { Axios, queryString, formatter } from "../../../utils";
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { ModalAdd, ModalEdit } from "../../../components/modal/product";

const { MoneyFormat } = formatter;
const { Sweetalert2Question } = Swal;

const Product = () => {
  const { setValue: setValueFrom } = useFormContext();
  const { control, setValue, handleSubmit, register } = useForm({
    defaultValues: {
      data: [],
      total_page: 1,
      current_page: 1,
      search: null,
      param: {},
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

  const param = useWatch({
    name: "param",
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
        product_name: search,
      }
    );
    setValueFrom("loading", true);
    const result = await Axios.get(`inventory/product?&${query}`);

    const data = result?.data;
    if (data?.code == 200) {
      setValue(
        "data",
        data?.data?.map((item, idx) => ({
          ...item,
          type_price: item.type_price?.replace("_", " "),
          capital_price: MoneyFormat(item.capital_price),
          price: MoneyFormat(item.price),
          min_stock: MoneyFormat(item.min_stock),
          stock: MoneyFormat(item.stock),
          uom_name: item.uom_name ?? "NULL",
          category_name: item.category_name ?? "NULL",
          action: initDropdownTable({
            onClick: (type) => handleDropdownTable(item, type),
          }),
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
      product_name: e?.search,
      page: 1,
    });
  };

  const btnPagination = (newPage) => {
    setValue("current_page", newPage);
  };

  const handleDropdownTable = async (item, type) => {
    console.log({ item });
    if (type === "Hapus") {
      Sweetalert2Question({
        title: "Question !",
        text: `Are You Sure Deleted ${item?.product_code}`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setValueFrom("loading", true);
          await Axios.delete(`inventory/product/${item?.id}`).then((res) => {
            if (res.data.code === 200) {
              setValueFrom("toast", {
                title: "Success",
                content: `Success deleted ${item?.product_code}`,
                show: true,
                type: "success",
              });
            }
            getDataProduct();
            setValueFrom("loading", false);
          });
        }
      });
    }
    setValue("param", { ...item });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <button
                data-bs-toggle="modal"
                data-bs-target="#ModalAdd"
                className="btn btn-primary"
                id="btnAdd"
              >
                Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <Search
                btnSearch={handleSubmit(btnSearch)}
                register={register}
                placeholder="Search Product"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Table data={dataProduct} column={column} />
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
        <ModalEdit propsParam={param} getDataProduct={getDataProduct} />
        <ModalAdd getDataProduct={getDataProduct} />
      </div>
    </div>
  );
};

export default Product;

const column = [
  {
    title: "Kode Barang",
    key: "product_code",
  },
  {
    title: "Product Name",
    key: "product_name",
    className: "text-uppercase",
  },
  {
    title: "Capital Price",
    key: "capital_price",
  },
  {
    title: "Price",
    key: "price",
  },

  {
    title: "Stock",
    key: "stock",
  },
  {
    title: "Min. Stock",
    key: "min_stock",
  },
  {
    title: "UOM",
    key: "uom_name",
  },
  {
    title: "Type Price",
    key: "type_price",
    className: "text-uppercase",
  },
  {
    title: "Category",
    key: "category_name",
    className: "text-uppercase",
  },
  {
    title: "Aksi",
    key: "action",
  },
];

const action = ["Edit", "Hapus"];

const initDropdownTable = ({ onClick }) => {
  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn p-0 dropdown-toggle hide-arrow"
        data-bs-toggle="dropdown"
      >
        <i className="bx bx-dots-vertical-rounded"></i>
      </button>
      <div className="dropdown-menu">
        {action.map((itemAction, idxAction) => (
          <a
            className="dropdown-item"
            key={idxAction}
            data-bs-toggle={itemAction === "Edit" ? "modal" : null}
            data-bs-target={itemAction === "Edit" ? "#ModalEdit" : null}
            onClick={() => onClick(itemAction)}
          >
            {itemAction}
          </a>
        ))}
      </div>
    </div>
  );
};
