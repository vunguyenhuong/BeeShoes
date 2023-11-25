import { Button, Input, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import QrCode from '~/components/QrCode'

function Giveback() {
    
    return (
        <>
            <Title level={5}>Trả hàng</Title>
            <div className="d-flex">
                <div className="flex-grow-1 me-2">
                    <Input placeholder='Nhập mã đơn hàng..., VD: HD01234' />
                </div>
                <div className="me-2">
                    <Button type='primary' className='bg-warning'>Tìm kiếm</Button>
                </div>
                <div className="me-2">
                    <QrCode />
                </div>
            </div>
        </>
    )
}

export default Giveback