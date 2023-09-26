import { AutoComplete, Button, Carousel, Col, Divider, Empty, Form, Input, Modal, Pagination, Row, Switch, Tooltip, message, } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import GHNInfo from "~/components/GhnInfo";
import QrCode from "~/components/QrCode";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";
import CustomerInfo from "./CustomerInfo";
import ChooseAddress from "./ChooseAddress";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import ShowProductModal from "./ShowProductModal";
import Loading from "~/components/Loading/Loading";

function OrderItem({ index, props, onSuccess }) {
  const [dataAddress, setDataAddress] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [typeOrder, setTypeOrder] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const [feeShip, setFeeShip] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [waitPay, setWaitPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [extraMoney, setExtraMoney] = useState(0);

  const [totalMoney, setTotalMoney] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);


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
      const calculatedTotalMoney = response.data.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
      setTotalMoney(calculatedTotalMoney);
      setTotalPages(response.totalPages);
      console.log(response.totalPages);
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
    setTypeOrder("0");
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
            {loading ? <Loading /> : listOrderDetail.map((item, index) => (
              <Form>
                <Divider />
                <Row gutter={10} className="d-flex align-items-center">
                  <Col xl={4}>
                    <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} className='w-100'>
                      {item.images.split(',').map((image, index) => (
                        <div className="" style={{ height: "150px" }}>
                          <img src={image} alt="images" style={{ width: "100%", height: "150px" }} className="object-fit-cover" />
                        </div>
                      ))}
                    </Carousel>
                  </Col>
                  <Col xl={8}>
                    <ul className="list-unstyled ">
                      <li className="fw-semibold">{item.name}</li>
                      <li><small>{item.shoeCode}</small></li>
                      <li>Đơn giá: <span className="text-danger"><FormatCurrency value={item.price} /></span></li>
                    </ul>
                  </Col>
                  <Col xl={2} className="text-center">
                    <Form.Item initialValue={item.quantity} name={"quantity"} className="m-0 p-0">
                      <Input className="text-center" type="number" />
                    </Form.Item>
                  </Col>
                  <Col xl={4} className="text-center text-danger fw-semibold">
                    <FormatCurrency value={item.price * item.quantity} />
                  </Col>
                  <Col xl={6} className="text-center">
                    <Tooltip placement="top" title="Cập nhật">
                      <Button type="text" className="text-warning me-1"><i className="fas fa-edit"></i></Button>
                    </Tooltip>
                    <Tooltip placement="top" title="Xóa">
                      <Button type="text" className="text-danger me-1"><i className="fas fa-trash"></i></Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Form>
            ))}
          </>
        )}
        <div className="text-center mt-3 mb-2">
          <Pagination
            pageSize={pageSize}
            current={currentPage}
            total={totalPages}
            showSizeChanger
            pageSizeOptions={[1,3,5,10]}
            showQuickJumper
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
          />
        </div>
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
          {customer === null && (
            <Col xl={12}>
              <li className="mb-2">Số điện thoại khách hàng: <span className="float-end fw-semibold"></span></li>
            </Col>
          )}
        </Row>
      </div>
      <div style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }} className="my-3 p-2 mt-4">
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin thanh toán</Title>
          </div>
          <div className="">
            {customer !== null && (
              <>
                <Button type="text" icon={<i className="fas fa-location-dot"></i>} className="text-success fw-semibold">Chọn địa chỉ</Button>
              </>
            )}
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={14}>
            {typeOrder === 0 ? <img src="https://www.lucepictor.com/wp-content/uploads/2017/05/running-shoes-on-white-background-1920x1280.jpg.webp" width={"100%"} alt="" /> : (
              <><Form layout="vertical">
                <Row gutter={10}>
                  <Col xl={12}>
                    <Form.Item label="Họ và tên" required>
                      <Input placeholder="Nhập họ và tên..." />
                    </Form.Item>
                  </Col>
                  <Col xl={12}>
                    <Form.Item label="Số điện thoại" required>
                      <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>
                  </Col>
                  <GHNInfo />
                  <Col xl={18}>
                    <Form.Item label="Địa chỉ cụ thể">
                      <Input placeholder="Nhập địa chỉ cụ thể ..." />
                    </Form.Item>
                  </Col>
                  <Col xl={6}>
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
          <Col xl={10}>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Switch onChange={(value) => setTypeOrder(value ? 1 : 0)} /> Giao hàng
              </li>
              <Row gutter={10}>
                <Col xl={15}><Input placeholder="Nhập mã giảm giá..." /></Col>
                <Col xl={9}><Button type="primary" className="w-100 bg-warning text-dark">Chọn mã giảm giá</Button></Col>
              </Row>
              <li className="mb-2">Tạm tính: <span className="float-end fw-semibold"><FormatCurrency value={totalMoney} /></span></li>
              {typeOrder === 1 && <li className="mb-2">Phí vận chuyển: <span className="float-end fw-semibold"><FormatCurrency value={47000} /></span></li>}
              <li className="mb-2">Giảm giá: <span className="float-end fw-semibold"><FormatCurrency value={0} /></span></li>
              <li className="mb-2">Tổng tiền: <span className="float-end fw-semibold text-danger"><FormatCurrency value={totalMoney} /></span></li>
              {typeOrder === 0 && (
                <>
                  <li className="mb-2">
                    <Input placeholder="Nhập tiền khách đưa..." thousandSeparator={true} onChange={(e) => setExtraMoney(e.target.value - totalMoney)} /></li>
                  <li className="mb-2">
                    Tiền thừa: <span className="float-end fw-semibold text-danger"><FormatCurrency value={extraMoney < 0 ? 0 : extraMoney} /></span>
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
                <TextArea placeholder="Nhập ghi chú..." />
              </li>
              <li className="mb-2 float-end">
                <Switch onChange={(value) => setWaitPay(value ? 1 : 0)} /> Chờ thanh toán
              </li>
              <li>
                <Button type="primary" className="bg-warning text-dark w-100">Tạo hóa đơn</Button>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default OrderItem;
