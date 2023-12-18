import React from "react";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { FaEdit, FaRegFileAlt, FaTruck, } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancelPresentation, MdOutlineChangeCircle, MdOutlineConfirmationNumber, MdPayment } from "react-icons/md";

import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import "./timeline.css";
import InfoBill from "./InfoBill";
import { Button, Carousel, Divider, Form, Input, InputNumber, Modal, Radio, Space, Table, Tooltip } from "antd";
import PaymentMethod from "./PaymentMethod";
import BillHistory from "./BillHistory";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import ShowProductModal from "../order/neworder/ShowProductModal";
import Loading from "~/components/Loading/Loading";
import GivebackAll from "./giveback/GivebackAll";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formGiveback] = Form.useForm();
  const [loading, setLoading] = useState(true);
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
      okText: "Xác nhận",
      cancelText: "Hủy",
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

  const handleChangeQuantity = (record, quantity) => {
    request.get(`/bill-detail/update-quantity/${record.id}`, {
      params: {
        newQuantity: quantity,
        price: record.status === true ? record.price : (record.discountValue === null ? record.shoePrice : record.discountValue)
      }
    }).then(response => {
      loadBillDetail();
      loadBill();
      loadBillHistory();
      toast.success("Cập nhật thành công!");
    }).catch(e => {
      console.log(e);
      toast.error(e.response.data);
    })
  }

  const handleGiveBack = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <>
          <Form layout="vertical" form={formGiveback} onFinish={async (data) => {
            data.billDetail = id;
            await request.post(`/bill/give-back`, data).then(response => {
              loadBillDetail();
              loadBill();
              loadBillHistory();
              toast.success("Trả hàng thành công!");
            }).catch(e => {
              console.log(e);
              toast.error(e.response.data);
            })
          }}>
            <Form.Item label="Số lượng" name={"quantity"} rules={[{ required: true, message: "Số lượng không được để trống!", },]}>
              <InputNumber placeholder="Nhập số lượng muốn trả hàng..." className="w-100" />
            </Form.Item>
            <Form.Item label="Lý do trả hàng" name={"note"} rules={[{ required: true, message: "Lý do trả hàng không được để trống!", },]}>
              <TextArea placeholder="Nhập lý do trả hàng..." />
            </Form.Item>
          </Form>
        </>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        formGiveback.submit()
      },
    });
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
                <Input className="text-center" min={1} type="number" style={{ width: "64px" }} onPressEnter={(e) => handleChangeQuantity(record, e.target.value)} />
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
          ) : bill.status === 6 ? (
            record.status === false ? (
              <>
                {bill.status === 7 || bill.status === 8 ? "" : (
                  <Tooltip placement="top" title="Trả hàng">
                    <Button onClick={() => handleGiveBack(id)} type="primary" danger icon={<i class="fa-solid fa-rotate-left"></i>}></Button>
                  </Tooltip>
                )}
              </>
            ) : ""
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
      <nav className="breadcrumb fw-semibold">
        <Link
          className="breadcrumb-item __bee-text text-decoration-none"
          to={"/admin/bill"}
        >
          Danh sách hóa đơn
        </Link>
        <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
      </nav>
      <div className="container overflow-x-auto mb-3">
        <Timeline minEvents={8} placeholder maxEvents={billHistory.length} style={{ height: "400px" }}>
          {billHistory.map((item, index) => (
            <TimelineEvent
              key={index}
              icon={
                item.status === 0 ? FaRegFileAlt
                  : item.status === 1 ? FaRegFileAlt
                    : item.status === 2 ? MdOutlineConfirmationNumber
                      : item.status === 3 ? MdPayment
                        : item.status === 4 ? FaTruck
                          : item.status === 5 ? FaTruckFast
                            : item.status === 6 ? GiConfirmed
                              : item.status === 7 ? MdOutlineCancelPresentation
                                : item.status === 8 ? MdOutlineChangeCircle
                                  : item.status === 500 ? FaEdit : ""
              }
              color={
                item.status === 1 ? '#024FA0' :
                  item.status === 3 ? "#F2721E" :
                    item.status === 4 ? "#50B846" :
                      item.status === 500 ? "#FFBC05" :
                        item.status === 7 ? "#9C281C"
                          : item.status === 8 ? "#7925C7" : '#2DC255'
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
                                  : item.status === 8 ? "Hoàn 1 phần"
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
              {bill.status === 7 || bill.status === 8 ? '' : (
                <Button type="primary" onClick={() => showModal(false)}>
                  {bill.status === 4 ? "Giao hàng" : bill.status === 5 ? "Hoàn thành" : "Xác nhận"}
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
      <InfoBill props={bill} onSuccess={() => { loadBill(); loadBillHistory() }} />
      {/* Lịch sử thanh toán */}
      <PaymentMethod bill={bill} onSucess={() => { loadBillHistory() }} />
      {/* Thông tin đơn hàng */}
      <div className="d-flex align-items-center mt-5 align-middle">
        <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">Danh sách sản phẩm</Title>
        {bill.status <= 4 ? (
          <ShowProductModal idBill={bill.id} onClose={() => { loadBillDetail(); loadBill(); loadBillHistory() }} />
        ) : bill.status === 6 ? (
          <>
            {bill.status === 7 || bill.status === 8 ? "" : (
              <GivebackAll bill={bill} onSuccess={() => { loadBillDetail(); loadBill(); loadBillHistory() }} />
            )}
          </>
        ) : ""}
      </div>
      <Table dataSource={listBillDetail} columns={columns}
        showHeader={false}
        rowClassName={(record) => (record.status === true ? "bg-danger-subtle" : "")}
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

      <Modal title="Nhập ghi chú" open={isModalOpen} onCancel={handleCancel} footer={<Button form="formNote" type="primary" htmlType="submit">Xác nhận</Button>}>
        <p><span className="text-danger">*</span>Chọn mẫu tin nhắn:</p>
        <Radio.Group className="mb-3" onChange={(e) => { form.setFieldsValue({ note: e.target.value }) }}>
          <Space direction="vertical">
            <Radio value={'Đã xác nhận đơn hàng'}>Đã xác nhận đơn hàng</Radio>
            <Radio value={'Đã bàn giao cho đơn vị vận chuyển'}>Đã bàn giao cho đơn vị vận chuyển</Radio>
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
