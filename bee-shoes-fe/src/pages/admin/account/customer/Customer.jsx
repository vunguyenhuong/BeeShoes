import { Button, Col, Input, Radio, Row, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function Customer() {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [customerStatus, setCustomerStatus] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    request.get("/customer", {
      params: {
        name: searchValue,
        page: currentPage,
        sizePage: pageSize,
        status: customerStatus,
      },
    }).then(response => {
      setCustomerList(response.data);
      setTotalPages(response.totalPages);
    }).catch(e => {
      console.log(e);
    })
  }, [searchValue, pageSize, customerStatus, currentPage]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      className: "text-center",
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (x) => <FormatDate date={x} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (x) => (
        <span className={x ? "fw-semibold text-danger" : "fw-semibold text-success"}>
          {x ? "Hủy kích hoạt" : "Kích hoạt"}
        </span>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (x) => (
        <Tooltip placement="top" title="Chỉnh sửa">
            <Link to={`/admin/customer/${x}`} className="btn btn-sm text-warning">
              <i className="fas fa-edit"></i>
            </Link>
        </Tooltip>
      )
    },
  ];

  return (
    <BaseUI>
      <h6>Danh sách khách hàng</h6>
      <Row gutter={10}>
        <Col span={10}>
          <label className="mb-1">Nhập tên, email, số điện thoại</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm khách hàng theo tên, email, sdt ..."
          />
        </Col>
        <Col span={10} className="text-nowrap">
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={null} className="align-middle"
            onChange={(event) => setCustomerStatus(event.target.value)}
          >
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Kích hoạt</Radio>
            <Radio value={true}>Hủy kích hoạt</Radio>
          </Radio.Group>
        </Col>
        <Col span={4}>
          <div className="mb-1">‍</div>
          <Link to={"/admin/customer/add"}>
            <Button type="primary" className="bg-warning">
              <i className="fas fa-plus-circle me-1"></i>Thêm khách hàng
            </Button>
          </Link>
        </Col>
      </Row>

      <Table dataSource={customerList} columns={columns} className="mt-3"
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
}

export default Customer;
