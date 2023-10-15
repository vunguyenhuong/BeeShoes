import {
  Breadcrumb,
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  Row,
  Switch,
  Button,
  Modal,
  Table,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormatCurrency from "~/utils/FormatCurrency";
const { RangePicker } = DatePicker;

function AddPromotion() {
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState(true);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [listProductDetail, setListProductDetail] = useState([]);

  const handleSwitchChange = (checked) => {
    setDiscountType(checked ? true : false);
  };

  const handleCreatePromotion = () => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm khuyến mại mới?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {},
    });
  };

  useEffect(() => {
    loadShoe();
  }, []);

  const loadShoe = () => {
    request
      .get("/shoe", {
        // params: { name: searchValue, page: currentPage, sizePage: pageSize, category: selectedCate, brand: selectedBrand, status: statusProduct },
      })
      .then((response) => {
        setProductList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SP = [
    {
      title: <Checkbox />,
      key: "checkbox",
      render: (x) => <Checkbox />,
    },
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  const CTSP = [
    {
      title: <Checkbox />,
      key: "checkbox",
      render: (x) => <Checkbox />,
    },
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (x) => (x == null ? 0 : x),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (x) => <FormatCurrency value={x} />,
    },
  ];

  return (
    <>
      <div className="d-flex mb-3">
        <div className="flex-grow-1">
          <Breadcrumb
            className="mb-2"
            items={[
              { href: "/", title: <FaHome /> },
              { href: "/admin/promotion", title: "Danh sách khuyến mại" },
              { title: "Thêm khuyến mại" },
            ]}
          />
        </div>
      </div>
      <Form onFinish={handleCreatePromotion} layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xl={24}>
            <h6>Thông tin khuyến mại</h6>
            <Divider />
          </Col>
          <Col xl={12}>
            <Form.Item
              label={"Mã khuyến mại"}
              name={"code"}
              rules={[
                {
                  required: true,
                  message: "Mã khuyến mại không được để trống!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập mã khuyến mại..." />
            </Form.Item>
          </Col>
          <Col xl={12}>
            <Form.Item
              label={"Tên khuyến mại"}
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Tên khuyến mại không được để trống!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập tên khuyến mại..." />
            </Form.Item>
          </Col>
          <Col xl={12}>
            <Row gutter={10}>
              <Col xl={8}>
                <Form.Item
                  label={"Kiểu giảm giá"}
                  name={"type"}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "Kiểu giảm giá không được để trống!",
                  //     },
                  //   ]}
                >
                  <Switch
                    checkedChildren=" % "
                    unCheckedChildren=" VNĐ "
                    defaultChecked={true}
                    name={"type"}
                    onChange={handleSwitchChange}
                    className={discountType ? "bg-warning" : "bg-success"}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xl={16}>
                {discountType === true && (
                  <Form.Item
                    valuePropName=""
                    label={"Giá trị (%)"}
                    name={"value"}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Nhập % khuyến mại..." />
                  </Form.Item>
                )}
                {discountType === false && (
                  <Form.Item
                    valuePropName=""
                    label={"Giá trị (VNĐ)"}
                    name={"value"}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Nhập giá khuyến mại..." />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Col>
          <Col xl={12}>
            <Form.Item
              label={"Thời gian hoạt động"}
              name={"date"}
              rules={[
                {
                  required: true,
                  message: "Thời gian không được để trống!",
                },
              ]}
            >
              <RangePicker
                size="large"
                style={{
                  width: "100%",
                }}
                showTime
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col xl={12}>
            <h6>Danh sách sản phẩm</h6>
            <Divider />
            <Table
              dataSource={productList}
              columns={SP}
              className="mt-3"
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
              }}
            />
          </Col>

          <Col xl={12}>
            <h6>Chi tiết sản phẩm</h6>
            <Divider />
            <Table
              dataSource={listProductDetail}
              columns={CTSP}
              className="mt-3"
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
              }}
            />
          </Col>
          <Divider />
          <Col xl={24}>
            <Form.Item className="mt-3 float-end">
              <Button type="primary" htmlType="submit" className="bg-success">
                <i className="fas fa-plus me-2"></i> Xác nhận
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddPromotion;
