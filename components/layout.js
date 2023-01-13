import React from "react";
import Menu from "./menu";
import Header from "./header";
import { useRouter } from "next/router";
import { Cookie } from "../utils";
import { useEffect } from "react";
import Toasts from "./toasts";

const Layout = ({ children }) => {
  const { asPath } = useRouter();
  const router = useRouter();
  const CheckToken = () => {
    const token = Cookie.get("token");
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  };
  useEffect(() => {
    CheckToken();
  }, []);

  if (asPath !== "/login") {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Menu />
          <div className="layout-page">
            <Header />
            <div className="content-wrapper">{children}</div>
          </div>
        </div>
        <Toasts />
      </div>
    );
  } else if (asPath === "/login") {
    return (
      <div className="container-xxl">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">{children}</div>
        </div>
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default Layout;
