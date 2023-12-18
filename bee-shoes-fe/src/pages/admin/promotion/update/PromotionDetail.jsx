import { Breadcrumb, Button, Col, Form, Input, Row, Modal } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '~/components/Loading/Loading';
import httpRequest from '~/utils/httpRequest';
import TableShoe from '../TableShoe';
import TableShoeDetail from '../TableShoeDetail';
import { toast } from 'react-toastify';

function PromotionDetail() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const [listShoeId, setListShoeId] = useState();
    const [listShoeDetailId, setListShoeDetailId] = useState();
    useEffect(() => {
        const timeout = setTimeout(() => {
            loadPromotion(id);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [id]);

    const loadPromotion = () => {
        httpRequest.get(`/promotion/${id}`).then(response => {
            setPromotion(response.data);
            form.setFieldsValue({
                code: response.data.code,
                name: response.data.name,
                value: response.data.value,
                startDate: new Date(response.data.startDate + "Z").toISOString().slice(0, 16),
                endDate: new Date(response.data.endDate + "Z").toISOString().slice(0, 16),
            })
        }).catch(e => {
            console.log(e);
        })

        httpRequest.get(`/promotion/list-shoe-id?idPromotion=${id}`).then(response => {
            setListShoeId(response.data)
        }).catch(e => {
            console.log(e);
        })
        httpRequest.get(`/promotion/list-shoe-detail-id?idPromotion=${id}`).then(response => {
            setListShoeDetailId(response.data)
        }).catch(e => {
            console.log(e);

        })
        setLoading(false);
    }

    const handleUpdate = (data) => {
        Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: "Xác nhận thêm đợt giảm giá mới?",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                await httpRequest.put(`/promotion/${id}`, { ...data, productDetails: listShoeDetailId }).then(response => {
                    console.log(response);
                    toast.success("Cập nhật thành công!");
                    loadPromotion();
                }).catch(e => {
                    console.log(e);
                    toast.error(e.response.data);
                })
            },
        });
    }

    if (loading) {
        <Loading />
    }
    return (
        <>
        <Breadcrumb className="mb-2">
            <Breadcrumb.Item>
            <Link to="/">
                <FaHome /> Trang chủ
            </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <Link to="/admin/promotion">Danh sách đợt giảm giá</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item> {promotion.name}</Breadcrumb.Item>
      </Breadcrumb>
            <Form layout="vertical" form={form} onFinish={(data) => handleUpdate(data)}>
                <Row gutter={24}>
                    <Col xl={12}>
                        <Row gutter={10}>
                            <Col xl={12}>
                                <Form.Item label={"Mã đợt giảm giá"} name={"code"} rules={[{ required: true, message: "Mã đợt giảm giá không được để trống!", },]}>
                                    <Input placeholder="Nhập mã đợt giảm giá..." />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Tên đợt giảm giá"} name={"name"} rules={[{ required: true, message: "Tên đợt giảm giá không được để trống!", },]} >
                                    <Input placeholder="Nhập tên đợt giảm giá..." />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Giá trị (%)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                                    <Input placeholder="Nhập % đợt giảm giá..." />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Ngày bắt đầu"} name={"startDate"} rules={[{ required: true, message: "Ngày bắt đầu không được để trống!", },]} >
                                    <Input type="datetime-local" />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Ngày kết thúc"} name={"endDate"} rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                                    <Input type="datetime-local" />
                                </Form.Item>
                            </Col>
                            <Col xl={24}>
                                <Button type="primary" className="bg-warning" htmlType="submit">Cập nhật đợt giảm giá</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={12}>
                        <TableShoe setRowKeys={listShoeId} setProductIds={setListShoeId} />
                    </Col>
                </Row>
                <TableShoeDetail idProduct={listShoeId} setRowKeys={listShoeDetailId} setSelectedProductDetail={(value) => setListShoeDetailId(value)} />
            </Form >
        </>
    )
}

export default PromotionDetail