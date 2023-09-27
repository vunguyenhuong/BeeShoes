import { Button, Card, Carousel, Col, Form, Input, Modal, Pagination, Popconfirm, Radio, Row, Select, Table } from 'antd'
import Meta from 'antd/es/card/Meta';
import { Option } from 'antd/es/mentions';
import Title from 'antd/es/typography/Title';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import * as request from '~/utils/httpRequest';
import ChooseProductModal from './ChooseProductModal';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function ShowProductModal({ idBill, onClose }) {
    const [formFilter] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productList, setProductList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(3);

    const [listSize, setListSize] = useState([]);
    const [searchSize, setSearchSize] = useState('');

    const [listColor, setListColor] = useState([]);
    const [listSole, setListSole] = useState([]);

    const [dataFilter, setDataFilter] = useState({});

    const [inputQuantity, setInputQuantity] = useState(0);

    useEffect(() => {
        request.get('/shoe-detail', {
            params: {
                name: dataFilter.name,
                size: dataFilter.size,
                color: dataFilter.color,
                sole: dataFilter.sole
            }
        }).then(response => {
            setProductList(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, [isModalOpen, dataFilter])

    useEffect(() => {
        request.get('/size', { params: { name: searchSize } }).then(response => {
            setListSize(response.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/color', { params: { name: searchSize } }).then(response => {
            setListColor(response.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/sole', { params: { name: searchSize } }).then(response => {
            setListSole(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, [isModalOpen, searchSize])
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render(x, record) {
                return (
                    <div className="d-flex">
                        <div className="me-2">
                            <img src={record.images.split(',')[0]} alt="" width={"100px"} height={"100"} className='object-fit-cover' />
                        </div>
                        <div className="">
                            <ul className='list-unstyled'>
                                <li>{x}</li>
                                <li><small>Màu: {record.color} - Kích cỡ: {record.size}</small></li>
                                <li><small>Loại đế: {record.sole}</small></li>
                            </ul>
                        </div>
                    </div>
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
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (id, record) => (
                <>
                    <Popconfirm
                        title="Nhập số lượng"
                        description={
                            <>
                                <Input onChange={(e) => setInputQuantity(e.target.value)} status='success' />
                            </>
                        }
                        onConfirm={() => {
                            if (inputQuantity > record.quantity) {
                                toast.error("Quá số lượng cho phép!");
                            }
                            if (inputQuantity < 0) {
                                toast.error("Số lượng phải > 0!");
                            }
                            setInputQuantity(null);
                        }}
                        // onCancel={cancel}
                        okText="OK"
                        cancelText="Thoát"
                    >
                        <Button type='primary' className='bg-warning text-dark'>Chọn</Button>
                    </Popconfirm>
                </>
            )
        },
    ]
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} className="bg-warning text-dark">Thêm sản phẩm</Button>
            <Modal title="Danh sách sản phẩm" open={isModalOpen} onCancel={() => { setIsModalOpen(false); onClose(); }} footer="" width={1000}>
                <Form layout='vertical' onFinish={(data) => setDataFilter(data)} form={formFilter}>
                    <Row gutter={10}>
                        <Col span={6}>
                            <Form.Item label="Tên sản phẩm" name={"name"}>
                                <Input placeholder='Tìm kiếm sản phẩm theo tên...' />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Kích cỡ" name={"size"}>
                                <Select showSearch placeholder="Chọn kích cỡ..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn kích cỡ</Option>
                                    {listSize.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Màu sắc" name={"color"}>
                                <Select showSearch placeholder="Chọn màu sắc..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn màu sắc</Option>
                                    {listColor.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Kích cỡ" name={"sole"}>
                                <Select showSearch placeholder="Chọn loại đế..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn loại đế</Option>
                                    {listSole.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Button className='me-1 bg-danger' onClick={() => { formFilter.resetFields() }} type='primary' icon={<i class="fa-solid fa-rotate-left"></i>}>Làm mới</Button>
                        <Button htmlType='submit' className='bg-warning text-dark' type='primary' icon={<i className='fas fa-search'></i>}>Tìm kiếm</Button>
                    </div>
                </Form>

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