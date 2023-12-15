import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { FaHome, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddressStaffDetail from "~/components/Admin/Account/Staff/AddressStaffDetail";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function StaffDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  //  new

  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAvatar(file);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStaff(form, id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form, id]);

  const loadStaff = (form, id) => {
    request.get(`/staff/${id}`).then((response) => {
      setStaff(response);
      form.setFieldsValue({
        username: response.username,
        cccd: response.cccd,
        name: response.name,
        birthday: response.birthday,
        gender: response.gender,
        email: response.email,
        phoneNumber: response.phoneNumber
      });
    }).catch((e) => {
      console.log(e);
    });
    setLoading(false);
  }

  const handleUpdate = (data) => {
    const formData = new FormData();
    if (avatar !== null) {
      formData.append("avatar", avatar);
    }
    formData.append("cccd", data.cccd);
    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    formData.append("birthday", data.birthday);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật nhân viên ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        request.put(`/staff/${id}`, formData, { headers: { "Content-Type": "multipart/form-data", }, }).then((response) => {
          console.log(response);
          setLoading(true);
          if (response.data.success) {
            toast.success("Cập nhật thành công!");
            setAvatar(null);
            setPreviewUrl(null);
            loadStaff(form, id);
          }
        }).catch((e) => {
          console.log(e);
          toast.error(e.response.data);
          setLoading(false);
        });
      },
    });
  }

  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <>
      <BaseUI>
        <Breadcrumb className="mb-3"
          items={[{ href: "/", title: <FaHome /> }, { href: "/admin/staff", title: "Danh sách nhân viên" }, { title: `${staff.name} - ${staff.cccd}` },]}
        />
        <Row gutter={24}>
          <Col span={8}>
            <h6>Thông tin nhân viên</h6>
            <Divider />
            <Form layout="vertical" form={form} onFinish={handleUpdate}>
              {previewUrl !== null ? (
                <div className="text-center">
                  <img src={previewUrl} alt="Preview" style={{ width: "162px", height: "162px" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                  <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAvatar(null); }}><FaTrash className="text-danger" /></Button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px" }}>
                    <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                    <div className="text-center text-secondary">
                      <img src={staff.avatar} alt="Preview" style={{ width: "162px", height: "162px" }} className="border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                    </div>
                  </div>
                </div>
              )}
              <Form.Item label={"Username"} name={"username"} rules={[{ required: true, message: "Username không được để trống!" },]}>
                <Input placeholder="Nhập username..." />
              </Form.Item>
              <Form.Item label={"Mã định danh (Số CMT/CCCD)"} name={"cccd"} rules={[{ required: true, message: "Mã định danh không được để trống!", }, { pattern: '^([0-9]{9}|[0-9]{12})$', message: "Mã định danh phải có 9 hoặc 12 kí tự!" }]}>
                <Input placeholder="Nhập mã định danh..." />
              </Form.Item>
              <Form.Item label={"Tên nhân viên"} name={"name"} rules={[{ required: true, message: "Tên không được để trống!" }, { pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/, message: "Tên phải là chữ" }]}>
                <Input placeholder="Nhập tên nhân viên..." />
              </Form.Item>
              <Form.Item label={"Ngày sinh"} name={"birthday"} rules={[{ required: true, message: "Ngày sinh không được để trống!", },]} >
                <Input type="date" />
              </Form.Item>
              <Form.Item label={"Giới tính"} name={"gender"} rules={[{ required: true, message: "Giới tính không được để trống!", },]}>
                <Radio.Group>
                  <Radio value={"Nam"}>Nam</Radio>
                  <Radio value={"Nữ"}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={"Email"} name={"email"} rules={[{ required: true, message: "Email không được để trống!" }, { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$$', message: "Email không đúng định dạng!" }]} >
                <Input placeholder="Nhập email ..." />
              </Form.Item>
              <Form.Item label={"Số điện thoại"} name={"phoneNumber"} rules={[{ required: true, message: "Số điện thoại không được để trống!", }, { pattern: '^0[0-9]{9}$', message: "SDT không đúng định dạng!" }]} >
                <Input placeholder="Nhập số điện thoại ..." />
              </Form.Item>
              <Form.Item className="float-end">
                <Button type="primary" className="bg-warning" htmlType="submit">
                  <i className="fas fa-edit me-2"></i> Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={16}>
            <h6>Thông tin địa chỉ</h6>
            <Divider />
            <AddressStaffDetail idStaff={id} />
          </Col>
        </Row>
      </BaseUI>
    </>
  );
}

export default StaffDetail;
