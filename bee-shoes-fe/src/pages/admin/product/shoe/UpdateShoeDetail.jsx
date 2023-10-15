import { Button, Col, Form, Input, Modal, QRCode, Row, Select, Space, Tooltip } from 'antd'
import { Option } from 'antd/es/mentions';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import AddProperties from '~/components/Admin/Product/AddProperties';
import ImageModalUpdate from '~/components/Admin/Product/ImageModalUpdate';
import * as format from '~/utils/format';
import * as request from "~/utils/httpRequest";

function UpdateShoeDetail({ props, onSuccess }) {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [sole, setSole] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);

    const [searchSize, setSearchSize] = useState(null);
    const [searchColor, setSearchColor] = useState(null);
    const [searchSole, setSearchSole] = useState(null);

    const showModal = () => {
        setIsModalOpen(true);
        setSearchSize(props.size);
        setSearchColor(props.color);
        setSearchSole(props.sole);
        form.setFieldsValue({
            size: props.size,
            color: props.color,
            sole: props.sole,
            quantity: props.quantity,
            price: format.formatCurrency(props.price),
            weight: props.weight
        })
    };
    const handleOk = (data) => {
        console.log(data);

        // request.put(`/shoe/${props.id}`, data).then(response => {
        //     toast.success('Cập nhật thành công!');
        //     setIsModalOpen(false);
        //     onSuccess();
        // }).catch(e => {
        //     console.log(e)
        //     if (e.response.status === 500) {
        //         toast.error(e.response.data);
        //     }
        //     toast.error(e.response.data.message);
        // })
        // setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        request.get("/size", { params: { name: searchSize } }).then((response) => {
            setSize(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [searchSize])
    useEffect(() => {
        request.get("/color", { params: { name: searchColor } }).then((response) => {
            setColor(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [searchColor])
    useEffect(() => {
        request.get("/sole", { params: { name: searchSole } }).then((response) => {
            setSole(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [searchSole])

    const handleSelectImg = (img) => {
        console.log(img);
    }

    return (
        <>
            <Tooltip placement="top" title="Chỉnh sửa">
                <Button type="text" onClick={showModal}><i className="fas fa-edit text-warning"></i></Button>
            </Tooltip>
            <Modal title={props.name} open={isModalOpen} onCancel={handleCancel} footer={
                <>
                    <Button type='primary' className='bg-warning' form={form}>Cập nhật</Button>
                </>
            } width={800}>
                <Form layout='vertical' form={form} onFinish={handleOk}>
                    <Row gutter={24}>
                        <Col xl={8}>
                            <Form.Item label={"Kích cỡ"} name={"size"} rules={[{ required: true, message: "Kích cỡ không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập kích cỡ..." optionFilterProp="children" onSearch={setSearchSize}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"kích cỡ"} name={"size"} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn kích cỡ</Option>
                                    {size.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Màu sắc"} name={"color"} rules={[{ required: true, message: "Màu sắc không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập màu sắc..." optionFilterProp="children" onSearch={setSearchColor}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"màu sắc"} name={"color"} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn màu sắc</Option>
                                    {color.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Loại đế"} name={"sole"} rules={[{ required: true, message: "Loại đế không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập tên đế giày..." optionFilterProp="children" onSearch={setSearchSole}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"đế giày"} name={"sole"} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn loại đế</Option>
                                    {sole.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Đơn giá"} name={"price"} rules={[{ required: true, message: "Đơn giá không được để trống!" }]}>
                                <Input placeholder='Nhập đơn giá...' />
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Số lượng"} name={"quantity"} rules={[{ required: true, message: "Đơn giá không được để trống!" }]}>
                                <Input placeholder='Nhập số lượng...' />
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Cân nặng"} name={"weight"} rules={[{ required: true, message: "Cân nặng không được để trống!" }]}>
                                <Input placeholder='Nhập cân nặng...' />
                            </Form.Item>
                        </Col>
                        <Col xl={6}>
                            <QRCode value={props.code} />
                        </Col>
                        <Col xl={18}>
                            Hình ảnh sản phẩm:
                            <div className="d-flex flex-wrap">
                                {props.images.split(',').map((image, index) => (
                                    <div className="position-relative me-2 mt-2">
                                        <img src={image} alt="images" width={100} height={100} className="object-fit-cover border border-warning" />
                                        <div className="position-absolute end-0 top-0">
                                            <button type="button" class="btn btn-sm border-0 text-danger">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ width: "100px", height: "100px" }} className="position-relative rounded-0 border border-warning d-flex align-items-center justify-content-center mt-2">
                                    <ImageModalUpdate handleChange={handleSelectImg} sttModal={props.id} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default UpdateShoeDetail