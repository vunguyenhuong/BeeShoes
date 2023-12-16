import { Button, Col, Input, Radio, Row, Select, Switch, Table, Tooltip } from "antd";
import { Option } from "antd/es/mentions";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function Shoe() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [listCate, setListCate] = useState([]);
  const [listBrand, setListBrand] = useState([]);

  const [selectedCate, setSelectedCate] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusProduct, setStatusProduct] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const [searchCate, setSearchCate] = useState('');
  const [searchBrand, setSearchBrand] = useState('');

  useEffect(() => {
    request.get("/category", { params: { name: searchCate, status: false } }).then((response) => {
      setListCate(response.data);
    }).catch((error) => { console.log(error); });
    request.get("/brand", { params: { name: searchBrand, status: false } }).then((response) => {
      setListBrand(response.data);
    }).catch((error) => { console.log(error); });
  }, [searchCate, searchBrand]);

  useEffect(() => {
    request.get("/shoe", {
      params: { name: searchValue, page: currentPage, sizePage: pageSize, category: selectedCate, brand: selectedBrand, status: statusProduct },
    }).then((response) => {
      setProductList(response.data);
      setTotalPages(response.totalPages);
    }).catch((error) => {
      console.log(error);
    });
  }, [currentPage, selectedCate, selectedBrand, pageSize, searchValue, statusProduct]);

  const loadData = () => {
    request.get("/shoe", {
      params: { name: searchValue, page: currentPage, sizePage: pageSize, category: selectedCate, brand: selectedBrand, status: statusProduct },
    }).then((response) => {
      setProductList(response.data);
      setTotalPages(response.totalPages);
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleChangeStatus = async (id) => {
    await request.remove(`/shoe/${id}`).then(response => {
      toast.success("Đã cập nhật trạng thái!");
      loadData();
    }).catch(e => {
      console.log(e);
    })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (x) => x == null ? 0 : x,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (x, record) => (
        <Tooltip title={`${x ? "Ngừng bán" : "Đang bán"}`}>
          <Switch key={record.id} defaultChecked={x ? false : true} onChange={() => handleChangeStatus(record.id)} />
        </Tooltip>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (x) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/product/${x}`} className="btn btn-sm text-warning">
              <i className="fas fa-edit"></i>
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <BaseUI>
      <h6 className="fw-semibold">Danh sách sản phẩm</h6>
      <Row gutter={10}>
        <Col span={20}>
          <label className="mb-1">Tên sản phẩm</label>
          <Input onChange={(event) => setSearchValue(event.target.value)} placeholder="Tìm kiếm sản phẩm theo tên..." />
        </Col>
        <Col span={4}>
          <div className="mb-1">‍</div>
          <Link to={"/admin/product/add"}>
            <Button type="primary" className="bg-warning w-100">
              <i className="fas fa-plus-circle me-1"></i>Thêm sản phẩm
            </Button>
          </Link>
        </Col>
        <Col span={8}>
          <div className="mb-1">Trạng thái</div>
          <Radio.Group defaultValue={null} onChange={(event) => setStatusProduct(event.target.value)}>
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Đang bán</Radio>
            <Radio value={true}>Ngừng bán</Radio>
          </Radio.Group>
        </Col>
        <Col span={8}>
          <label className="mb-1">Danh mục</label>
          <Select showSearch onChange={setSelectedCate} placeholder="Chọn danh mục..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchCate}>
            <Option value="">Chọn danh mục</Option>
            {listCate.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <label className="mb-1">Thương hiệu</label>
          <Select showSearch onChange={setSelectedBrand} placeholder="Chọn thương hiệu..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchBrand}>
            <Option value="">Chọn thương hiệu</Option>
            {listBrand.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Table dataSource={productList} columns={columns} className="mt-3"
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

export default Shoe;
