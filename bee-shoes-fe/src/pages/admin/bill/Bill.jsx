import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { Badge, Button, Form, Input, Radio, Table, Tabs, Tag, Tooltip } from "antd";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import TemplateExportBill from "../export-pdf/TemplateExportBill";

const Bill = ({ onLoad }) => {
  const [listOrder, setListOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState(1);
  const [tabs, setTabs] = useState([]);

  const loadOrders = (status, currentPage, pageSize, searchValue) => {
    request
      .get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: status,
          code: searchValue
        }
      }).then((response) => {
        setListOrder(response.data);
        setTotalPages(response.totalPages)
      })
      .catch((e) => {
        console.log(e);
      });

    request.get('/bill/statistic-bill-status').then(response => {
      setTabs(response);
    }).catch(e => { console.log(e); })
  };

  useEffect(() => {
    loadOrders();
  }, [])

  useEffect(() => {
    loadOrders(status, currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue, status, onLoad]);

  const items = [
    {
      key: null,
      label: <Badge offset={[8, 0]} size="small">Tất cả</Badge>,
    },
    ...tabs.map(item => ({
      key: item.status,
      label: <Badge count={item.totalCount} offset={[8, 0]} size="small">{item.statusName}</Badge>,
    })),
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
    // {
    //   title: 'Người tạo',
    //   dataIndex: 'employee',
    //   key: 'employee',
    // },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (x, record) => x === null ? "Khách hàng lẻ" : x
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
      render: (x, record) => x === null ? 0 : <FormatCurrency value={x + record.moneyShip} />
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'type',
      key: 'type',
      render: (x) => (
        <Tag
          color={x === 0 ? "#87d068" : x === 1 ? "#108ee9" : "#2db7f5"}
          icon={x === 0 ? <i class="fas fa-shop me-1"></i> : x === 1 ? <i class="fas fa-truck-fast me-1"></i> : <i class="fas fa-plus me-1"></i>}
        >
          {x === 0 ? "Tại quầy" : x === 1 ? "Giao hàng" : "Đơn mới"}
        </Tag>
      )
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
      render: (x, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/bill/${x}`}><Button type="text" icon={<i class="fas fa-ellipsis"></i>} /></Link>
          </Tooltip>
          {record.status !== 1 | record.status !== 2 && (
            <Tooltip title="In hóa đơn">
              <Link className="px-2" target="blank" to={`/export-pdf/${record.id}`}><i class="fa-regular fa-file-lines"></i></Link>
            </Tooltip>
          )}
        </>
      )
    },
  ];

  return (
    <BaseUI>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h6>Danh sách hóa đơn</h6>
        </div>
        <div className="">
          <Input onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm theo mã hóa đơn, tên khách hàng, số điện thoại..." style={{ width: "440px" }} />
        </div>
      </div>
      <Tabs defaultActiveKey={1} items={items} tabBarGutter={74} onChange={(key) => {
        setStatus(key);
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
