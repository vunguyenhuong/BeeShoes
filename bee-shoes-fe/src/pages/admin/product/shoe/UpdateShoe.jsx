import { Button, Form, Input, Modal, Select, Tooltip } from 'antd';
import { Option } from 'antd/es/mentions';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as request from "~/utils/httpRequest";

function UpdateShoe({ props, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);
    const [searchBrand, setSearchBrand] = useState(null);
    const [brandList, setBrandList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        console.log(data);
        request.put(`/shoe/${props.id}`, data).then(response => {
            toast.success('Cập nhật thành công!');
            setIsModalOpen(false);
            onSuccess();
        }).catch(e => {
            console.log(e)
            if (e.response.status === 500) {
                toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
        })
        // setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        request.get('/category', { params: { name: searchCate } }).then((response) => {
            setCateList(response.data);
        });
    }, [searchCate])

    useEffect(() => {
        request.get('/brand', { params: { name: searchBrand } }).then((response) => {
            setBrandList(response.data);
        });
    }, [searchBrand])

    return (
        <>
            <Tooltip placement="bottom" title="Chỉnh sửa sản phẩm">
                <Button type="primary" className="bg-warning" onClick={showModal}><i className="fas fa-edit me-1"></i></Button>
            </Tooltip>
            <Modal title="Cập nhật thông tin sản phẩm" open={isModalOpen} onCancel={handleCancel} footer="">
                <Form onFinish={handleOk} layout="vertical" initialValues={{
                    name: props.name,
                    category: props.category.id,
                    brand: props.brand.id
                }}>
                    <Form.Item label={"Tên giày"} name={"name"} rules={[{ required: true, message: "Tên không được để trống!" }]}>
                        <Input placeholder="Nhập tên giày..." />
                    </Form.Item>
                    <Form.Item label={"Danh mục"} name={"category"} rules={[{ required: true, message: "Danh mục không được để trống!" }]}>
                        <Select className="me-2" showSearch optionFilterProp="children" style={{ width: '100%' }} onSearch={setSearchCate} placeholder="Chọn danh mục...">
                            <Option value="">-- Chọn danh mục --</Option>
                            {cateList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={"Thương hiệu"} name={"brand"} rules={[{ required: true, message: "Thương hiệu không được để trống!" }]}>
                        <Select className="me-2" showSearch optionFilterProp="children" style={{ width: '100%' }} onSearch={setSearchBrand} placeholder="Chọn thương hiệu...">
                            <Option value="">-- Chọn thương hiệu --</Option>
                            {brandList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit" className='bg-warning'><i className="fas fa-edit me-1"></i> Cập nhật</Button>
                    </div>
                </Form>
            </Modal>

        </>
    );
}

export default UpdateShoe;