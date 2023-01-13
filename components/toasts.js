import { useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const Toasts = () => {
  const { setValue } = useFormContext();
  const toast = useWatch({
    name: "toast",
  });

  useEffect(() => {
    setTimeout(() => {
      setValue("toast", {
        ...toast,
        show: false,
      });
    }, 3000);
  }, [toast?.show]);
  return (
    <div
      className={`bs-toast toast fade ${
        toast?.show ? "show" : ""
      } top-0 end-0 toast-placement-ex m-4 bg-${toast?.type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <i className="bx bx-bell me-2"></i>
        <div className="me-auto fw-semibold">{toast?.title}</div>
        {/* <small>11 mins ago</small> */}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{toast.content}</div>
    </div>
  );
};

export default Toasts;
