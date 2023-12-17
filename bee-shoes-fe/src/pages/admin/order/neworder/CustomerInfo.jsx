import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest"; // Import các hàm gọi API từ thư viện của bạn
import AddCustomer from "../../account/customer/AddCustomer";
import { FaTrash } from "react-icons/fa";
import GHNInfo from "~/components/GhnInfo";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CustomerInfo({ handleSelect }) {
  const [customerData, setCustomerData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");

  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [dataAddress, setDataAddress] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
    loadCustomer("");
  }, []);

  const loadCustomer = (value) => {
    request
      .get("/customer", {
        params: {
          name: value,
        },
      })
      .then((response) => {
        setCustomerData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    loadCustomer(value);
  };

  const onSelect = (value) => {
    setSearchValue("");
    handleSelect(value);
  };

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatar(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl("");
    }
  };

  const handleAddCustomer = (data) => {
    
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("address.name", data.name);
      formData.append("address.phoneNumber", data.phoneNumber);
      formData.append("address.specificAddress", data.specificAddress);
      formData.append("address.ward", dataAddress.ward);
      formData.append("address.district", dataAddress.district);
      formData.append("address.province", dataAddress.province);
      formData.append("address.defaultAddress", true);

      // formData.append("cccd", data.cccd);
      formData.append("username", data.username);
      formData.append("name", data.name);
      formData.append("gender", data.gender);
      formData.append("birthday", data.birthday);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      Modal.confirm({
        title: "Xác nhận",
        maskClosable: true,
        content: "Xác nhận thêm khách hàng ?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          request.post("/customer", formData, { headers: { "Content-Type": "multipart/form-data", }, }).then((response) => {
            console.log(response);
            setLoading(true);
            if (response.data.success) {
              setLoading(false);
              toast.success("Thêm thành công!");
              setIsModalOpen(false);
              form.resetFields();
              loadCustomer("");
            }
          }).catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          }); 
        },
      });
  };

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1 me-1">
          <AutoComplete
            value={searchValue}
            onChange={handleSearch}
            onSelect={onSelect}
            style={{ width: "300px" }}
            options={customerData.map((customer) => ({
              value: customer.id,
              label: (
                <>
                  <div className="d-flex">
                    <Avatar
                      src={`${customer.avatar}`}
                      shape="circle"
                      size={"default"}
                      className="me-2"
                    />
                    <div className="">
                      {customer.name} - {customer.gender}
                      <br />
                      {customer.phoneNumber}
                    </div>
                  </div>
                </>
              ),
            }))}
          >
            <Input.Search placeholder="Tìm kiếm khách hàng..." />
          </AutoComplete>
        </div>
        <div className="">
          <Button
            type="primary"
            className="bg-warning text-dark"
            icon={<i className="fas fa-plus-circle"></i>}
            onClick={showModal}
          >
            Thêm mới KH
          </Button>
        </div>
      </div>

      <Modal
        title="Khách hàng mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer=""
      >
      <Form onFinish={handleAddCustomer} layout="vertical" form={form}>

        <Row gutter={24}>
          <Col span={8}>
          {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "162px", height: "162px" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAvatar(null); }}><FaTrash className="text-danger" /></Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" required />
                  <div className="text-center text-secondary">
                    <i className="fas fa-plus"></i> <br />
                    <span>Chọn ảnh đại diện</span>
                  </div>
                </div>
              </div>
            )}
            <Form.Item
              label={"Username"}
              name={"username"}
              rules={[
                { required: true, message: "Username không được để trống!" },
              ]}
            >
              <Input placeholder="Nhập username..." />
            </Form.Item>
            <Form.Item
              label={"Tên khách hàng"}
              name={"name"}
              rules={[
                { required: true, message: "Tên không được để trống!" },
                {
                  pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
                  message: "Tên phải là chữ",
                },
              ]}
            >
              <Input placeholder="Nhập tên khách hàng..." />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row gutter={10}>
              {/* <Col span={12}>
                <Form.Item
                  label={"Mã định danh (Số CMT/CCCD)"}
                  name={"cccd"}
                  rules={[
                    {
                      required: true,
                      message: "Mã định danh không được để trống!",
                    },
                    {
                      pattern: "^([0-9]{9}|[0-9]{12})$",
                      message: "Mã định danh phải có 9 hoặc 12 kí tự!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã định danh..." />
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <Form.Item
                  label={"Giới tính"}
                  name={"gender"}
                  rules={[
                    {
                      required: true,
                      message: "Giới tính không được để trống!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={"Nam"}>Nam</Radio>
                    <Radio value={"Nữ"}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Ngày sinh"}
                  name={"birthday"}
                  rules={[
                    {
                      required: true,
                      message: "Ngày sinh không được để trống!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Email"}
                  name={"email"}
                  rules={[
                    { required: true, message: "Email không được để trống!" },
                    {
                      pattern:
                        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$$",
                      message: "Email không đúng định dạng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Số điện thoại"}
                  name={"phoneNumber"}
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                    {
                      pattern: "^0[0-9]{9}$",
                      message: "SDT không đúng định dạng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Địa chỉ cụ thể"}
                  name={"specificAddress"}
                  rules={[
                    {
                      required: true,
                      message: "Địa chỉ cụ thể không được để trống!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ cụ thể ..." />
                </Form.Item>
              </Col>
              <GHNInfo dataAddress={setDataAddress} />
            </Row>
            <Form.Item className="mt-3 float-end">
              <Button type="primary" htmlType="submit" className="bg-warning">
                <i className="fas fa-plus me-2"></i> Thêm khách hàng
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </Modal>
    </>
  );
}

export default CustomerInfo;
