import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import FormatCurrency from "~/utils/FormatCurrency";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function PaymentMethod({ bill, onSucess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [method, setMethod] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [extraMoney, setExtraMoney] = useState(null);

  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadPaymentMethod();
  }, [bill])

  const loadPaymentMethod = () => {
    request.get(`/payment-method/${bill.id}`).then((response) => {
      setPaymentMethod(response);
      const caculateTotalPayment = response.reduce((total, item) => {
        return total + item.totalMoney;
      }, 0);
      setTotalPayment(caculateTotalPayment)
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleCreatePaymentMethod = (data) => {
    data.method = method;
    data.bill = bill.id;
    request.post(`/payment-method`, data).then((response) => {
      loadPaymentMethod();
      onSucess();
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
      title: 'Phương thức thanh toán',
      dataIndex: 'method',
      key: 'method',
      render: (x, record) => (
        <>{x === 0 ? "Tiền mặt" : "Chuyển khoản"}</>
      )
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'tradingCode',
      key: 'tradingCode',
      render: (x, record) => (
        <>{x}</>
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
          <Title level={5} className="text-uppercase p-0 m-0 flex-grow-1 p-2">Lịch sử thanh toán</Title>
          <div className="p-2">
            {bill.status !== 7 ? (
              totalPayment < (bill.totalMoney + bill?.moneyShip) ? (
                <>
                  <Button type="primary" onClick={showModal}>Xác nhận thanh toán</Button>
                  <Modal
                    title="Xác nhận thanh toán"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={
                      <>
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button onClick={() => form.submit()} type="primary">Thanh toán</Button>
                      </>
                    }
                  >
                    <Form layout="vertical" form={form} onFinish={handleCreatePaymentMethod}>
                      {method === 0 ? (
                        <Form.Item label="Tiền khách đưa" name="totalMoney" rules={[{ required: true, message: "Tiền khách đưa không được để trống!", },]}>
                          <InputNumber
                            className='w-100 mb-2'
                            formatter={(value) =>
                              ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            controls={false}
                            min={0}
                            suffix="VNĐ"
                            placeholder="Nhập tiền khách đưa..."
                            onChange={(e) => { setExtraMoney(e - bill.totalMoney + bill.moneyShip - totalPayment); }}
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item label="Mã giao dịch" name={"tradingCode"} rules={[{ required: true, message: "Mã giao dịch không được để trống!", },]}>
                          <Input />
                        </Form.Item>
                      )}
                      <Form.Item label="Ghi chú" name="note" rules={[{ required: true, message: "Ghi chú không được để trống!", },]}>
                        <TextArea />
                      </Form.Item>
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
                    </Form>
                    <div className="mt-3 fw-semibold ">
                      Số tiền cần thanh toán: <span className=" float-end fw-semibold text-danger">
                        <FormatCurrency value={bill.totalMoney + bill.moneyShip - totalPayment} />
                      </span>
                      <br />
                      Tiền thừa trả khách: <span className=" float-end text-success">
                        <FormatCurrency value={extraMoney < 0 ? 0 : extraMoney} />
                      </span>
                    </div>
                  </Modal>
                </>
              ) : (
                <span className="text-success fw-semibold">Đơn hàng đã được thanh toán</span>
              )) : ""}
          </div>
        </div>
        <Table columns={columns} pagination={false} dataSource={paymentMethod} />
      </div>
    </>
  );
}

export default PaymentMethod;
