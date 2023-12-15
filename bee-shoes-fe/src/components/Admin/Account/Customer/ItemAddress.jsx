import { Button, Col, Form, Input, Modal, Row, Switch } from "antd";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import GHNInfo from "~/components/GhnInfo";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";

function ItemAddress({ props, onSuccess }) {
  const [dataAddress, setDataAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(props.defaultAddress);
  const { confirm } = Modal;

  const handleUpdate = (data) => {
    data.province = dataAddress != null ? dataAddress.province : props.province;
    data.district = dataAddress != null ? dataAddress.district : props.district;
    data.ward = dataAddress != null ? dataAddress.ward : props.ward;
    // data.defaultAddress = !defaultAddress;
    // console.log("props" + props.defaultAddress);
    // console.log("defaultAddress " + defaultAddress);
    // console.log("data " + data.defaultAddress);
    data.defaultAddress = defaultAddress !== props.defaultAddress ? defaultAddress : props.defaultAddress
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhật địa chỉ này? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/address/${props.id}`, data)
          .then((response) => {
            console.log(response);
            toast.success("Cập nhật địa chỉ thành công!");
            onSuccess();
            
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // const handleSwitchChange = (data) => {
  //   data.defaultAddress = !defaultAddress;
  //   console.log("props " + props.defaultAddress);
  //   console.log("defaultAddress " + defaultAddress);
  //   console.log("data " + data.defaultAddress);

  //   confirm({
  //     title: "Xác nhận ",
  //     icon: <ExclamationCircleFilled />,
  //     content: "Bạn có chắc muốn sửa trạng thái mặc định địa chỉ này? ",
  //     okText: "Xác nhận",
  //     okType: "danger",
  //     cancelText: "Đóng",
  //     onOk() {
  //       request
  //         .put(`/address/${props.id}`, data)
  //         .then((response) => {
  //           toast.success("Thành công!");
  //           onSuccess();
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         });
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };



  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa địa chỉ này? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/address/${props.id}`)
          .then((response) => {
            if (response.status === 200) {
              toast.success("Thành công!");
              onSuccess();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <Form
        layout="vertical"
        initialValues={{
          name: props.name,
          phoneNumber: props.phoneNumber,
          specificAddress: props.specificAddress,
          defaultAddress: props.defaultAddress,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={"Tên"}
              name={"name"}
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input placeholder="Nhập tên ..." />
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
              ]}
            >
              <Input placeholder="Nhập số điện thoại ..." />
            </Form.Item>
          </Col>
          <Col span={24}>
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
              <Input placeholder="Nhập địa chỉ cụ thể..." />
            </Form.Item>
          </Col>
          <GHNInfo
            prov={props.province}
            distr={props.district}
            war={props.ward}
            dataAddress={setDataAddress}
          />
          <Col span={24} className="d-flex mt-3 align-items-center">
            <div className="flex-grow-1">
              <span className="m-2">Địa chỉ mặc định</span>
              <Switch
                className={""}
                checkedChildren={<i class="fa-solid fa-check"></i>}
                unCheckedChildren={<i class="fa-solid fa-xmark"></i>}
                defaultChecked={props.defaultAddress}
                // onChange={() => handleSwitchChange(props)}
                onChange={(value) => setDefaultAddress(value)}
              />
            </div>
            <Button
              onClick={() => showDeleteConfirm(props.id)}
              type="primary"
              className="bg-danger me-1"
              htmlType="button"
            >
              <i className="fas fa-trash"></i>
            </Button>
            <Button type="primary" className="bg-warning" htmlType="submit">
              <i className="fas fa-edit"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default ItemAddress;
