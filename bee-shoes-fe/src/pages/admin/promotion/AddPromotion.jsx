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
import TableShoeDetail from "./TableShoeDetail";
import TableShoe from "./TableShoe";
const { RangePicker } = DatePicker;

function AddPromotion() {
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState(true);
  const [idShoe, setIdShoe] = useState(1);

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
                {discountType === true ? (
                  <Form.Item valuePropName="" label={"Giá trị (%)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                    <Input placeholder="Nhập % khuyến mại..." />
                  </Form.Item>
                ) : (
                  <Form.Item valuePropName="" label={"Giá trị (VNĐ)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                    <Input placeholder="Nhập giá khuyến mại..." />
                  </Form.Item>
                )}
              </Col>
              <Col xl={12}>
                <Form.Item label={"Kiểu giảm giá"} name={"type"}>
                  <Switch checkedChildren=" % " unCheckedChildren=" VNĐ " defaultChecked={true} name={"type"} onChange={(checked) => setDiscountType(checked ? true : false)} />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày bắt đầu"} name={"date"} rules={[{ required: true, message: "Thời gian không được để trống!", },]} >
                  <Input type="datetime-local"/>
                </Form.Item>
              </Col>
              <Button type="primary" className="bg-warning" htmlType="submit">Thêm khuyến mại</Button>
            </Row>
          </Col>
          <Col xl={12}>
            <h6>Danh sách sản phẩm</h6>
            <TableShoe />
          </Col>
          <Col xl={24}>
            <h6>Chi tiết sản phẩm</h6>
            <TableShoeDetail idShoe={2} />
          </Col>
        </Row>
      </Form >
    </>
  );
}

export default AddPromotion;
