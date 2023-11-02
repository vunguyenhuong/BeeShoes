import { Breadcrumb, Col, Form, Input, DatePicker, Row, Button, Modal, Empty } from "antd";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import { FaHome } from "react-icons/fa";
import TableShoe from "./TableShoe";
import TableShoeDetail from "./TableShoeDetail";

function AddPromotion() {
  const [form] = Form.useForm();
  const [productIds, setProductIds] = useState([]);

  const [productDetail, setPRoductDetail] = useState([]);

  const handleCreatePromotion = (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm khuyến mại mới?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        console.log(data);
      },
    });
  };

  useEffect(() => {

  });


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
      <h6>Thêm khuyến mại</h6>
      <Form onFinish={handleCreatePromotion} layout="vertical" form={form}>
        <Row gutter={10}>
          <Col xl={12}>
            <Row gutter={10}>
              <Col xl={12}>
                <Form.Item label={"Mã khuyến mại"} name={"code"} rules={[{ required: true, message: "Mã khuyến mại không được để trống!", },]}>
                  <Input placeholder="Nhập mã khuyến mại..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Tên khuyến mại"} name={"name"} rules={[{ required: true, message: "Tên khuyến mại không được để trống!", },]} >
                  <Input placeholder="Nhập tên khuyến mại..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Giá trị (%)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                  <Input placeholder="Nhập % khuyến mại..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày bắt đầu"} name={"startDate"} rules={[{ required: true, message: "Ngày bắt đầu không được để trống!", },]} >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày kết thúc"} name={"endDate"} rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Button type="primary" className="bg-warning" htmlType="submit">Thêm khuyến mại</Button>
              </Col>
            </Row>
          </Col>
          <Col xl={12}>
            <h6>Danh sách sản phẩm</h6>
            <TableShoe setProductIds={setProductIds} />
          </Col>
          <Col xl={24}>
            <h6>Danh sách chi tiết sản phẩm</h6>

            {productIds.length === 0 ? <Empty /> : productIds.map((item, index) => (
              <TableShoeDetail idProduct={item} setSelectedProductDetail={(value) => setPRoductDetail(value)} />
            ))}
          </Col>
        </Row>
      </Form >
    </>
  );
}

export default AddPromotion;
