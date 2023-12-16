import { Button, Form, Modal, Radio, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import * as request from "~/utils/httpRequest";

function GivebackAll({ bill, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const handleSubmit = (data) => {
        request.get(`/bill/give-back-all/${bill.id}`, { params: { note: data.note } }).then(response => {
            setIsModalOpen(false);
            onSuccess();
            toast.success("Trả hàng thành công!");
        }).catch(e => {
            console.log(e);
            toast.success("Có lỗi xảy ra!");
        })
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} danger icon={<i class="fa-solid fa-reply-all"></i>}>Trả hàng tất cả</Button>
            <Modal title="Nhập lý do trả hàng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={<Button form="formNote" type="primary" htmlType="submit">Xác nhận</Button>}>
                <p><span className="text-danger">*</span>Chọn mẫu tin nhắn:</p>
                <Radio.Group className="mb-3" onChange={(e) => { form.setFieldsValue({ note: e.target.value }) }}>
                    <Space direction="vertical">
                        <Radio value={'Không hài lòng với chất lượng sản phẩm'}>Không hài lòng với chất lượng sản phẩm</Radio>
                        <Radio value={'Kích thước hoặc màu sắc không phù hợp'}>Kích thước hoặc màu sắc không phù hợp</Radio>
                        <Radio value={'Hủy đơn đặt hàng'}>Hủy đơn đặt hàng</Radio>
                        <Radio value={'Khách hàng đổi ý, không muốn mua nữa'}>Khách hàng đổi ý, không muốn mua nữa</Radio>
                        <Radio value={''}>Khác</Radio>
                    </Space>
                </Radio.Group>
                <Form id="formNote" onFinish={(data) => handleSubmit(data)} form={form}>
                    <Form.Item name={"note"} rules={[{ required: true, message: "Ghi chú không được để trống!" }]}>
                        <TextArea placeholder="Nhập lý do trả hàng..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default GivebackAll