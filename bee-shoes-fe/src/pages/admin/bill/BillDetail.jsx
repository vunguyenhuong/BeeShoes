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
import { Button, Carousel, Divider, Empty, Form, Modal, Table, message } from "antd";
import PaymentMethod from "./PaymentMethod";
import BillHistory from "./BillHistory";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import ShowProductModal from "../order/neworder/ShowProductModal";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
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
  const loadBillDetail = async () => {
    await request.get(`/bill-detail`, {
      params: {
        bill: id,
        page: currentPage,
        sizePage: pageSize,
      }
    }).then((response) => {
      setListBillDetail(response.data);
      setTotalPages(response.totalPages);
    })
      .catch((e) => {
        console.log(e);
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
    loadBillHistory();
  }, [id]);

  useEffect(() => {
    loadBillDetail();
  }, [currentPage, pageSize])



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
      loadBillHistory();
      form.resetFields();
      toast.success("Đã cập nhật trạng thái đơn hàng!");
    }).catch((e) => {
      console.log(e);
      toast.error(e.response.data);
    });
    setIsModalOpen(false);
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: <i className="fas fa-image"></i>,
      dataIndex: 'images',
      key: 'images',
      render: (item) => (
        <>
          <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: "150px" }}>
            {item !== undefined && item.split(',').map((image, index) => (
              <div className="" style={{ height: "150px" }}>
                <img src={image} alt="images" style={{ width: "150px", height: "150px" }} className="object-fit-cover" />
              </div>
            ))}
          </Carousel>
        </>
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <>
          <ul className="list-unstyled ">
            <li className="fw-semibold">{name}</li>
            <li><small>{record.shoeCode}</small></li>
            <li>Đơn giá: <span className="text-danger"><FormatCurrency value={record.price} /></span></li>
          </ul>
        </>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <>{quantity}</>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'quantity',
      key: 'total',
      render: (quantity, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency value={record.price * record.quantity} />
        </div>
      )
    },
  ]

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
                {bill.status <= 4 && (
                  <Button type="primary" danger className="me-1">Hủy</Button>
                )}
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
        <Divider />
        {/* Thông tin đơn hàng */}
        <InfoBill props={bill} />
        {/* Lịch sử thanh toán */}
        <PaymentMethod bill={bill} />
        {/* Thông tin đơn hàng */}
        <div className="d-flex align-items-center mt-3 mb-2">
          <Title level={5} className="text-uppercase p-0 m-0 flex-grow-1 p-2">Sản phẩm</Title>
          <ShowProductModal idBill={bill.id} onClose={() => loadBillDetail()} />
        </div>
        <Table dataSource={listBillDetail} columns={columns}
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [3, 5, 10, 20,],
            showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }} />
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
