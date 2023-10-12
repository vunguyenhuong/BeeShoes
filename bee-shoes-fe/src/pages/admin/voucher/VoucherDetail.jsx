import {
  Modal,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
} from "antd";
import { Breadcrumb } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import Loading from "~/components/Loading/Loading";
import { FaHome, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";

function VoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);

  const [voucher, setVoucher] = useState({});
  const onChange = (value) => {
    console.log("changed", value);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVoucher(form,id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form, id]);
  const loadVoucher = (form,id) => {
    
    request
      .get(`/voucher/${id}`)
      .then((response) => {
        setVoucher(response);
        //         // Định rõ múi giờ khi tạo đối tượng Date
        // const startDate = new Date(response.startDate + "Z"); // "Z" là múi giờ UTC

        // // Định dạng đối tượng Date thành chuỗi với múi giờ UTC
        // const startDateString = startDate.toISOString().slice(0, 16);
        form.setFieldsValue({
          code: response.code,
          name: response.name,
          quantity: response.quantity,
          minBillValue: response.minBillValue,
          percentReduce: response.percentReduce,

          startDate: new Date(response.startDate + "Z")
            .toISOString()
            .slice(0, 16),
          endDate: new Date(response.endDate + "Z").toISOString().slice(0, 16),
        });
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading(false);
  };

  const onSubmit = async (data) => {
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
      content: "Xác nhận cập nhật Voucher ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        request
          .put(`/voucher/update/${id}`, formData, { headers: { "Content-Type": "multipart/form-data", }, }).then((response) => {
            console.log(response);
            setLoading(true);
            if (response.status === 200) {
              toast.success("Cập nhật thành công!");
              loadVoucher(form,id);
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
            if (e.response.data.message != null) {
              toast.error(e.response.data.message);
            }
            setLoading(false);
          });
      },
    });
  };

  if (loading) {
    return (
      <>
        <BaseUI>
          <Loading />
        </BaseUI>
      </>
    );
  }
  return (
    <BaseUI>
      {/* <Breadcrumb
        className="mb-3"
        items={[
          { href: "/", title: <FaHome /> },
          { href: "/admin/voucher", title: "Danh sách Voucher" },
          { title: `${voucher.code}` },
        ]}
      /> */}
      <Breadcrumb className="mb-2">
        <Breadcrumb.Item>
          <Link to="/">
            <FaHome /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/voucher">Danh sách Voucher</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{voucher.code}</Breadcrumb.Item>
      </Breadcrumb>
      <h6>Thông tin Voucher</h6>
      <div className="container">
        <Form onFinish={onSubmit} layout="vertical" form={form}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label={"Mã Voucher"}
                name={"code"}
                rules={[
                  {
                    required: true,
                    message: "Mã Voucher không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên voucher..." />
              </Form.Item>
            </Col>
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
                  suffix="%"
                  placeholder="Nhập phần trăm giảm..."
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
                  defaultValue={0}
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
                  controls={false}
                  onChange={onChange}
                  min={0}
                  suffix="VNĐ"
                  placeholder="Nhập giá trị đơn tối thiểu..."
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
            <Col span={12}>
              <Form.Item className="mt-3 float-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-warning"
                  style={{ marginTop: "23px" }}
                >
                  <i className="fas fa-plus me-2"></i> Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </BaseUI>
  );
}

export default VoucherDetail;
