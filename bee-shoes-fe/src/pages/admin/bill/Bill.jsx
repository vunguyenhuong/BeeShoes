import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip } from "antd";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

const Bill = ({ onLoad }) => {
  const [listOrder, setListOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState(null);
  const [tabs, setTabs] = useState([]);

  const [selectedDates, setSelectedDates] = useState([]);

  const loadOrders = () => {
    request
      .get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: status,
          code: searchValue,
          fromDate: selectedDates?.fromDate,
          toDate: selectedDates?.toDate
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

  const handleDateChange = (dates) => {
    if (dates !== null) {
      setSelectedDates({
        fromDate: dates[0].format('YYYY-MM-DD'),
        toDate: dates[1].format('YYYY-MM-DD')
      })
    } else {
      setSelectedDates(null);
    }
    console.log(selectedDates);
  }

  useEffect(() => {
    loadOrders();
  }, [])

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchValue, status, onLoad, selectedDates]);

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
      render: (x, record) => <span className="fw-semibold text-danger"><FormatCurrency value={x === null ? 0 : x + record.moneyShip} /></span>
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'type',
      key: 'type',
      render: (x) => (
        <Tag
          style={{ width: '100px' }}
          className="text-center"
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
          {record.status !== 1 && (
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
          <Input className="me-2" onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm theo mã hóa đơn, tên khách hàng, số điện thoại..." style={{ width: "440px" }} />
          <RangePicker onChange={(dates) => handleDateChange(dates)} />
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
