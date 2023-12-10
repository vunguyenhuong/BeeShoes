import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { Link, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import NewOrder from "./neworder/NewOrder";
import Bill from "../bill/Bill";
import { useState } from "react";

function Order() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1"); // Thêm state mới

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const items = [
    {
      key: '1',
      label: `Tạo mới`,
      children: <NewOrder />,
    },
    {
      key: '2',
      label: `Danh sách hóa đơn`,
      children: <Bill onLoad={Math.random().toString(36).substring(2, 12)} />,
    }
  ];

  return (
    <BaseUI>
      <h6>Quản lý đơn hàng</h6>
      <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
    </BaseUI>
  );
}

export default Order;
