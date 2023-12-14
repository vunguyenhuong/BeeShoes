import { Breadcrumb, Button, Col, Form, Input, Row } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom';
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
                startDate: response.data.startDate,
                endDate: response.data.endDate
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
        httpRequest.put(`/promotion/${id}`, { ...data, productDetails: listShoeDetailId }).then(response => {
            console.log(response);
            toast.success("Cập nhật thành công!");
            navigate('/admin/promotion');
        }).catch(e => {
            console.log(e);
            toast.error(e.response.data); 
        })
    }

    if (loading) {
        <Loading />
    }
    return (
        <>
            <Breadcrumb className="mb-3"
                items={[{ href: "/", title: <FaHome /> }, { href: "/admin/promotion", title: "Danh sách khuyến mại" }, { title: `${promotion.name}` },]}
            />
            <Form layout="vertical" form={form} onFinish={(data) => handleUpdate(data)}>
                <Row gutter={24}>
                    <Col xl={12}>
                        <Row gutter={10}>
                            <Col xl={12}>
                                <Form.Item label={"Mã khuyến mại"} name={"code"} rules={[{ required: true, message: "Mã khuyến mại không được để trống!", },]}>
                                    <Input placeholder="Nhập mã khuyến mại..." />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Tên khuyến mại"} name={"name"} rules={[{ required: true, message: "Tên khuyến mại không được để trống!", },]} >
                                    <Input placeholder="Nhập tên khuyến mại..." />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item label={"Giá trị (%)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                                    <Input placeholder="Nhập % khuyến mại..." />
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
                                <Button type="primary" className="bg-warning" htmlType="submit">Cập nhật khuyến mại</Button>
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