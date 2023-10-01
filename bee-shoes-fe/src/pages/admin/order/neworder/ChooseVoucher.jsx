import { AutoComplete, Button, Col, Divider, Input } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import * as request from "~/utils/httpRequest";

function ChooseVoucher({ onSelectVoucher }) {
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

    const onSelect = (value) => {
        loadData(value);
        setSearchValue("");
        request.get(`/voucher?name=${value}`).then(response => {
            onSelectVoucher(response.data[0]);
        }).catch(e => {
            console.log(e);
        })
    };
    return (
        <>
            <Col xl={24}>
                <AutoComplete
                    value={searchValue}
                    onChange={handleSearch}
                    onSelect={onSelect}
                    style={{ width: "100%" }}
                    options={listVoucher.map((item) => ({
                        value: item.name,
                        label: (
                            <>
                                <ul className='list-unstyled'>
                                    <li className='fw-semibold'>{item.name} <span className='float-end fw-normal small text-danger'>{item.code}</span></li>
                                    <li>Phần trăm giảm: {item.percentReduce} % <span className='float-end'>Đơn tối thiểu: <span className='text-danger fw-semibold'><FormatCurrency value={item.minBillValue} /></span></span></li>
                                    <li>Số lượng: {item.quantity}</li>
                                </ul>
                            </>
                        ),
                    }))}
                >
                    <Input.Search placeholder="Tìm kiếm voucher..." />
                </AutoComplete>
            </Col>
        </>
    )
}

export default ChooseVoucher