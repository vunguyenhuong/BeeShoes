import React from "react";
import { useState, useEffect } from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import {
  FaBug,
  FaEdit,
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
import { Button, Carousel, Divider, Empty, Form, Input, Modal, Radio, Space, Table, Tooltip, message } from "antd";
import PaymentMethod from "./PaymentMethod";
import BillHistory from "./BillHistory";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import ShowProductModal from "../order/neworder/ShowProductModal";
import Loading from "~/components/Loading/Loading";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);

  const [cancelBill, setCancelBill] = useState(false);

  const loadBill = async () => {
    await request.get(`/bill/${id}`).then((response) => {
      setBill(response);
    }).catch((error) => {
      console.error(error);
    });
    setLoading(false);
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
    }).catch((e) => {
      console.log(e);
    });
    setLoading1(false);
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

  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa khỏi giỏ hàng ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request.remove(`/bill-detail/${id}`).then(response => {
          toast.success("Xóa thành công!");
          loadBillDetail();
          loadBill();
          loadBillHistory();
        }).catch(e => {
          console.log(e);
          toast.error(e.response.data);
        })
      },
    });
  }

  const handleChangeQuantity = (id, quantity) => {
    request.get(`/bill-detail/update-quantity/${id}`, {
      params: {
        newQuantity: quantity
      }
    }).then(response => {
      loadBillDetail();
      loadBill();
      loadBillHistory();
    }).catch(e => {
      console.log(e);
      toast.error(e.response.data);
    })
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (isCancel) => {
    setCancelBill(isCancel);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelBill(false);
  };

  const handleSubmit = (data) => {
    request.get(`/bill/change-status/${bill.id}`, {
      params: {
        note: data.note,
        isCancel: cancelBill
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
            <li className="fw-semibold">
              {name}
            </li>
            <li><small>{record.shoeCode}</small></li>
            <li>Đơn giá:
              <span className="text-danger"><FormatCurrency value={record.price} /></span>
            </li>
          </ul>
        </>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <>
          {bill.status <= 4 ? (
            <Form key={record.id}>
              <Form.Item initialValue={quantity} name={"quantity"} className="m-0 p-0">
                <Input className="text-center" min={1} type="number" style={{ width: "64px" }} onChange={(e) => handleChangeQuantity(record.id, e.target.value)} />
              </Form.Item>
            </Form>
          ) : quantity}
        </>
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
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          {bill.status <= 4 ? (
            <>
              {
                listBillDetail.length > 1 && (
                  <>
                    <Tooltip placement="top" title="Xóa">
                      <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger me-1"><i className="fas fa-trash"></i></Button>
                    </Tooltip>
                  </>
                )
              }
            </>
          ) : ""}
        </>
      )
    },
  ]

  if (loading) {
    return <Loading />;
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
          <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
        </nav>
        <div className="container overflow-x-auto mb-3" >
          <Timeline minEvents={8} placeholder maxEvents={billHistory.length}>
            {billHistory.map((item, index) => (
              <TimelineEvent
                key={index}
                icon={
                  item.status === 0 ? FaRegFileAlt
                    : item.status === 1 ? FaRegFileAlt
                      : item.status === 2 ? MdOutlineConfirmationNumber
                        : item.status === 3 ? FaRegCalendar
                          : item.status === 4 ? FaRegCalendarCheck
                            : item.status === 5 ? FaTruck
                              : item.status === 6 ? GiConfirmed
                                : item.status === 7 ? FaBug
                                  : item.status === 500 ? FaEdit : ""
                }
                color={
                  item.status === 1 ? '#024FA0' :
                    item.status === 3 ? "#F2721E" :
                      item.status === 4 ? "#50B846" :
                        item.status === 500 ? "#FFBC05" :
                          item.status === 7 ? "#9C281C" : '#2DC255'
                }
                title={
                  <h6 className="mt-2">
                    {item.status === 1 ? "Tạo đơn hàng"
                      : item.status === 0 ? "Chờ thanh toán"
                        : item.status === 2 ? "Chờ xác nhận"
                          : item.status === 3 ? "Xác nhận thanh toán"
                            : item.status === 4 ? "Chờ giao"
                              : item.status === 5 ? "Đang giao"
                                : item.status === 6 ? "Hoàn thành"
                                  : item.status === 7 ? "Hủy"
                                    : item.status === 500 ? "Chỉnh sửa đơn hàng" : ""}
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
                  <Button type="primary" danger className="me-1" onClick={() => showModal(true)}>Hủy</Button>
                )}
                {bill.status === 7 ? '' : (
                  <Button type="primary" onClick={() => showModal(false)}>
                    Xác nhận
                  </Button>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className="">
            {bill.status !== 1 | bill.status !== 2 && (
              <Tooltip title="In hóa đơn">
                <Link className="px-2" target="blank" to={`/export-pdf/${bill.id}`}><Button type="primary" icon={<i class="fa-regular fa-file-lines"></i>}></Button></Link>
              </Tooltip>
            )}
            <BillHistory props={billHistory} />
          </div>
        </div>
        <Divider />
        {/* Thông tin đơn hàng */}
        <InfoBill props={bill} />
        {/* Lịch sử thanh toán */}
        <PaymentMethod bill={bill} onSucess={() => loadBillHistory()} />
        {/* Thông tin đơn hàng */}
        <div className="d-flex align-items-center mt-3 mb-2">
          <Title level={5} className="text-uppercase p-0 m-0 flex-grow-1 p-2">Sản phẩm</Title>
          {bill.status <= 4 ? (
            <ShowProductModal idBill={bill.id} onClose={() => { loadBillDetail(); loadBill() }} />
          ) : ''}
        </div>
        {loading1 ? <Loading /> : <Table dataSource={listBillDetail} columns={columns} className="mt-3"
          loading={loading1}
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
        }
      </BaseUI>
      <Modal title="Nhập ghi chú" open={isModalOpen} onCancel={handleCancel} footer={<Button form="formNote" type="primary" htmlType="submit">Xác nhận</Button>}>
        <p><span className="text-danger">*</span>Chọn mẫu tin nhắn:</p>
        <Radio.Group className="mb-3" onChange={(e) => { form.setFieldsValue({ note: e.target.value }) }}>
          <Space direction="vertical">
            <Radio value={'Đã xác nhận đơn hàng'}>Đã xác nhận đơn hàng</Radio>
            <Radio value={'Đã đưa hàng cho shipper'}>Đã đưa hàng cho shipper</Radio>
            <Radio value={'Đã xác nhận thông tin thanh toán'}>Đã xác nhận thông tin thanh toán</Radio>
            <Radio value={'Đơn hàng đã được giao thành công'}>Đơn hàng đã được giao thành công</Radio>
            <Radio value={'Đã hủy đơn hàng'}>Đã hủy đơn hàng</Radio>
            <Radio value={''}>Khác</Radio>
          </Space>
        </Radio.Group>
        <Form id="formNote" onFinish={(data) => handleSubmit(data)} form={form}>
          <Form.Item name={"note"} rules={[{ required: true, message: "Ghi chú không được để trống!" }]}>
            <TextArea placeholder="Nhập ghi chú..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BillDetail;
