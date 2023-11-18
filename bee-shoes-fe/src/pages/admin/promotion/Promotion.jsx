import { Button, Col, Input, Radio, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import FormatDate from '~/utils/FormatDate';
import httpRequest from '~/utils/httpRequest';
import VoucherStatus from '../voucher/VoucherSatus';

function Promotion() {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        httpRequest.get('/promotion').then(response => {
            setPromotions(response.data.data);
        }).catch(e => {
            console.log(e);
        })
    }, [])

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            className: "text-center",
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (x) => <FormatDate date={x} />
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (x) => <FormatDate date={x} />
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (x) => <VoucherStatus status={x} />
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'id',
            render: (x) => (
                <Link to={`/admin/promotion/${x}`} className="btn btn-sm text-warning">
                    <i className="fas fa-edit"></i>
                </Link>
            )
        },
    ]
    return (
        <>
            <h6 className="fw-semibold">Danh sách khuyến mại</h6>
            <Row gutter={12}>
                <Col span={8}>
                    <label className="mb-1">Tìm kiếm </label>
                    <Input
                        // onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Tìm kiếm khuyến mại theo tên, mã ..."
                    //
                    />
                </Col>
                <Col span={12}>
                    <div className="mb-1">Trạng thái</div>
                    <label className="mb-1">ㅤ</label>
                    <Radio.Group
                        defaultValue={""}
                    // onChange={(event) => {
                    //     setStatusValue(event.target.value);
                    //     setCurrentPage(1);
                    // }}
                    >
                        <Radio value={""}>Tất cả</Radio>
                        <Radio value={0}>Sắp diễn ra</Radio>
                        <Radio value={1}>Đang diễn ra</Radio>
                        <Radio value={2}>Đã kết thúc</Radio>
                    </Radio.Group>
                </Col>
                {/* <Col span={2}>
            <div className="mb-1">Số bản ghi</div>
            <Select
              defaultValue={5}
              onChange={(value) => setPageSize(value)}
              options={[{ value: 5 }, { value: 10 }, { value: 15 }]}
            />
          </Col> */}

                <Col span={4}>
                    <div className="mb-1">‍</div>
                    <Link to={"/admin/promotion/create"}>
                        <Button
                            type="primary"
                            className="bg-warning"
                            style={{ textAlign: "center" }}
                        >
                            <i className="fas fa-plus-circle me-1"></i>Thêm khuyến mại
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table className="mt-3" columns={columns} dataSource={promotions}
                pagination={{
                    showSizeChanger: true,
                    // current: currentPage,
                    // pageSize: pageSize,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    showQuickJumper: true,
                    // total: totalPages * pageSize,
                    onChange: (page, pageSize) => {
                        // setCurrentPage(page);
                        // setPageSize(pageSize);
                    },
                }} />

        </>
    )
}

export default Promotion