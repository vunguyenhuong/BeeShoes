import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import swal from "sweetalert";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  message,
} from "antd";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import GHNInfo from "~/components/GhnInfo";
import { toast } from "react-toastify";
import { ExclamationCircleFilled } from "@ant-design/icons";

function CreateAddressModal({ idCustomer, onSuccess }) {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [dataAddress, setDataAddress] = useState(null);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const { confirm } = Modal;

  const handleAdd = (data) => {
    data.account = idCustomer;
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm địa chỉ mới? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .post("/address", data)
          .then((response) => {
            form.resetFields();
            setIsModalAddOpen(false);
            toast.success("Thêm mới thành công!");
            onSuccess();
          })
          .catch((e) => console.log(e));
        console.log(data);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleCancelAdd = () => {
    setIsModalAddOpen(false);
  };
  //   const showModal = () => {
  //     setIsModalOpen(true);
  //   };
  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };

  return (
    <>
      <div className="">
        <span
          onClick={showModalAdd}
          className="btn me-5 text-success border-0 "
        >
          <i className="fas fa-plus-circle"></i> Thêm địa chỉ mới
        </span>
      </div>

      <Modal
        centered
        title="Thêm địa chỉ"
        open={isModalAddOpen}
        onOk={handleAdd}
        onCancel={handleCancelAdd}
        footer=""
        width={800}
      >
        <Form onFinish={handleAdd} layout="vertical" form={form}>
          <Row gutter={10}>
            <Col xl={12}>
              <Form.Item
                label={"Tên"}
                name={"name"}
                rules={[
                  { required: true, message: "Tên không được để trống!" },
                ]}
              >
                <Input placeholder="Nhập tên người nhận..." />
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                label={"Số điện thoại"}
                name={"phoneNumber"}
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại..." />
              </Form.Item>
            </Col>
            <Col xl={24}>
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
            <GHNInfo
              dataAddress={setDataAddress}
              distr={autoFillAddress.district}
              prov={autoFillAddress.province}
              war={autoFillAddress.ward}
            />
          </Row>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit" className="bg-success">
              <i className="fas fa-plus-circle me-1"></i> Thêm
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default CreateAddressModal;
