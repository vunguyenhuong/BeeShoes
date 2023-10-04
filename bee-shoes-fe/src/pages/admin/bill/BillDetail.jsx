import React from "react";
import { useState, useEffect } from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import {
  FaBug,
  FaRegCalendar,
  FaRegCalendarCheck,
  FaRegFileAlt,
  FaTruck,
} from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineConfirmationNumber } from "react-icons/md";

import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import "./timeline.css";
import InfoBill from "./InfoBill";
import { Button, Carousel, Empty, Form, Modal, message } from "antd";
import PaymentMethod from "./PaymentMethod";
import BillHistory from "./BillHistory";
import TextArea from "antd/es/input/TextArea";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();

  const loadBill = () => {
    request
      .get(`/bill/${id}`)
      .then((response) => {
        setBill(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const loadBillDetail = () => {
    request
      .get(`/bill/detail/${id}`)
      .then((response) => {
        setListBillDetail(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const loadPaymentMethod = () => {
    request
      .get(`/payment-method/${id}`)
      .then((response) => {
        setPaymentMethod(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const loadBillHistory = () => {
    request
      .get(`/bill-history/${id}`)
      .then((response) => {
        setBillHistory(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadBill();
    loadBillDetail();
    loadPaymentMethod();
    loadBillHistory();
  }, [id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    request.get(`/bill/change-status/${bill.id}`, {
      params: {
        note: data.note
      }
    }).then((response) => {
      loadBill();
      loadBillDetail();
      loadPaymentMethod();
      loadBillHistory();
      form.resetFields();
    }).catch((e) => {
      console.log(e);
    });
    setIsModalOpen(false);
  }

  return (
    <>
      <BaseUI>
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/bill"}
          >
            Danh sách hóa đơn
          </Link>
          <span className="breadcrumb-item">Hóa đơn #{bill.code}</span>
        </nav>
        <div className="container overflow-x-auto mb-3" >
          <Timeline minEvents={billHistory.length} placeholder>
            {billHistory.map((item, index) => (
              <TimelineEvent
                key={index}
                icon={
                  item.status === 0
                    ? FaRegFileAlt
                    : item.status === 1
                      ? FaRegFileAlt
                      : item.status === 2
                        ? MdOutlineConfirmationNumber
                        : item.status === 3
                          ? FaRegCalendar
                          : item.status === 4
                            ? FaRegCalendarCheck
                            : item.status === 5
                              ? FaTruck
                              : item.status === 6
                                ? GiConfirmed
                                : item.status === 7
                                  ? FaBug
                                  : FaBug
                }
                color="#2DC255"
                title={
                  <h6 className="mt-2">
                    {item.status === 1
                      ? "Tạo đơn hàng"
                      : item.status === 0
                        ? "Chờ thanh toán"
                        : item.status === 2
                          ? "Chờ xác nhận"
                          : item.status === 3
                            ? "Xác nhận thông tin thanh toán"
                            : item.status === 4
                              ? "Chờ giao"
                              : item.status === 5
                                ? "Đang giao"
                                : item.status === 6
                                  ? "Hoàn thành"
                                  : item.status === 7
                                    ? "Hủy"
                                    : ""}
                  </h6>
                }
                subtitle={
                  <>
                    {item.note}
                    <br />
                    <FormatDate date={item.createAt} />
                  </>
                }
              />
            ))}
          </Timeline>
        </div>
        <div className="d-flex">
          <div className="flex-grow-1">
            {bill.status !== 6 ? (
              <>
                <Button className="bg-danger text-white me-1">Hủy</Button>
                <Button type="primary" onClick={showModal}>
                  Xác nhận
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="">
            <BillHistory props={billHistory} />
          </div>
        </div>
        {/* Thông tin đơn hàng */}
        <InfoBill props={bill} />
        {/* Lịch sử thanh toán */}
        <div className="mt-3">
          <div className="d-flex bg-secondary-subtle p-2 pt-3">
            <div className="flex-grow-1">
              <h6 className="text-uppercase">LỊCH SỬ THANH TOÁN</h6>
            </div>
            <div className="">
              <PaymentMethod bill={bill} paymentMethod={paymentMethod} />
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th scope="col">Số tiền</th>
                  <th scope="col">Thời gian</th>
                  <th scope="col">Phương thức thanh toán</th>
                  <th scope="col">Ghi chú</th>
                  <th scope="col">Nhân viên xác nhận</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethod.length === 0 ? (
                  <td colSpan={5}>
                    <Empty description={"Chưa có lịch sử thanh toán"} />
                  </td>
                ) : (
                  paymentMethod.map((item, index) => (
                    <tr class="">
                      <td className="text-danger fw-semibold">
                        <FormatCurrency value={item.totalMoney} />
                      </td>
                      <td>
                        <FormatDate date={item.createAt} />
                      </td>
                      <td>{item.method === 0 ? "Tiền mặt" : "Chuyển khoản"}</td>
                      <td>
                        {item.note === null ? "Không có ghi chú" : item.note}
                      </td>
                      <td>{item.createBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Thông tin đơn hàng */}
        <div className="mt-3">
          <h6 className="text-uppercase bg-secondary-subtle p-3">sản phẩm</h6>
          <div class="table-responsive">
            <table class="table table-borderless align-middle">
              <thead>
                <th>#</th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Tạm tính</th>
              </thead>
              <tbody>
                {listBillDetail.map((item, index) => (
                  <tr class="" key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Carousel
                        autoplay
                        autoplaySpeed={1500}
                        dots={false}
                        arrows={false}
                        style={{ width: "150px", height: "150px" }}
                      >
                        {item.imagesList.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.name}
                              alt="images"
                              style={{ width: "150px", height: "150px" }}
                              className="object-fit-cover"
                            />
                          </div>
                        ))}
                      </Carousel>
                    </td>
                    <td>{`${item.shoeDetail.shoe.name} - [${item.shoeDetail.size.name} - ${item.shoeDetail.color.name}]`}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <FormatCurrency value={item.price} />
                    </td>
                    <td>
                      <FormatCurrency value={item.price * item.quantity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BaseUI>
      <Modal title="Nhập ghi chú" open={isModalOpen} onCancel={handleCancel} footer={<Button form="formNote" type="primary" htmlType="submit">Xác nhận</Button>}>
        <Form id="formNote" onFinish={handleSubmit} form={form}>
          <Form.Item name={"note"} rules={[{ required: true, message: "Ghi chú không được để trống!" }]}>
            <TextArea placeholder="Nhập ghi chú..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BillDetail;
