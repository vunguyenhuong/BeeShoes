import { AutoComplete, Badge, Button, Col, Divider, Input, Modal, Radio, Tag } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import FormatDate from '~/utils/FormatDate';
import * as request from "~/utils/httpRequest";

function ChooseVoucher({ onSelectVoucher }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listVoucher, setListVoucher] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [selectedVoucher, setSelectedVoucher] = useState({});

    const loadData = (searchValue) => {
        request.get('/voucher', {
            params: {
                name: searchValue,
                deleted: false,
                sizePage: 5
            }
        }).then(response => {
            setListVoucher(response.data);
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
                        <i className='fas fa-ticket'></i> BeeShoes Voucher
                    </div>
                    <div className="text-secondary" onClick={() => { setIsModalOpen(true); loadData() }}>
                        Chọn hoặc nhập mã <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
            </Col>

            <Modal title="Chọn Voucher" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} footer={""} width={500}>
                <div className="" style={{ maxHeight: '64vh', overflowY: 'auto',overflowX: 'hidden' }}>
                    <div className="container">
                        <Input placeholder='Tìm kiếm voucher theo mã, tên...' onChange={(e) => setSearchValue(e.target.value)} />
                        <h6 className='mt-2'>Voucher dành riêng cho bạn</h6>
                        {listVoucher.map((item, index) => (
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
                        <h6 >Các voucher khác</h6>
                        {listVoucher.map((item, index) => (
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