import { Col, Divider, Row } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import DetailAddress from "~/components/DetailAddress";
import FormatCurrency from "~/utils/FormatCurrency";
import ChangeInfoBill from "./ChangeInfoBill";

function InfoBill({ props, onSuccess }) {

  return (
    <>
      <div className="mt-3">
        <Title level={5} className="text-danger text-uppercase">Thông tin đơn hàng</Title>
        <Row gutter={24} className="fw-semibold">
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">Trạng thái: <span className="float-end text-danger">{props.status === 0 ? " Chờ thanh toán" : props.status === 1 ? " Tạo đơn hàng" : props.status === 2 ? " Chờ xác nhận" : props.status === 3 ? " Xác nhận thông tin thanh toán" : props.status === 4 ? " Chờ giao" : props.status === 5 ? " Đang giao" : props.status === 6 ? " Hoàn thành" : props.status === 7 ? " Hủy" : props.status === 8 ? " Trả hàng" : " "}</span></li>
              <li className="mb-2">Mã đơn hàng: <span className="float-end text-danger">{props?.code}</span></li>
              <li className="mb-2">Loại đơn hàng: <span className="float-end text-danger">{props.type === 0 ? " Tại quầy" : " Giao hàng"}</span></li>
            </ul>
          </Col>
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">Phí vận chuyển: <span className="float-end text-danger">{
                props.type === 1 ? <FormatCurrency value={props.moneyShip} /> : "Không có"
              }</span></li>
              <li className="mb-2">Tổng tiền: <span className="float-end text-danger"><FormatCurrency value={props.totalMoney} /></span></li>
              <li className="mb-2">Phải thanh toán: <span className="float-end text-danger"><FormatCurrency value={props.totalMoney + props.moneyShip} /></span></li>
            </ul>
          </Col>
          <Col xl={8}>

          </Col>
          {props.voucher !== null && (
            <Col xl={24}>
              <ul className="list-unstyled">
                <li className="mb-2">
                  Mã giảm giá: <span className="text-danger">({props?.voucher?.code})</span> {props.voucher?.name} - giảm <span className="text-danger">{props.voucher?.percentReduce} %</span> cho đơn tối thiểu từ <span className="text-danger"><FormatCurrency value={props.voucher?.minBillValue} /></span>, đã giảm <span className="text-success"><FormatCurrency value={props.moneyReduce} /></span>
                </li>
              </ul>
            </Col>
          )}
        </Row>
      </div>
      <Divider />
      <div>
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5} className="text-danger text-uppercase">Thông tin khách hàng</Title>
          </div>
          <div className="">
            {props.status <= 4 ? (
              <ChangeInfoBill bill={props} onSuccess={() => {
                onSuccess()
              }} />
            ) : ""}
          </div>
        </div>
        <ul className="list-unstyled fw-semibold">
          <Row gutter={12}>
            <Col xl={12}>
              <li className="mb-2">Tên khách hàng: <span className="float-end text-danger">{props.customerName === null ? "Khách hàng lẻ" : props.customerName}</span></li>
              <li className="mb-2">Số điện thoại: <span className="float-end text-danger">{props.phoneNumber === null ? "Không có" : props.phoneNumber}</span></li>
            </Col>
            <Col xl={12}>
              <li className="mb-2">Email: <span className="float-end text-danger">{props.customer?.email === null | props.customer?.email === undefined ? "Không có" : props.customer?.email}</span></li>
              <li className="mb-2">Địa chỉ: <span className="float-end text-danger text-end" style={{ width: "24rem" }}>{props?.address !== null ? (
                <>
                  {props.address?.split("##")[0]} ,
                  <DetailAddress war={props.address?.split("##")[1]}
                    distr={props.address?.split("##")[2]}
                    prov={props.address?.split("##")[3]} />
                </>
              ) : "Tại cửa hàng"}</span></li>
            </Col>
          </Row>
        </ul>
      </div>
      <Divider />
    </>
  );
}

export default InfoBill;
