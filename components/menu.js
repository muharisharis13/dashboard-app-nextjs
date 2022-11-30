import DataSideNav from "../utils/sideNavData.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Menu = () => {
  const [menuActive, setMenuActive] = useState({
    pathname: "",
    title: "",
  });

  const handleMenu = (pathname, idxProps) => {
    if (pathname !== "javascript:void(0);") {
      setMenuActive({
        pathname,
        title: idxProps,
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("titleSidebar", idxProps);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMenuActive({
        pathname: window.location.pathname,
        title: window.localStorage.getItem("titleSidebar"),
      });
    }
  }, [useRouter().pathname]);

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      <div className="app-brand demo">
        <a href="#" className="app-brand-link">
          <span className="app-brand-logo demo">MES</span>
        </a>

        <a
          href="#"
          className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
        >
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {DataSideNav?.map((item, idx) => (
          <li
            className={
              menuActive.pathname ===
                (typeof window !== "undefined" && window.location.pathname) &&
              item.title === menuActive.title
                ? "menu-item active"
                : item["sub-menu"].find(
                    (find) => find.href === menuActive.pathname
                  )
                ? "menu-item active open"
                : "menu-item"
            }
            key={idx}
          >
            <Link
              href={
                item.href === "javascript:void(0);"
                  ? "javascript:void(0);"
                  : item.href
              }
              onClick={() => handleMenu(item.href, item.title)}
              className={
                item["sub-menu"]?.length > 0
                  ? "menu-link menu-toggle"
                  : "menu-link"
              }
            >
              <i className={`menu-icon tf-icons bx ${item.icon}`}></i>
              <div data-i18n="Account Settings">{item.title}</div>
            </Link>
            {item["sub-menu"]?.length > 0 ? (
              <ul className="menu-sub">
                {item["sub-menu"]?.map((itemSub, idxSub) => (
                  <li
                    key={idxSub}
                    className={
                      menuActive.pathname ===
                        (typeof window !== "undefined" &&
                          window.location.pathname) &&
                      menuActive.title === itemSub.title
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      href={itemSub.href}
                      onClick={() => handleMenu(itemSub.href, itemSub.title)}
                      className="menu-link"
                    >
                      <div data-i18n="Account">{itemSub.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Menu;
