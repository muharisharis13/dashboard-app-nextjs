import { useEffect } from "react";
import { Axios } from "../../../utils";
import { useForm } from "react-hook-form";

const Account = () => {
  const { getDataDetail, updateDetail } = api;
  const { setValue, register, handleSubmit } = useForm({
    defaultValues: {
      data: {},
    },
  });

  useEffect(() => {
    getDataDetail({
      id: 1,
    }).then((res) => {
      if (res.status === "OK") {
        setValue("data", res?.data);
      }
    });
  }, []);


  const btnUpdateData = async (e) => {
    const { data } = e;

    const result = await updateDetail({
      id: 1,
      data
    })

  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card mb-3">
        <div className="card-body">
          <button className="btn btn-primary" onClick={handleSubmit(btnUpdateData)}>
            Save Change
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6 mb-3">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  first name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="form-control"
                  autoFocus
                  {...register("data.firstname")}
                />
              </div>
            </div>
            <div className="col-sm-6 mb-3">
              <div className="form-group">
                <label htmlFor="last" className="form-label">
                  last name
                </label>
                <input
                  id="last"
                  type="text"
                  placeholder="Your Name"
                  className="form-control"
                  {...register("data.lastname")}
                />
              </div>
            </div>
            <div className="col-sm-6 mb-3">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Role"
                  disabled
                  className="form-control"
                  {...register("data.role")}
                />
              </div>
            </div>
            <div className="col-sm-6 mb-3">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  disabled
                  className="form-control"
                  {...register("data.username")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

class route {
  getDataDetail = async ({ id }) => {
    const { data } = await Axios.get(`user/${id}`);
    return data;
  };

  updateDetail = async ({ id, data }) => {
    const { data: dataResult } = await Axios.put(`user/${id}`, data)


    return dataResult;
  }
}

const api = new route();
