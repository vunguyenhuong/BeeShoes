import { QRCode } from 'antd';
import React from 'react';
import Barcode from 'react-barcode';
import Footer from '~/layouts/admin/Footer';
import "./ExportTest.css";
import * as request from "~/utils/httpRequest";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Loading from '~/components/Loading/Loading';
import FormatCurrency from '~/utils/FormatCurrency';
import FormatDate from '~/utils/FormatDate';
import DetailAddress from '~/components/DetailAddress';


function TemplateExportBill() {
    const { idBill } = useParams();
    const [billDetail, setBillDetail] = useState();
    const [bill, setBill] = useState();
    const [loading, setLoading] = useState(true);
    const loadBillDetail = async () => {
        await request.get(`/bill-detail`, {
            params: {
                bill: idBill,
                page: 1,
                sizePage: 1_000_000,
            }
        }).then((response) => {
            setBillDetail(response.data);
        }).catch((e) => {
            console.log(e);
        });

        await request.get(`/bill/${idBill}`).then((response) => {
            setBill(response);
            console.log(response);
        }).catch((e) => {
            console.log(e);
        });
        setLoading(false);
    };
    useEffect(() => {
        loadBillDetail();
    }, [])

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <div className="container-fluid mt-3 export-test" style={{ fontFamily: "TimesNewRoman", }}>
                <img src="/logo.png" className="center-image" alt="" />
                <div className="container-fluid border">
                    <div class="d-flex justify-content-between align-items-center">
                        <div className="">
                            <Barcode value={bill.code} fontSize={16} height={50} width={2} font="TimesNewRoman" />
                        </div>
                        <div className="text-center fw-semibold text-nowrap px-1">
                            <ul className="list-unstyled">
                                <li>HÓA ĐƠN BÁN HÀNG</li>
                                <li>BILL OF SALE</li>
                            </ul>
                        </div>
                        <div className="">
                            <ul className="list-unstyled text-end">
                                <li className='fw-semibold text-danger'>Sneaker BeeShoes Store</li>
                                <li>Địa chỉ: 66 Mễ Trì Hạ, Nam Từ Liêm, Hà Nội</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h3 className='text-center fw-semibold'>SNEAKER BEESHOES</h3>
                        <ul className="list-unstyled">
                            <li>Khách hàng: <span className='float-end'>{bill.customerName === null ? "Khách hàng lẻ" : bill.customerName}</span></li>
                            <li>Địa chỉ: <span className='float-end'>{bill?.address !== null ? (
                                <>
                                    {bill.address.split("##")[0]} ,
                                    <DetailAddress war={bill.address.split("##")[1]}
                                        distr={bill.address.split("##")[2]}
                                        prov={bill.address.split("##")[3]} />
                                </>
                            ) : "Tại cửa hàng"}</span></li>
                            <li>Ngày mua: <span className='float-end'><FormatDate date={bill.createAt} /></span></li>
                            <li>Nhân viên bán hàng: <span className='float-end'>{bill.updateBy}</span></li>
                        </ul>
                        <h6 className='fw-semibold  mt-3'>DANH SÁCH SẢN PHẨM KHÁCH HÀNG MUA</h6>
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped">
                                <thead className='table-secondary'>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billDetail.map((item, index) => (
                                        <tr class="">
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td><FormatCurrency value={item.discountValue === null ? item.price : item.discountValue} /></td>
                                            <td><FormatCurrency value={item.quantity * (item.discountValue === null ? item.price : item.discountValue)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {bill.voucher !== null && (
                            <>
                                <span className="text-danger"><span className='fw-bold'>*</span>({bill.voucher.code})</span> {bill.voucher.name} - giảm <span className="text-danger">{bill.voucher.percentReduce} %</span> cho đơn tối thiểu từ <span className="text-danger"><FormatCurrency value={bill.voucher.minBillValue} /></span>, đã giảm <span className="text-success"><FormatCurrency value={bill.moneyReduce} /></span>
                            </>
                        )}
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <ul className="list-unstyled">
                                    <li>Giảm giá: <span className='float-end fw-semibold'><FormatCurrency value={bill.moneyReduce} /></span></li>
                                    <li>Phí vận chuyển: <span className='float-end fw-semibold'><FormatCurrency value={bill.moneyShip} /></span></li>
                                    <li>Tổng tiền phải thanh toán: <span className='float-end fw-semibold text-danger'><FormatCurrency value={bill.totalMoney + bill.moneyShip} /></span></li>
                                    <li>Trạng thái đơn hàng:
                                        <span className='float-end fw-semibold'>
                                            {bill.status === 1 ? "Tạo đơn hàng"
                                                : bill.status === 2 ? "Chờ xác nhận"
                                                    : bill.status === 4 ? "Chờ giao"
                                                        : bill.status === 5 ? "Đang giao"
                                                            : bill.status === 6 ? "Hoàn thành"
                                                                : bill.status === 7 ? "Đã hủy"
                                                                    : bill.status === 8 ? "Trả hàng" : ""}
                                        </span></li>
                                </ul>
                            </div>
                            <div className="ms-3">
                                <QRCode value={bill.code} bordered={false} size={100} />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default TemplateExportBill
