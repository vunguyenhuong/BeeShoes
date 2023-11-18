import { Col, Row, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react'
import httpRequest from '~/utils/httpRequest';
import TopSell from './TopSell';

function Statistic() {

    return (
        <>
            <Row gutter={16}>
                <Col xl={6}>
                    <div className="bg-warning border px-2 pt-2" style={{ height: "120px" }}>
                        <Title level={5}>ABC</Title>
                    </div>
                </Col>
                <Col xl={6}>
                    <div className="bg-warning border px-2 pt-2" style={{ height: "120px" }}>
                        <Title level={5}>ABC</Title>
                    </div>
                </Col>
                <Col xl={6}>
                    <div className="bg-warning border px-2 pt-2" style={{ height: "120px" }}>
                        <Title level={5}>ABC</Title>
                    </div>
                </Col>
                <Col xl={6}>
                    <div className="bg-warning border px-2 pt-2" style={{ height: "120px" }}>
                        <Title level={5}>ABC</Title>
                    </div>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col xl={12}>
                    <TopSell />
                </Col>
                <Col xl={12}>

                </Col>
            </Row>
        </>
    )
}

export default Statistic;