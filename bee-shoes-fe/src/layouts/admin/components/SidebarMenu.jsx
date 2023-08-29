import React from "react";
import SidebarSubMenu from "./SidebarSubMenu";
import { Link } from "react-router-dom";

function SidebarMenu({ title, path, collapseId, subMenu }) {
  return (
    <>
      <li className="mb-2">
        {subMenu ? (
          <button
            className={`btn btn-toggle d-inline-flex align-items-center align-items-center rounded border-0 ${
              subMenu ? "collapsed" : ""
            }`}
            data-bs-toggle={collapseId ? "collapse" : ""}
            data-bs-target={`#${collapseId}-collapse`}
            aria-expanded={subMenu ? "true" : "false"}
          >
            <span className="__bee-text">{title}</span>
          </button>
        ) : (
          <Link
            to={path}
            className="text-decoration-none btn-toggle d-inline-flex align-items-center align-items-center rounded border-0 __bee-text"
          >
            {title}
          </Link>
        )}
        {subMenu ? (
          <SidebarSubMenu collapseId={collapseId} listMenu={subMenu} />
        ) : (
          ""
        )}
      </li>
    </>
  );
}

export default SidebarMenu;
