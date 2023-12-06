/* eslint-disable eqeqeq */
import { Button, Carousel, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import FormatCurrency from '~/utils/FormatCurrency';
import * as request from '~/utils/httpRequest';

function ChooseProductModal({ shoe, idBill }) {
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [shoeDetail, setShoeDetail] = useState(null);

    const [size, setSize] = useState(null);
    const [color, setColor] = useState(null);
    useEffect(() => {
        setShoeDetail(null);
        setColor(null);
        setSize(null);
    }, [isModalDetailOpen])
    useEffect(() => {
        request.get('/shoe-detail', {
            params: {
                shoe: shoe.id,
                color: color,
                size: size
            }
        }).then(response => {
            if (size !== null && color !== null) {
                setShoeDetail(response.data[0]);
            }
        }).catch(e => {
            console.log(e);
        })
        if (size === null || color === null) {
            setShoeDetail(null);
        }
    }, [size, color, shoe.id]);

    const handleChoose = (data) => {
        if (color === null) {
            toast.error("Vui lòng chọn màu sắc!");
        } else if (size === null) {
            toast.error("Vui lòng chọn kích cỡ!");
        } else {
            if (shoeDetail === undefined) {
                toast.error("Sản phẩm này không tồn tại!");
            } else {
                data.shoeDetail = shoeDetail?.code;
                data.bill = idBill;
                console.log(data);
                request.post('/bill-detail', data).then(response => {
                    toast.success('Thêm thành công!');
                    setIsModalDetailOpen(false);
                }).catch(e => {
                    console.log(e);
                })
            }
        }
    }
    return (
        <>
            <i className='fas fa-cart-plus w-100' onClick={() => setIsModalDetailOpen(true)}></i>
            <Modal title={shoe.name} open={isModalDetailOpen} onCancel={() => setIsModalDetailOpen(false)} footer="" width={800} key={shoe.id}>
                <Row gutter={10}>
                    <Col xl={8}>
                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} className='w-100'>
                            {shoeDetail != null | shoeDetail != undefined ?
                                shoeDetail.images.split(',').map((image, index) => (
                                    <div className="" style={{ height: "300px" }}>
                                        <img src={image} alt="images" style={{ width: "100%", height: "300px" }} className="object-fit-cover" />
                                    </div>
                                ))
                                :
                                shoe.images.split(',').map((image, index) => (
                                    <div className="" style={{ height: "300px" }}>
                                        <img src={image} alt="images" style={{ width: "100%", height: "300px" }} className="object-fit-cover" />
                                    </div>
                                ))
                            }
                        </Carousel>
                        <Row gutter={10} className='text-center mt-3'>
                            {shoeDetail != null | shoeDetail != undefined ?
                                shoeDetail.images.split(',').map((image, index) => (
                                    <Col xl={6} style={{ height: "64px" }}>
                                        <img src={image} alt="" style={{ height: "64px" }} className='w-100 object-fit-cover' />
                                    </Col>
                                ))
                                : ""}
                        </Row>
                    </Col>
                    <Col xl={16}>
                        <ul className='list-unstyled'>
                            <li>
                                <h5>
                                    {shoeDetail != null | shoeDetail != undefined ? shoeDetail?.name : shoe.name}
                                </h5>
                            </li>
                            <li className='mb-2 fw-semibold fs-5 text-danger'>
                                {shoeDetail != null | shoeDetail != undefined ? (<FormatCurrency value={shoeDetail?.price} />) : (
                                    <>
                                        <FormatCurrency value={shoe.minPrice} /> - <FormatCurrency value={shoe.maxPrice} />
                                    </>
                                )}
                            </li>
                            <li className='mb-2'>
                                {JSON.parse(`[${shoe.color}]`).map((item, index) => (
                                    <Button onClick={() => setColor(item.id)}
                                        type='text' className={`border border-warning me-2 ${color === item.id && 'bg-warning'}`}>
                                        {item.name}
                                    </Button>
                                ))}
                                {color !== null &&
                                    <span className='text-secondary' style={{ cursor: "pointer" }} onClick={() => setColor(null)}>
                                        <i className='fas fa-xmark-circle'></i> Xóa
                                    </span>
                                }
                            </li>
                            <li className='mb-2'>
                                {JSON.parse(`[${shoe.size}]`).map((item, index) => (
                                    <Button onClick={() => setSize(item.id)}
                                        type='text' className={`border border-warning me-2 ${size === item.id && 'bg-warning'}`}>
                                        {item.name}
                                    </Button>
                                ))}
                                {size !== null &&
                                    <span className='text-secondary' style={{ cursor: "pointer" }} onClick={() => setSize(null)}>
                                        <i className='fas fa-xmark-circle'></i> Xóa
                                    </span>
                                }
                            </li>
                            <li style={{ textAlign: "justify" }} className='mb-2'>
                                {shoe.description}
                            </li>
                            <li className='mb-2'>
                                {shoeDetail === undefined && <span className='text-danger'>Sản phẩm này không tồn tại!</span>}
                                {shoeDetail != null | shoeDetail != undefined ? <p className='text-secondary'>Số lượng hiện có: {shoeDetail?.quantity}</p> : ''}
                                <Form onFinish={handleChoose}>
                                    <Row gutter={10}>
                                        <Col xl={12}>
                                            <Form.Item initialValue={1} name={"quantity"} rules={[{ validator: (rule, value) => { if (value > shoeDetail?.quantity) { return Promise.reject(`Số lượng không được lớn hơn ${shoeDetail?.quantity}`); } return Promise.resolve(); }, },]}>
                                                <Input type='number' className='text-center' />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={12}>
                                            <Button htmlType='submit' type='primary' className='bg-warning w-100' icon={<i className='fas fa-cart-plus'></i>}>Thêm vào giỏ hàng</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default ChooseProductModal