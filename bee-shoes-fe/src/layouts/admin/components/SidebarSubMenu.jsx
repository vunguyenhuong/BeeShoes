import React from "react";
import { Link } from "react-router-dom";

function SidebarSubMenu({ collapseId, listMenu }) {
  return (
    <>
      <div className="collapse show" id={`${collapseId}-collapse`}>
        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          {listMenu.map((item, key) => {
            return (
              <li key={key}>
                <Link
                  to={item.path}
                  className="d-inline-flex align-items-center text-decoration-none rounded"
                >
                  <i className={`fas ${item.icon} me-2`}></i> {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default SidebarSubMenu;
