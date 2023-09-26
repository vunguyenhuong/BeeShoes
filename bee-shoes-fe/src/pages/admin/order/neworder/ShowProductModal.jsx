import { Button, Card, Carousel, Col, Input, Modal, Pagination, Radio, Row, Select, Table } from 'antd'
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(3);

    useEffect(() => {
        request.get('/shoe-detail').then(response => {
            setProductList(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, [isModalOpen])
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render(x, record) {
                return (
                    <Row>
                        <Col xl={12}>
                            <img src={record.images.split(',')[0]} alt="" width={100}/>
                        </Col>
                        <Col xl={12}>
                            <ul className='list-unstyled'>
                                <li>{x}</li>
                                <li><small>Màu: {record.color} - Kích cỡ: {record.size}</small></li>
                            </ul>
                        </Col>
                    </Row>
                );
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (x) => <FormatCurrency value={x} />
        },
        {
            title: 'Loại đế',
            dataIndex: 'sole',
            key: 'sole',
        },
    ]
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} className="bg-warning text-dark">Thêm sản phẩm</Button>
            <Modal title="Danh sách sản phẩm" open={isModalOpen} onCancel={() => { setIsModalOpen(false); onClose(); }} footer="" width={1000}>
                <Table dataSource={productList} columns={columns} className="mt-3"
                    pagination={{
                        showSizeChanger: true,
                        current: currentPage,
                        pageSize: pageSize,
                        pageSizeOptions: [3, 5, 10, 20,],
                        showQuickJumper: true,
                        total: totalPages * pageSize,
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }} />
                {/* <Row gutter={10}>
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
                </Row> */}
            </Modal >
        </>
    )
}

export default ShowProductModal