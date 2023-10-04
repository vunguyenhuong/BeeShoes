import { Menu } from "antd";
import sidebarData from "../sidebarData";
import { Link } from "react-router-dom";
import "./Sidebar.module.css";
import { useState } from "react";

const Sidebar = () => {
  const [theme, setTheme] = useState(true);
  const changeTheme = () => {
    setTheme(!theme);
    sessionStorage.setItem('theme', !theme)
    console.log(sessionStorage.getItem('theme'))
  };
  return (
    <Menu mode="vertical" className="h-100" theme={sessionStorage.getItem('theme') === "true" ? 'dark' : 'light'}>
      <Link className="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
        <img src={sessionStorage.getItem('theme') === "true" ? `/logodark.png` : `/logo.png`} alt="" width="100%" onClick={() => changeTheme()}/>
      </Link>
      {sidebarData.map((item) => {
        if (item.children) {
          return (
            <Menu.SubMenu
              key={item.key}
              title={item.title}
              icon={<i className={`fas ${item.icon}`}></i>}
            >
              {item.children.map((childItem) => {
                if (childItem.children) {
                  return (
                    <Menu.SubMenu
                      key={childItem.key}
                      title={childItem.title}
                      icon={<i className={`fas ${childItem.icon}`}></i>}
                    >
                      {childItem.children.map((subChildItem) => (
                        <Menu.Item key={subChildItem.key} icon={<i className={`fas ${subChildItem.icon}`}></i>}>
                          <Link to={subChildItem.path}>{subChildItem.title}</Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                } else {
                  // Nếu không có menu con thì thêm menu item vào submenu
                  return (
                    <Menu.Item key={childItem.key} icon={<i className={`fas ${childItem.icon}`}></i>}>
                      <Link to={childItem.path}>{childItem.title}</Link>
                    </Menu.Item>
                  );
                }
              })}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.key} icon={<i className={`fas ${item.icon}`}></i>}>
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default Sidebar;
