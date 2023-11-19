import { Col, Row, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import httpRequest from '~/utils/httpRequest';

function TopSell() {
    const [topSell, setTopSell] = useState([]);

    useEffect(() => {
        httpRequest.get('/shoe/top-sell', {}).then(response => {
            setTopSell(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, [])
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: <i className='fas fa-image'></i>,
            dataIndex: 'images',
            key: 'images',
            render: (x, record) => (
                <>
                    <img src={x} style={{ width: "100px", height: "100px" }} alt='' className='object-fit-cover' />
                </>
            )
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (x, record) => (
                <>
                    <ul className='list-unstyled'>
                        <li className='fw-semibold'>{x}</li>
                        <small>
                            <li className='text-danger fw-semibold'><FormatCurrency value={record.minPrice} /> - <FormatCurrency value={record.maxPrice} /></li>
                            <li>Thương hiệu: {record.brand}</li>
                            <li>Danh mục: {record.category}</li>
                        </small>
                    </ul>
                </>
            )
        },
        {
            title: <span className='text-nowrap'>Số lượng bán ra</span>,
            dataIndex: 'quantitySold',
            key: 'quantitySold',
        },
    ]

    return (
        <>
            <Title level={5}>TOP SẢN PHẨM BÁN CHẠY</Title>
            <Table
                className='text-nowrap'
                columns={columns}
                dataSource={topSell}
                pagination={false}
            />
        </>
    )
}

export default TopSell