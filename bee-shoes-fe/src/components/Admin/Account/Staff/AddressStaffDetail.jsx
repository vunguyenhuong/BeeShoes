import { Button, Col, Collapse, Form, Input, Modal, Row, message } from "antd";
import Item from "antd/es/list/Item";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";

function AddressStaffDetail({ props, address, addressIndex, onSuccess }) {
  const [dataAddress, setDataAddress] = useState(null);
  const [form] = Form.useForm();
  if (!props) {
    return <Loading />;
  }

  const ItemAddress = ({data}) => {
    return (
      <>
        <Form layout="vertical" initialValues={
          { name: data.name, phoneNumber: data.phoneNumber, specificAddress: data.specificAddress}
        }>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={"Tên"} name={"name"} rules={[{ required: true, message: "Tên không được để trống!", },]} >
                <Input placeholder="Nhập tên ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={"Số điện thoại"} name={"phoneNumber"} rules={[{ required: true, message: "Số điện thoại không được để trống!", },]} >
                <Input placeholder="Nhập số điện thoại ..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={"Địa chỉ cụ thể"} name={"specificAddress"} rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!", },]} >
                <Input placeholder="Nhập địa chỉ cụ thể..." />
              </Form.Item>
            </Col>
            <GHNInfo prov={data.province} distr={data.district} war={data.ward}/>
            <Col span={24} className="d-flex justify-content-end mt-3">
              <Button type="primary" className="bg-warning" htmlType="submit">
                <i className="fas fa-edit"></i>
              </Button>
            </Col>
          </Row>
        </Form>
      </>
    )
  }

  return (
    <>
      {props.map((item, index) => (
        <>
          <Collapse
            size="small"
            defaultActiveKey={index}
            items={[{ key: `${index}`, label: 'Địa chỉ', children: <ItemAddress data={item} />, }]}
          />
        </>
      ))}
    </>
  );
}

export default AddressStaffDetail;
