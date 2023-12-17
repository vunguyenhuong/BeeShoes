import { Button, Col, Form, Input, Modal, Row } from 'antd'
import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import GHNInfo from '~/components/GhnInfo';
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";


function ItemAddress({ props, onSuccess }) {
    const [dataAddress, setDataAddress] = useState(null);
    const handleUpdate = (data) => {
        data.province = dataAddress != null ? dataAddress.province : props.province
        data.district = dataAddress != null ? dataAddress.district : props.district
        data.ward = dataAddress != null ? dataAddress.ward : props.ward
        data.defaultAddress = true;
        const { confirm } = Modal;

        confirm({
            title: "Xác nhận ",
            icon: <ExclamationCircleFilled />,
            content: "Bạn có chắc muốn cập nhật địa chỉ này? ",
            okText: "Xác nhận",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                request.put(`/address/${props.id}`, data).then(response => {
                    console.log(response);
                    toast.success('Cập nhật địa chỉ thành công!');
                    onSuccess();
                }).catch(e => {
                    console.log(e);
                });
            },
            onCancel() {
                console.log("Cancel");
            },
        });

    }
    return (
        <>
            <Form layout="vertical" initialValues={
                {
                    name: props.name,
                    phoneNumber: props.phoneNumber,
                    specificAddress: props.specificAddress,
                }
            } onFinish={handleUpdate}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={"Tên"} name={"name"} rules={[{ required: true, message: "Tên không được để trống!", },]} >
                            <Input placeholder="Nhập tên ..." />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={"Số điện thoại"} name={"phoneNumber"} rules={[{ required: true, message: "Số điện thoại không được để trống!", }, { pattern: '^0[0-9]{9}$', message: "SDT không đúng định dạng!" }]} >
                            <Input placeholder="Nhập số điện thoại ..." />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label={"Địa chỉ cụ thể"} name={"specificAddress"} rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!", },]} >
                            <Input placeholder="Nhập địa chỉ cụ thể..." />
                        </Form.Item>
                    </Col>
                    <GHNInfo prov={props.province} distr={props.district} war={props.ward} dataAddress={setDataAddress} />
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

export default ItemAddress