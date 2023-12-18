import { AutoComplete, Badge, Button, Col, Divider, Empty, Input, Modal, Radio, Tag } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import FormatDate from '~/utils/FormatDate';
import * as request from "~/utils/httpRequest";

function ChooseVoucher({ onSelectVoucher, customerId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [privateVoucher, setPrivateVoucher] = useState([]);
    const [publicVoucher, setPublicVoucher] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [selectedVoucher, setSelectedVoucher] = useState({});

    const loadData = (searchValue) => {
        request.get('/voucher/public', {
            params: {
                name: searchValue,
                deleted: false,
                status: 1
            }
        }).then(response => {
            setPublicVoucher(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
        request.get(`/voucher/private/${customerId}`, {
            params: {
                name: searchValue,
                deleted: false,
                status: 1
            }
        }).then(response => {
            setPrivateVoucher(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        loadData(searchValue)
    }, [searchValue])

    const handleSearch = (value) => {
        setSearchValue(value);
        loadData(value);
    };

    return (
        <>
            <Col xl={24}>
                <div className="border border-1 p-2 d-flex rounded-2" style={{ cursor: "pointer" }}>
                    <div className="flex-grow-1 fw-semibold">
                        <i className='fas fa-ticket'></i> Phiếu giảm giá
                    </div>
                    <div className="text-secondary" onClick={() => { setIsModalOpen(true); loadData() }}>
                        Chọn hoặc nhập mã <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
            </Col>

            <Modal title="Chọn phiếu giảm giá" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} footer={""} width={500}>
                <div className="" style={{ maxHeight: '64vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="container">
                        <Input placeholder='Tìm kiếm phiếu giảm giá theo mã, tên...' onChange={(e) => setSearchValue(e.target.value)} />
                        <h6 className='mt-2'>Phiếu giảm giá dành riêng cho bạn</h6>
                        {privateVoucher.length === 0 ? <Empty description="Danh sách phiếu giảm giá trống" /> : privateVoucher.map((item, index) => (
                            <div onClick={() => { setSelectedVoucher(item); onSelectVoucher(item) }} className={`d-flex align-items-center position-relative pt-2 mt-3 border border-2 rounded-2 px-2 ${selectedVoucher === item && 'border-warning'}`}>
                                <div className="flex-grow-1">
                                    <ul className='list-unstyled'>
                                        <li className='fw-semibold'><span className='text-warning'>[{item.code}]</span> {item.name} <Tag color="gold">{item.percentReduce} %</Tag></li>
                                        <li className='small'>Đơn tối thiểu: <FormatCurrency value={item.minBillValue} /></li>
                                        <li className='small'>Ngày kết thúc: <FormatDate date={item.endDate} /></li>
                                    </ul>
                                </div>
                                <div className="">
                                    <input type="radio" class="form-check-input" name='voucher' checked={selectedVoucher === item ? true : false} />
                                </div>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                                    x {item.quantity}
                                </span>
                            </div>
                        ))}
                        <hr className='' />
                        <h6 >Các phiếu giảm giá khác</h6>
                        {publicVoucher.length === 0 ? <Empty description="Danh sách phiếu giảm giá trống" /> : publicVoucher.map((item, index) => (
                            <div onClick={() => { setSelectedVoucher(item); onSelectVoucher(item) }} className={`d-flex align-items-center position-relative pt-2 mt-3 border border-2 rounded-2 px-2 ${selectedVoucher === item && 'border-warning'}`}>
                                <div className="flex-grow-1">
                                    <ul className='list-unstyled'>
                                        <li className='fw-semibold'><span className='text-warning'>[{item.code}]</span> {item.name} <Tag color="gold">{item.percentReduce} %</Tag></li>
                                        <li className='small'>Đơn tối thiểu: <FormatCurrency value={item.minBillValue} /></li>
                                        <li className='small'>Ngày kết thúc: <FormatDate date={item.endDate} /></li>
                                    </ul>
                                </div>
                                <div className="">
                                    <input type="radio" class="form-check-input" name='voucher' checked={selectedVoucher === item ? true : false} />
                                </div>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                                    x {item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ChooseVoucher