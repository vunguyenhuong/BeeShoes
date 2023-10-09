import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import DetailAddress from "~/components/DetailAddress";
import FormatCurrency from "~/utils/FormatCurrency";

function InfoBill({ props }) {

  return (
    <>
      <div className="mt-3">
        <Title level={5} className="text-uppercase bg-secondary-subtle p-2">Thông tin đơn hàng</Title>
        <Row gutter={24} className="fw-semibold">
          <Col xl={8}>
            <ul className="list-unstyled">
              <li className="mb-2">Trạng thái: <span className="float-end text-danger">{props.status === 0 ? " Chờ thanh toán" : props.status === 1 ? " Tạo đơn hàng" : props.status === 2 ? " Chờ xác nhận" : props.status === 3 ? " Xác nhận thông tin thanh toán" : props.status === 4 ? " Chờ giao" : props.status === 5 ? " Đang giao" : props.status === 6 ? " Hoàn thành" : props.status === 7 ? " Hủy" : " Tạo đơn hàng"}</span></li>
              <li className="mb-2">Loại đơn hàng: <span className="float-end text-danger">{props.type === 0 ? " Tại quầy" : " Giao hàng"}</span></li>
              <li className="mb-2">Tổng tiền: <span className="float-end text-danger"><FormatCurrency value={props.totalMoney} /></span></li>
            </ul>
          </Col>
          <Col xl={8}>
            <ul className="list-unstyled">
              <li className="mb-2">Mã đơn hàng: <span className="float-end text-danger">#{props.code}</span></li>
              <li className="mb-2">Khách hàng: <span className="float-end text-danger">{props.customerName === null ? "Khách hàng lẻ" : props.customerName}</span></li>
              {props.type === 1 && (
                <li className="mb-2">Phí vận chuyển: <span className="float-end text-danger"><FormatCurrency value={props.moneyShip} /></span></li>
              )}
            </ul>
          </Col>
          <Col xl={8}>
            <ul className="list-unstyled">
              <li className="mb-2">Số điện thoại: <span className="float-end text-danger">{props.phoneNumber === null ? "Không có" : props.phoneNumber}</span></li>
              <li className="mb-2">Địa chỉ: <span className="float-end text-danger">{props.address === null ? "Không có" : props.address}</span></li>
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default InfoBill;
