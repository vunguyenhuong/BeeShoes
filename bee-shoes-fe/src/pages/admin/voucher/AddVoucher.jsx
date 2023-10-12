import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Modal,
  Radio,
  Row,
  message,
} from "antd";
import { FaHome, FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";

function AddVoucherForm() {
  const navigate = useNavigate();
  const {
    register,

    formState: { errors },
    setError,
    // trigger,
  } = useForm();
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState(null);
  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  const onChange = (value) => {
    console.log("changed", value);
  };
  const handAddVoucher = async (data) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("quantity", data.quantity);
    formData.append("percentReduce", data.percentReduce);
    formData.append("minBillValue", data.minBillValue);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm Voucher ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .post("/voucher/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log(response);

            if (response.data.success) {
              toast.success("Thêm thành công!");
              navigate("/admin/voucher");
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
            if (e.response.data.message != null) {
              toast.error(e.response.data.message);
            }
          });
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
          <Link to="/admin/voucher">Danh sách Voucher</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thêm Voucher</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container">
        <Form onFinish={handAddVoucher} layout="vertical" form={form}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label={"Tên Voucher"}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Tên Voucher không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên voucher..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Số lượng"}
                name={"quantity"}
                rules={[
                  { required: true, message: "Số lượng không được để trống!" },
                ]}
              >
                <Input type="number" min={0} placeholder="Nhập số lượng..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Phần trăm giảm"}
                name={"percentReduce"}
                rules={[
                  {
                    required: true,
                    message: "Phần trăm giảm không được để trống!",
                  },
                ]}
              >
                <Input
                  type="number"
                  min={0}
                  placeholder="Nhập phần trăm giảm..."
                  suffix="%"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Giá trị đơn tối thiểu"}
                name={"minBillValue"}
                rules={[
                  {
                    required: true,
                    message: "Đơn tối thiểu không được để trống!",
                  },
                ]}
              >
                <InputNumber
                  defaultValue={-1}
                  style={{ width: "100%" }}
                  step={10000}
                  formatter={(value) =>
                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/\$\s?|(,*)/g, "")
                      : ""
                  }
                  onChange={onChange}
                  controls={false}
                  min={0}
                  suffix="VNĐ"
                  placeholder="Nhập giá trị đơn tối thiểu..."
                  onFocus={handleInputFocus}
                  value={inputValue}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Ngày bắt đầu"}
                name={"startDate"}
                rules={[
                  {
                    required: true,
                    message: "Ngày bắt đầu không được để trống!",
                  },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Ngày kết thúc"}
                name={"endDate"}
                rules={[
                  {
                    required: true,
                    message: "Ngày kết thúc không được để trống!",
                  },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mt-3 float-end">
            <Button type="primary" htmlType="submit" className="bg-warning">
              <i className="fas fa-plus me-2"></i> Thêm Voucher
            </Button>
          </Form.Item>
        </Form>
      </div>
    </BaseUI>
  );
}

export default AddVoucherForm;