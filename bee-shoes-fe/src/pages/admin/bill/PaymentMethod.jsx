import { Button, Col, Form, Input, InputNumber, Modal, Row, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import FormatCurrency from "~/utils/FormatCurrency";
import FormatDate from "~/utils/FormatDate";
import formatCurrency from "~/utils/format";
import * as request from "~/utils/httpRequest";

function PaymentMethod({ bill, onSucess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [method, setMethod] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPaymentRefund, setTotalPaymentRefund] = useState(0);
  const [extraMoney, setExtraMoney] = useState(null);

  const [totalBillDetail, setTotalBillDetail] = useState(0);
  const [totalBillDetailRefund, setTotalBillDetailRefund] = useState(0);

  const [isRefund, setIsRefund] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    loadPaymentMethod();
  }, [bill])

  const loadPaymentMethod = () => {
    request.get(`/payment-method/${bill.id}`).then((response) => {
      setPaymentMethod(response);
      const caculateTotalPayment = response.filter(item => item.type === true).reduce((total, item) => {
        return total + item.totalMoney;
      }, 0);
      const caculateTotalPaymentRefund = response.filter(item => item.type === false).reduce((total, item) => {
        return total + item.totalMoney;
      }, 0);
      setTotalPaymentRefund(caculateTotalPaymentRefund);
      setTotalPayment(caculateTotalPayment)
    }).catch((error) => {
      console.error(error);
    });
    request.get(`/bill-detail`, {
      params: { bill: bill.id, page: 1, sizePage: 1_000_000, }
    }).then((response) => {
      const calculatedTotalMoney = response.data.filter(item => item.status === false).reduce((total, item) => {
        return total + item.quantity * (item.discountPercent !== null ? item.discountValue : item.price);
      }, 0);
      const calculatedTotalMoneyRefund = response.data.filter(item => item.status === true).reduce((total, item) => {
        return total + item.quantity * (item.discountPercent !== null ? item.discountValue : item.price);
      }, 0);
      setTotalBillDetailRefund(calculatedTotalMoneyRefund);
      setTotalBillDetail(calculatedTotalMoney);
    }).catch((e) => {
      console.log(e);
    });
    form.setFieldsValue({
      totalMoney: (totalBillDetailRefund !== totalPaymentRefund) ? (totalBillDetailRefund - totalPaymentRefund - bill.moneyReduce) : (bill.totalMoney + bill.moneyShip - totalPayment)
    })
  }

  const handleCreatePaymentMethod = (data) => {
    if (method === 1) {
      data.totalMoney = bill.totalMoney + bill.moneyShip - totalPayment
    }
    data.type = !isRefund
    data.method = method;
    data.bill = bill.id;
    request.post(`/payment-method`, data).then((response) => {
      loadPaymentMethod();
      onSucess();
      toast.success(`Đã thanh toán ${formatCurrency(data.totalMoney)}`);
      setIsModalOpen(false);
      form.resetFields();
    }).catch((error) => {
      console.error(error);
      toast.error(error.response.data);
    });
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (x) => (<FormatCurrency value={x} />)
    },
    {
      title: 'Thời gian',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (x) => (<FormatDate date={x} />)
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'tradingCode',
      key: 'tradingCode',
      render: (x, record) => (
        <>{x === null ? '---' : x}</>
      )
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      key: 'type',
      render: (x, record) => (
        <Tag color={x === true ? 'green' : 'red'} style={{ width: "100px" }} className="text-center">{x === true ? 'Thanh toán' : 'Hoàn trả'}</Tag>
      )
    },
    {
      title: 'Nhân viên xác nhận',
      dataIndex: 'createBy',
      key: 'createBy',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
  ]
  return (
    <>
      <div className="mt-3">
        <div className="d-flex align-items-center">
          <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">Lịch sử thanh toán</Title>
          <div className="p-2">
            {totalPayment < (bill.totalMoney + bill?.moneyShip) && (
              <>
                <Button type="primary" className='text-dark bg-warning' onClick={() => { setIsModalOpen(true); loadPaymentMethod() }}>Xác nhận thanh toán</Button>
              </>)}
            {totalBillDetailRefund - (bill.status === 8 ? bill.moneyReduce : 0) !== totalPaymentRefund && <Button type="primary" danger onClick={() => { setIsModalOpen(true); setIsRefund(true); loadPaymentMethod() }}>Hoàn tiền</Button>}
          </div>
        </div>

        <Modal title={`Xác nhận ${isRefund ? "hoàn tiền" : "thanh toán"}`} open={isModalOpen} onOk={() => { setIsModalOpen(false); setIsRefund(false) }} onCancel={() => { setIsModalOpen(false); setIsRefund(false) }} footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={() => form.submit()} type="primary">Thanh toán</Button>
          </>
        }>
          <Form layout="vertical" form={form} onFinish={handleCreatePaymentMethod}>
            {method === 0 ? (
              <Form.Item label={`Tiền ${isRefund ? "trả khách" : "khách đưa"}`} name="totalMoney" rules={[{ required: true, message: `Tiền ${isRefund ? "trả khách" : "khách đưa"} không được để trống!`, },]}>
                <InputNumber className='w-100 mb-2' formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} suffix="VNĐ" placeholder="Nhập tiền khách đưa..." onChange={(e) => { setExtraMoney(e - (bill.totalMoney + bill.moneyShip - totalPayment)); }} />
              </Form.Item>
            ) : (
              <Form.Item label="Mã giao dịch" name={"tradingCode"} rules={[{ required: true, message: "Mã giao dịch không được để trống!", },]}>
                <Input />
              </Form.Item>
            )}
            <Form.Item label="Ghi chú" name="note" rules={[{ required: true, message: "Ghi chú không được để trống!", },]}>
              <TextArea />
            </Form.Item>
            {!isRefund && (
              <Row gutter={10} className="mt-3">
                <Col xl={12} onClick={() => setMethod(0)}>
                  <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${method === 1 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                    <i className="fa-solid fa-coins" style={{ fontSize: "36px" }}></i>
                    <span className="ms-2 fw-semibold text-dark">Tiền mặt</span>
                  </div>
                </Col>
                <Col xl={12} onClick={() => setMethod(1)}>
                  <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${method === 0 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                    <i class="fa-regular fa-credit-card" style={{ fontSize: "36px" }}></i>
                    <span className="ms-2 fw-semibold text-dark">Chuyển khoản</span>
                  </div>
                </Col>
              </Row>
            )}
          </Form>
          {isRefund ? <>
            Cần phải trả lại khách: <span className=" float-end fw-semibold text-danger">
              <FormatCurrency value={totalBillDetailRefund - totalPaymentRefund - bill.moneyReduce} />
            </span>
          </> : (
            <div className="mt-3 fw-semibold ">
              Số tiền cần thanh toán: <span className=" float-end fw-semibold text-danger">
                <FormatCurrency value={bill.totalMoney + bill.moneyShip - totalPayment} />
              </span>
              <br />
              Tiền thừa trả khách: <span className=" float-end text-success">
                <FormatCurrency value={extraMoney < 0 ? 0 : extraMoney} />
              </span>
            </div>
          )}
        </Modal>

        <Table columns={columns} pagination={false} dataSource={paymentMethod} />
      </div>
    </>
  );
}

export default PaymentMethod;
