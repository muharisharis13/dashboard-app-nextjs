import Image from "next/image"

const PageError = ({ title = "Page Not Found :(" }) => {
  return (
    <div className="container-xxl container-p-y">
      <div className="misc-wrapper">
        <h2 className="mb-2 mx-2">{title}</h2>
        {/* <p className="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p> */}
        <div className="mt-3">
          <Image
            src="/assets/img/illustrations/page-misc-error-light.png"
            alt="page-misc-error-light"
            width="500"
            height={200}
            className="img-fluid"
            data-app-dark-img="illustrations/page-misc-error-dark.png"
            data-app-light-img="illustrations/page-misc-error-light.png"
          />
        </div>
      </div>
    </div>
  );
};

export default PageError;
