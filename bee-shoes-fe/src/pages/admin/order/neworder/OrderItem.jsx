import { Alert, Button, Carousel, Col, Divider, Empty, Form, Input, Modal, Row, Switch, Table, Tooltip, } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import GHNInfo from "~/components/GhnInfo";
import QrCode from "~/components/QrCode";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";
import CustomerInfo from "./CustomerInfo";
import ChooseAddress from "./ChooseAddress";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import ShowProductModal from "./ShowProductModal";
import Loading from "~/components/Loading/Loading";
import ChooseVoucher from "./ChooseVoucher";

function OrderItem({ index, props, onSuccess }) {
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [typeOrder, setTypeOrder] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const [feeShip, setFeeShip] = useState(0);
  const [note, setNote] = useState("");
  const [waitPay, setWaitPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [extraMoney, setExtraMoney] = useState(null);

  const [totalMoney, setTotalMoney] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [tienKhachDua, setTienKhachDua] = useState(0);

  const [voucher, setVoucher] = useState(null);
  const [moneyReduce, setMoneyReduce] = useState(0);


  useEffect(() => {
    loadListOrderDetail();
  }, [props, currentPage, pageSize])

  const onSelect = (value) => {
    request.post('/bill-detail', {
      bill: props.id,
      shoeDetail: value,
      quantity: 1,
    }).then(response => {
      toast.success('Thêm thành công!');
      loadListOrderDetail();
    }).catch(e => {
      console.log(e);
    })
  };

  const loadListOrderDetail = async () => {
    setLoading(true);
    await request.get(`/bill-detail`, {
      params: {
        bill: props.id,
        page: currentPage,
        sizePage: pageSize,
      }
    }).then((response) => {
      setListOrderDetail(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    })
      .catch((e) => {
        console.log(e);
      });

    await request.get(`/bill-detail`, {
      params: {
        bill: props.id,
        page: 1,
        sizePage: 1_000_000,
      }
    }).then((response) => {
      const calculatedTotalMoney = response.data.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
      setTotalMoney(calculatedTotalMoney);
      setLoading(false);
    })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCustomer = async (id) => {
    setCustomer(await request.get(`/customer/${id}`));
    const dataAddress = await request.get(`/address/${id}`);
    setListAddress(dataAddress.content);
    console.log(dataAddress.content);
    setAutoFillAddress(
      dataAddress.content.find((item) => item.defaultAddress === true) || dataAddress.content[0]
    );
  };
  const handleSelectCustomer = (value) => {
    getCustomer(value);
  };
  const handleDeleteCustomer = () => {
    setCustomer(null);
    setAutoFillAddress([]);
    setTypeOrder(0);
  };
  useEffect(() => {
    if (autoFillAddress !== null) {
      caculateFee();
    }
  }, [autoFillAddress]);

  const caculateFee = async () => {
    await request
      .post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: 53320,
          service_type_id: null,
          to_district_id: parseInt(autoFillAddress.district),
          to_ward_code: autoFillAddress.ward,
          height: 50,
          length: 20,
          weight: 200,
          width: 20,
          cod_failed_amount: 2000,
          insurance_value: 10000,
          coupon: null,
        },
        {
          headers: {
            Token: "aef361b5-f26a-11ed-bc91-ba0234fcde32",
            "Content-Type": "application/json",
            ShopId: 124173,
          },
        }
      )
      .then((response) => {
        setFeeShip(response.data.data.total);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (voucher !== null) {
      if (totalMoney < voucher.minBillValue) {
        toast.error("Không đủ điều kiện!")
        setVoucher(null);
      } else {
        toast.success("Áp dụng thành công!")
        setMoneyReduce(totalMoney / 100 * voucher?.percentReduce);
      }
    }
  }, [voucher])

  const handleChangeQuantity = (id, quantity) => {
    request.get(`/bill-detail/update-quantity/${id}`, {
      params: {
        newQuantity: quantity
      }
    }).then(response => {
      toast.success("Cập nhật thành công!");
      loadListOrderDetail();
    }).catch(e => {
      console.log(e);
      toast.error(e.response.data);
    })
  }

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
          loadListOrderDetail();
        }).catch(e => {
          console.log(e);
          toast.error(e.response.data);
        })
      },
    });
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
                <img src={image} alt="images" style={{ width: "150px", height: "150px" }} className="object-fit-contain" />
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
        <Form key={record.id}>
          <Form.Item initialValue={quantity} name={"quantity"} className="m-0 p-0">
            <Input className="text-center" type="number" style={{ width: "64px" }} onPressEnter={(e) => handleChangeQuantity(record.id, e.target.value)} />
          </Form.Item>
        </Form>
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
          <Tooltip placement="top" title="Xóa">
            <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger me-1"><i className="fas fa-trash"></i></Button>
          </Tooltip>
        </>
      )
    },
  ]

  const handleCreate = () => {
    const data = {};
    data.voucher = voucher === null ? null : voucher.id;
    data.customer = customer === null ? null : customer.id;
    data.type = typeOrder;
    data.customerName = customer !== null ? customer?.name : "Khách hàng lẻ";
    data.totalMoney = totalMoney;
    data.moneyReduce = moneyReduce;
    data.note = note;
    data.paymentMethod = paymentMethod;
    if (listOrderDetail.length === 0) {
      toast.error("Hãy thêm gì đó vào giỏ hàng!");
    } else {
      if (waitPay) {
        data.status = 0;
        request.put(`/bill/${props.id}`, data).then(response => {
          toast.success("Đơn hàng đã chuyển sang trạng thái chờ thanh toán!");
          onSuccess();
        }).catch(e => {
          console.log(e);
        })
      } else {
        if (typeOrder === 0) {
          if (extraMoney !== null && extraMoney >= 0) {
            data.status = 6;
            Modal.confirm({
              title: "Xác nhận",
              maskClosable: true,
              content: "Xác nhận thêm khách hàng ?",
              okText: "Ok",
              cancelText: "Cancel",
              onOk: () => {
                request.put(`/bill/${props.id}`, data).then(response => {
                  toast.success("Tạo đơn hàng thành công!");
                  onSuccess();
                }).catch(e => {
                  console.log(e);
                })
              },
            });
          } else {
            toast.error("Vui lòng nhập đủ tiền khách đưa!");
            return;
          }
        } else {
          data.phoneNumber = autoFillAddress.phoneNumber;
          data.address = typeOrder === 0 ? null : `${autoFillAddress.specificAddress}##${autoFillAddress.ward}##${autoFillAddress.district}##${autoFillAddress.province}`;
          data.moneyShip = feeShip;
          data.status = 2;
          Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: "Xác nhận thêm khách hàng ?",
            okText: "Ok",
            cancelText: "Cancel",
            onOk: () => {
              console.log(data.customer);
              request.put(`/bill/${props.id}`, data).then(response => {
                toast.success("Tạo đơn hàng thành công!");
                onSuccess();
              }).catch(e => {
                console.log(e);
              })
            },
          });
        }
      }
    }
  }

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1">
          <Title level={5}>Đơn hàng {props.code}</Title>
        </div>
        <div className="me-1">
          <ShowProductModal idBill={props.id} onClose={() => { loadListOrderDetail() }} />
        </div>
        <div className="">
          <QrCode title={"QR Code sản phẩm"} onQrSuccess={onSelect} />
        </div>
      </div>
      <div style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }} className="my-3 p-2">
        <Title level={5}>Giỏ hàng</Title>
        {listOrderDetail.length === 0 ? <Empty description={"Chưa có sản phẩm"} className="py-5" /> : (
          <>
            {loading ? <Loading /> : <Table dataSource={listOrderDetail} columns={columns} className="mt-3"
              loading={loading}
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
          </>
        )}

      </div>
      <div style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }} className="my-3 p-2">
        <div className="d-flex mb-2">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin khách hàng</Title>
          </div>
          {customer !== null && <Button className="me-1 " type="text" onClick={() => handleDeleteCustomer()}>
            {customer?.name}
            <Tooltip title="Loại bỏ khách hàng">
              <i className="ms-1 fas fa-circle-xmark text-danger"></i>
            </Tooltip>
          </Button>}
          <div className="">
            <CustomerInfo handleSelect={handleSelectCustomer} />
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">Tên khách hàng: <span className="float-end fw-semibold">{customer === null ? 'Khách hàng lẻ' : customer?.name}</span></li>
              {customer !== null && (
                <>
                  <li className="mb-2">Email: <span className="float-end fw-semibold">{customer?.email}</span></li>
                  <li className="mb-2">Số điện thoại: <span className="float-end fw-semibold">{customer?.phoneNumber}</span></li>
                </>
              )}
            </ul>
          </Col>
        </Row>
      </div>
      <div style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }} className="my-3 p-2 mt-4">
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin thanh toán</Title>
          </div>
          <div className="">
            {customer !== null && typeOrder === 1 && (
              <ChooseAddress
                idCustomer={customer.id}
                onSuccess={(address) => setAutoFillAddress(address)}
              />
            )}
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={14}>
            {typeOrder === 0 ? <img src="https://www.lucepictor.com/wp-content/uploads/2017/05/running-shoes-on-white-background-1920x1280.jpg.webp" width={"100%"} alt="" /> : (
              <>
                <Form layout="vertical" initialValues={{
                  name: autoFillAddress.name,
                  phoneNumber: autoFillAddress.phoneNumber,
                  specificAddress: autoFillAddress.specificAddress
                }} onFinish={(data) => console.log(data)}>
                  <Row gutter={10}>
                    <Col xl={12}>
                      <Form.Item label="Họ và tên" required name={"name"}>
                        <Input placeholder="Nhập họ và tên..." />
                      </Form.Item>
                    </Col>
                    <Col xl={12}>
                      <Form.Item label="Số điện thoại" required name={"phoneNumber"}>
                        <Input placeholder="Nhập số điện thoại..." />
                      </Form.Item>
                    </Col>
                    <GHNInfo distr={autoFillAddress.district} prov={autoFillAddress.province} war={autoFillAddress.ward} />
                    <Col xl={16}>
                      <Form.Item label="Địa chỉ cụ thể" name={"specificAddress"}>
                        <Input placeholder="Nhập địa chỉ cụ thể ..." />
                      </Form.Item>
                    </Col>
                    <Col xl={8}>
                      <img
                        src="https://donhang.ghn.vn/static/media/Giao_Hang_Nhanh_Toan_Quoc_color.b7d18fe5.png"
                        alt=""
                        width={"100%"}
                      />
                    </Col>
                  </Row>
                </Form>
              </>
            )}
          </Col>
          <Col xl={10} md={24}>
            <ul className="list-unstyled">
              <li className="mb-2">
                {customer !== null && <><Switch onChange={(value) => {
                  setTypeOrder(value ? 1 : 0)
                }} /> Giao hàng</>}
              </li>
              <Row gutter={10}>
                <ChooseVoucher onSelectVoucher={(voucher) => setVoucher(voucher)} />
              </Row>
              <li className="mb-2">Tạm tính: <span className="float-end fw-semibold"><FormatCurrency value={totalMoney} /></span></li>
              {typeOrder === 1 && <li className="mb-2">Phí vận chuyển: <span className="float-end fw-semibold"><FormatCurrency value={feeShip} /></span></li>}
              <li className="mb-2">Giảm giá: <span className="float-end fw-semibold"><FormatCurrency value={moneyReduce} /></span></li>
              {voucher !== null && (
                <li className="mb-2">
                  <Tooltip>
                    <Alert message={
                      <>
                        Áp dụng thành công Voucher "{voucher?.name}"
                        <span className="float-end text-danger" onClick={() => {
                          setVoucher(null);
                          setMoneyReduce(0);
                        }}>
                          <Tooltip title="Bỏ chọn Voucher" >
                            <i className="fas fa-xmark-circle"></i>
                          </Tooltip>
                        </span>

                      </>}
                      type="success" />
                  </Tooltip>
                </li>
              )}
              <li className="mb-2">Tổng tiền: <span className="float-end fw-semibold text-danger"><FormatCurrency value={totalMoney - moneyReduce + (typeOrder === 1 ? feeShip : 0)} /></span></li>
              {typeOrder === 0 && (
                <>
                  <li className="mb-2">
                    <Input placeholder="Nhập tiền khách đưa..." onChange={(e) => { setExtraMoney(e.target.value - totalMoney + moneyReduce); setTienKhachDua(e.target.value) }} className="mb-2" />
                    {totalMoney > 0 && <Alert message={tienKhachDua < totalMoney - moneyReduce ? "Vui lòng nhập đủ tiền khách đưa!" : "Khách đã đưa đủ tiền!"} type={tienKhachDua < totalMoney - moneyReduce ? "error" : "success"} />}
                  </li>
                  <li className="mb-2">
                    Tiền thừa: <span className="float-end fw-semibold text-danger"><FormatCurrency value={extraMoney < 0 || extraMoney === null ? 0 : extraMoney} /></span>
                  </li>
                </>
              )}
              <li className="mb-2 text-center">
                <Row gutter={10}>
                  <Col xl={12} onClick={() => setPaymentMethod(0)}>
                    <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${paymentMethod === 1 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                      <i className="fa-solid fa-coins" style={{ fontSize: "36px" }}></i>
                      <span className="ms-2 fw-semibold text-dark">Tiền mặt</span>
                    </div>
                  </Col>
                  <Col xl={12} onClick={() => setPaymentMethod(1)}>
                    <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${paymentMethod === 0 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                      <i class="fa-regular fa-credit-card" style={{ fontSize: "36px" }}></i>
                      <span className="ms-2 fw-semibold text-dark">Chuyển khoản</span>
                    </div>
                  </Col>
                </Row>
              </li>
              <li className="mb-2">
                <TextArea placeholder="Nhập ghi chú..." onChange={(e) => setNote(e.target.value)} />
              </li>
              <li className="mb-2 float-end">
                <Switch onChange={(value) => setWaitPay(value)} /> Chờ thanh toán
              </li>
              <li>
                <Button type="primary" className="bg-warning text-dark w-100" onClick={() => handleCreate()}>Tạo hóa đơn</Button>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default OrderItem;
