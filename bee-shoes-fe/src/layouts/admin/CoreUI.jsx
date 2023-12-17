import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Layout, Badge, Space } from "antd";
import Footer from "./Footer";
import Sidebar from "./components/Menu/Menu";
const { Header, Sider, Content } = Layout;

function CoreUI({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ position: "fixed", height: "100vh", overflowY: "auto" }}
        >
          {/* Sidebar content */}
          <div className="demo-logo-vertical" />
          <Sidebar />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            className="bg-body px-3 d-flex w-100"
          >
            <div className="flex-grow-1">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="btn border-0 px-4"
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
            </div>
            <div className="">
              <Space size="middle">
                <Badge count={0} size="small">
                  <BellOutlined className="p-1" />
                </Badge>
              </Space>
            </div>
            <div className="mx-2">
              <UserOutlined />
            </div>
          </Header>
          <div>
            <Content
              className="m-3 p-3 bg-body mt-4"
              style={{ minHeight: "calc(100vh - 64px)", overflowY: "auto" }}
            >
              {/* Content */}
              {children}
            </Content>
          </div>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}

export default CoreUI;
