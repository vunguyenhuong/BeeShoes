import { Col, Row, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import TopSell from "./TopSell";
import ChartBillStatus from "./ChartBillStatus";
import * as request from "~/utils/httpRequest";

function Statistic() {
  const [totalBillMonth, setTotalBillMonth] = useState(0);
  const [totalBillAmoutMonth, setTotalBillAmoutMonth] = useState(0);
  const [totalBillDay, setTotalBillDay] = useState(0);
  const [totalBillAmountDay, setTotalBillAmoutDay] = useState(0);
  const [totalProductMonth, setTotalProductMonth] = useState(0);

  const loadData = () => {
    // tháng
    request
      .get(`statistical/month`)
      .then((response) => {
        const data = response.data[0];
        setTotalBillMonth(data.totalBill);
        setTotalBillAmoutMonth(formatCurrency(data.totalBillAmount));
        setTotalProductMonth(data.totalProduct);
      })
      .catch((error) => {});
    // ngày
    request
      .get(`statistical/day`)
      .then((response) => {
        const data = response.data[0];
        setTotalBillDay(data.totalBillToday);
        setTotalBillAmoutDay(formatCurrency(data.totalBillAmountToday));
      })
      .catch((error) => {});
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row gutter={16}>
        <Col xl={8}>
          <div
            className="bg-warning border px-2 pt-2"
            style={{ height: "150px", borderRadius: "10px" }}
          >
            <Title level={3}>Doanh số tháng này </Title>
            <Title level={3}>
              {totalBillMonth} đơn hàng / {totalBillAmoutMonth}
            </Title>
          </div>
        </Col>
        <Col xl={8}>
          <div
            className="bg-warning border px-2 pt-2"
            style={{ height: "150px", borderRadius: "10px" }}
          >
            <Title level={3}>Doanh số hôm nay</Title>
            <Title level={3}>
              {totalBillDay} đơn hàng / {totalBillAmountDay}
            </Title>
          </div>
        </Col>
        <Col xl={8}>
          <div
            className="bg-warning border px-2 pt-2"
            style={{ height: "150px", borderRadius: "10px" }}
          >
            <Title level={3}>Sản phẩm bán được trong tháng</Title>
            <Title level={3}>{totalProductMonth} sản phẩm</Title>
          </div>
        </Col>
      </Row>

      <Row className="mt-3" gutter={24}>
        <Col xl={12}>
          <TopSell />
        </Col>
        <Col xl={12}>
          <ChartBillStatus />
        </Col>
      </Row>
    </>
  );
}

export default Statistic;
