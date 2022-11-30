const Modal = ({
  idModal = "basicModal",
  children,
  title = "Modal Title",
  size = "lg",
  childrenFooter = () => (
    <>
      <button
        type="button"
        className="btn btn-outline-secondary"
        data-bs-dismiss="modal"
      >
        Close
      </button>
      <button type="button" className="btn btn-primary">
        Save changes
      </button>
    </>
  ),
}) => {
  return (
    <div className="modal fade" id={idModal} tabindex="-1" aria-hidden="true">
      <div className={`modal-dialog modal-${size}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel1">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{childrenFooter()}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
