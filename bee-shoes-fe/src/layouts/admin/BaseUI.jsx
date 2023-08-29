import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Breadcrumb,
  Badge,
  Avatar,
  Space,
} from "antd";
import { ToastContainer } from "react-toastify";

import Footer from "./Footer";
import Sidebar from "./components/Menu/Menu";
const { Header, Sider, Content } = Layout;

const BaseUI = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Sidebar />
        </Sider>
        <Layout>
          <Header className="bg-body px-3 d-flex">
            <div className="flex-grow-1">
              <Button
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="btn border-0 px-4"
              />
            </div>
            <div className="">
              <Space size="middle">
                <Badge count={1} size="small">
                  <BellOutlined className="p-1" />
                </Badge>
              </Space>
            </div>
            <div className="mx-2">
              <UserOutlined />
            </div>
          </Header>
          <Content className="m-3 p-3 bg-body" style={{ minHeight: "100vh" }}>
            {children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
};
export default BaseUI;
