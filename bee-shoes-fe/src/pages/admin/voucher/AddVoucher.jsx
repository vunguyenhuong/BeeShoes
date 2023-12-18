import { Breadcrumb, Button, Col, Form, Input, InputNumber, Modal, Radio, Row } from "antd";
import { FaHome } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import TableCustomer from "./TableCustomer";

function AddVoucherForm() {
  const navigate = useNavigate();
  const [listCustomer, setListCustomer] = useState([]);
  const [form] = Form.useForm();

  const [inputValue, setInputValue] = useState(null);
  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  useEffect(() => {
    if (listCustomer.length === 0) {
      form.setFieldsValue({
        type: true
      })
    } else {
      form.setFieldsValue({
        type: false
      })
    }
  }, [listCustomer])

  const handAddVoucher = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm phiếu giảm giá ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        data.customers = listCustomer;
        request.post("/voucher/add", data).then((response) => {
          if (response.data.success) {
            toast.success("Thêm thành công!");
            navigate("/admin/voucher");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
        console.log(data);
      },
    });
  };

  return (
    <BaseUI>
      <Breadcrumb className="mb-2">
        <Breadcrumb.Item>
          <Link to="/">
            <FaHome /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/voucher">Danh sách phiếu giảm giá</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thêm phiếu giảm giá</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container">
        <Form onFinish={handAddVoucher} layout="vertical" form={form}>
          <Row gutter={10}>
            <Col xl={12}>
              <Row gutter={10}>
                <Col xl={12}>
                  <Form.Item label={"Tên phiếu giảm giá"} name={"name"} rules={[{ required: true, message: "Tên phiếu giảm giá không được để trống!", },]}>
                    <Input placeholder="Nhập tên phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Số lượng"} name={"quantity"} rules={[{ required: true, message: "Số lượng không được để trống!" },]} >
                    <Input type="number" min={0} max={10000} placeholder="Nhập số lượng..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Phần trăm giảm"} name={"percentReduce"} rules={[{ required: true, message: "Phần trăm giảm không được để trống!", },]} >
                    <Input type="number" min={0} placeholder="Nhập phần trăm giảm..." suffix="%" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Giá trị đơn tối thiểu"} name={"minBillValue"} rules={[{ required: true, message: "Đơn tối thiểu không được để trống!", },]} >
                    {/* <InputNumber  style={{ width: "100%" }} step={10000} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""} controls={false} min={0} suffix="VNĐ" placeholder="Nhập giá trị đơn tối thiểu..." onFocus={handleInputFocus} value={inputValue} /> */}
                    <InputNumber
                      style={{ width: "100%" }}
                      step={10000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => (value !== null && value !== undefined ? value.replace(/(,*)/g, "") : "")}
                      controls={false}
                      max={1000000000}
                      min={0}
                      suffix="VNĐ"
                      placeholder="Nhập giá trị đơn tối thiểu..."
                      onFocus={handleInputFocus}
                      value={inputValue}
/>
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
                  <Form.Item label={"Loại phiếu giảm giá"} name={"type"} rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                    <Radio.Group>
                      <Radio value={true}>Công khai</Radio>
                      <Radio value={false}>Áp dụng với 1 số khách hàng</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xl={12}>
              <TableCustomer setCustomerIds={(value) => setListCustomer(value)} setRowKeys={null} />
            </Col>
          </Row>
          <Form.Item className="mt-3 float-end">
            <Button type="primary" htmlType="submit" className="bg-warning">
              <i className="fas fa-plus me-2"></i> Thêm phiếu giảm giá
            </Button>
          </Form.Item>
        </Form>
      </div>
    </BaseUI>
  );
}

export default AddVoucherForm;