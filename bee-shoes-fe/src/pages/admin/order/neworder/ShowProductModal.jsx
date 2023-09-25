import { Button, Card, Carousel, Col, Input, Modal, Pagination, Radio, Row, Select } from 'antd'
import Meta from 'antd/es/card/Meta';
import { Option } from 'antd/es/mentions';
import Title from 'antd/es/typography/Title';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import * as request from '~/utils/httpRequest';
import ChooseProductModal from './ChooseProductModal';

function ShowProductModal({ idBill, onClose }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productList, setProductList] = useState([]);
    useEffect(() => {
        request.get('/shoe').then(response => {
            setProductList(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, [isModalOpen])
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} className="bg-warning text-dark">Thêm sản phẩm</Button>
            <Modal title="Danh sách sản phẩm" open={isModalOpen} onCancel={() => {setIsModalOpen(false);onClose();}} footer="" width={1000}>
                <Row gutter={10} className='mb-3'>
                    <Col span={8}>
                        <label className="mb-1">Tên sản phẩm</label>
                        <Input placeholder="Tìm kiếm sản phẩm theo tên..." />
                    </Col>
                    <Col span={8}>
                        <label className="mb-1">Danh mục</label>
                        <Select showSearch placeholder="Chọn danh mục..." optionFilterProp="children" style={{ width: "100%" }} >
                            <Option value="">Chọn danh mục</Option>
                            {/* {listCate.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))} */}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <label className="mb-1">Thương hiệu</label>
                        <Select showSearch placeholder="Chọn thương hiệu..." optionFilterProp="children" style={{ width: "100%" }} >
                            <Option value="">Chọn thương hiệu</Option>
                            {/* {listBrand.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))} */}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={10}>
                    {productList.map((item, index) => (
                        <Col xl={6} key={index}>
                            <Card hoverable
                                cover={
                                    <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} className='w-100'>
                                        {item.images.split(',').map((image, index) => (
                                            <div className="" style={{ height: "200px" }}>
                                                <img src={image} alt="images" style={{ width: "100%", height: "200px" }} className="object-fit-cover" />
                                            </div>
                                        ))}
                                    </Carousel>}
                                actions={[
                                    <ChooseProductModal shoe={item} idBill={idBill} />
                                ]}
                            >
                                <Meta title={item.name} description={`Số lượng: ${item.quantity}`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="text-center">
                    <Pagination />
                </div>
            </Modal >
        </>
    )
}

export default ShowProductModal