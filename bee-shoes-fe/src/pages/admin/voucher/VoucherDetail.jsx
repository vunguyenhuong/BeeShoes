import { Modal, Button, Col, Form, Input, InputNumber, Row, Radio, } from "antd";
import { Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import Loading from "~/components/Loading/Loading";
import { FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";
import TableCustomer from "./TableCustomer";

function VoucherDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVoucher(form, id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form, id]);

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

  const loadVoucher = (form, id) => {
    request.get(`/voucher/${id}`).then((response) => {
      console.log(response);
      setVoucher(response);
      form.setFieldsValue({
        code: response.code,
        name: response.name,
        quantity: response.quantity,
        minBillValue: response.minBillValue,
        percentReduce: response.percentReduce,
        startDate: new Date(response.startDate + "Z").toISOString().slice(0, 16),
        endDate: new Date(response.endDate + "Z").toISOString().slice(0, 16),
        type: response.type
      });
      if (response.customer !== null) {
        setListCustomer(response.customer.split(',').map(Number));
      }
    })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const onSubmit = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật phiếu giảm giá ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
        data.customers = listCustomer;
        request.put(`/voucher/update/${id}`, data).then((response) => {
          console.log(response);
          toast.success("Cập nhật thành công!");
          loadVoucher(form, id);
        }).catch((e) => {
          toast.error(e.response.data);
          setLoading(false);
        });
      }, 1000);
      },
    });
  };

  if (loading) {
    return <Loading />;
  }
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
        <Breadcrumb.Item>[{voucher.code}] {voucher.name}</Breadcrumb.Item>
      </Breadcrumb>
      <h6>Thông tin phiếu giảm giá</h6>
      <div className="container">
        <Form onFinish={onSubmit} layout="vertical" form={form}>
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
                    <InputNumber defaultValue={1} style={{ width: "100%" }} step={10000} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""} controls={false} min={0} suffix="VNĐ" placeholder="Nhập giá trị đơn tối thiểu..." />
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
              <TableCustomer setCustomerIds={(value) => setListCustomer(value)} setRowKeys={listCustomer} />
            </Col>
          </Row>
          <Form.Item className="mt-3 float-end">
            <Button type="primary" htmlType="submit" className="bg-warning">
              <i className="fas fa-edit me-2"></i> Cập nhật phiếu giảm giá
            </Button>
          </Form.Item>
        </Form>
      </div>
    </BaseUI>
  );
}

export default VoucherDetail;
