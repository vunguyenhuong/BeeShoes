import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { Badge, Button, Form, Input, Radio, Table, Tabs } from "antd";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";

const Bill = () => {
  const [listOrder, setListOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const [status, setStatus] = useState(null);

  const loadOrders = (status, currentPage, pageSize, searchValue) => {
    request
      .get(`bill`, {
        params: {
          idStaff: 1,
          page: currentPage,
          sizePage: pageSize, 
          status: status
        }
      }).then((response) => {
        setListOrder(response.data);
        setTotalPages(response.totalPages)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [])

  useEffect(() => {
    loadOrders(status, currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue, status]);

  const items = [
    {
      key: null,
      label: <Badge count={5} offset={[8, 0]} size="small">Tất cả</Badge>,
    },
    {
      key: 2,
      label: <Badge count={5} offset={[8, 0]} size="small">Chờ xác nhận</Badge>,
    },
    {
      key: 4,
      label: <Badge count={5} offset={[8, 0]} size="small">Chờ giao</Badge>,
    },
    {
      key: 5,
      label: <Badge count={5} offset={[8, 0]} size="small">Đang giao</Badge>,
    },
    {
      key: 6,
      label: <Badge count={5} offset={[8, 0]} size="small">Hoàn thành</Badge>,
    },
    {
      key: 7,
      label: <Badge count={5} offset={[8, 0]} size="small">Hủy</Badge>,
    },
    {
      key: 0,
      label: <Badge count={5} offset={[8, 0]} size="small">Chờ thanh toán</Badge>,
    },
  ];

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (x) => x === null ? "Khách hàng lẻ" : x
    },
    {
      title: 'SDT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (x) => x === null ? '-' : x
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (x) => x === null ? 0 : <FormatCurrency value={x} />
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'type',
      key: 'type',
      render: (x) => x === null ? "Đơn mới" : x === 1 ? "Giao hàng" : "Tại quầy"
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (x) => <FormatDate date={x} />
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: '',
      render: (x) => (
        <>
        <Button type="text" icon={<i className="fas fa-eye"></i>}/>
        <Button type="text" icon={<i class="fas fa-ellipsis"></i>}/>
        </>
      )
    },
  ];

  return (
    <BaseUI>
      <h6>Danh sách hóa đơn</h6>
      <Tabs defaultActiveKey={1} items={items} tabBarGutter={74} onChange={(key) => {
        loadOrders(key);
      }} />
      <Table dataSource={listOrder} columns={columns}
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: true,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }} />
    </BaseUI>
  );
};

export default Bill;
