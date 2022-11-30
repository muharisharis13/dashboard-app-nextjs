import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
  const [pathname, setPathname] = useState([]);
  const [lastPathname, setLastpathname] = useState("");

  const initBreadcrumbs = () => {
    if (typeof window) {
      const newPathname = window.location.pathname
        ?.split("/")
        ?.filter((filter) => filter !== "");
      const newLastPathname = newPathname?.pop();

      setPathname(newPathname);
      setLastpathname(newLastPathname);
    }
  };

  useEffect(() => {
    initBreadcrumbs();
  }, [useRouter().pathname]);

  return (
    <div className="fw-bold mb-0">
      {pathname?.map((item, idx) => (
        <span key={idx} className="text-muted fw-light text-capitalize">
          {item} /{" "}
        </span>
      ))}
      <span className="text-capitalize">{lastPathname}</span>
    </div>
  );
};

export default Breadcrumbs;
