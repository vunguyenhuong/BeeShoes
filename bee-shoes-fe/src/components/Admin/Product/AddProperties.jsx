import { Button, Form, Input } from 'antd'
import React from 'react'
import { toast } from 'react-toastify';
import * as request from "~/utils/httpRequest";

function AddProperties({ name, placeholder, onSuccess }) {
    const [form] = Form.useForm();
    const handleSubmit = (data) => {
        request.post(`/${name}`, { name: data.name }).then(response => {
            form.resetFields();
            toast.success('Thêm thành công!');
            onSuccess();
        }).catch(e => {
            form.resetFields();
            toast.error(e.response.data);
        })
    }
    return (
        <>
            <Form className='d-flex' onFinish={handleSubmit} form={form}>
                <Form.Item name={"name"} rules={[{ required: true, message: "Không được để trống!" },]} className='me-1 p-0 m-0'>
                    <Input placeholder={`Thêm ${placeholder}`} />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#FFC107" }} icon={<i className="fas fa-plus"></i>}>Thêm</Button>
            </Form>
        </>
    )
}

export default AddProperties