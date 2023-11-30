import { Button, Carousel, Col, Form, Input, Row, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";

function TableShoeDetail({ idProduct, setSelectedProductDetail, setRowKeys }) {
    const [listProductDetail, setListProductDetail] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [formFilter] = Form.useForm();
    const [listSize, setListSize] = useState([]);
    const [searchSize, setSearchSize] = useState('');

    const [listColor, setListColor] = useState([]);
    const [listSole, setListSole] = useState([]);

    const [dataFilter, setDataFilter] = useState({});

    useEffect(() => {
        loadData(idProduct, dataFilter);
    }, [idProduct, dataFilter, currentPage, pageSize])

    useEffect(() => {
        setDataFilter(null);
        formFilter.resetFields();
    }, [idProduct])

    useEffect(() => {
        setSelectedRowKeys(setRowKeys);
    }, [setRowKeys])
    const loadData = (idProduct, dataFilter) => {
        request.get('/shoe-detail', {
            params: {
                shoe: idProduct,
                name: dataFilter?.name,
                size: dataFilter?.size,
                color: dataFilter?.color,
                sole: dataFilter?.sole,
                page: 1,
                sizePage: 1_000_000
            }
        }).then(response => {
            setListProductDetail(response.data);
            setTotalPages(response.totalPages);
        }).catch(e => {
            console.log(e);
        })
    }

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
    }, [searchSize])

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
        },
        {
            title: (<i className="fas fa-image"></i>),
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: "100px" }} >
                    {images.split(',').map((image, index) => (
                        <img src={image} alt="images" style={{ width: "100px", height: "100px" }} className="object-fit-contain" />
                    ))}
                </Carousel>
            )
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            render: (x, record) => (
                <>
                    {x}
                    <br />
                    {record.discountValue !== null && <small className="fw-semibold">SALE <span className="text-danger">{record.discountPercent} %</span></small>}
                </>
            )
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (x) => (x == null ? 0 : x),
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            render: (x, record) => (
                <>
                    {record.discountPercent !== null ? (
                        <>
                            <span className="text-danger"><FormatCurrency value={record.discountValue} /></span> <br /> <span className="text-decoration-line-through text-secondary"><FormatCurrency value={record.price} /></span>
                        </>
                    ) : (
                        <span className="text-danger"><FormatCurrency value={record.price} /></span>
                    )}
                </>
            )
        },
    ];


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log(newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedProductDetail(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
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
                        <Form.Item label="Loại đế" name={"sole"}>
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
                    <Button onClick={() => formFilter.submit()} className='bg-warning text-dark' type='primary' icon={<i className='fas fa-search'></i>}>Tìm kiếm</Button>
                </div>
            </Form>
            <Table
                rowKey="id"
                rowSelection={rowSelection}
                dataSource={listProductDetail}
                columns={columns}
                className="mt-3"
                pagination={{
                    showSizeChanger: true,
                    current: currentPage,
                    pageSize: pageSize,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    showQuickJumper: true,
                    total: listProductDetail.length,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />
        </>
    );
}

export default TableShoeDetail;