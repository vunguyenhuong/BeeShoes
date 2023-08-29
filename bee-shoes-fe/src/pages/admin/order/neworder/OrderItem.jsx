import {
  AutoComplete,
  Carousel,
  Empty,
  Input,
  Modal,
  Switch,
  message,
} from "antd";
import { options } from "numeral";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SelectField from "~/components/Admin/Product/SelectField";
import GHNInfo from "~/components/GhnInfo";
import QrCode from "~/components/QrCode";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";
import CustomerInfo from "./CustomerInfo";
import ChooseAddress from "./ChooseAddress";
import { useNavigate } from "react-router-dom";

function OrderItem({ index, props, onSuccess }) {
  const [dataAddress, setDataAddress] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [typeOrder, setTypeOrder] = useState("0");
  const [customer, setCustomer] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const [feeShip, setFeeShip] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [waitPay, setWaitPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("0");
  const [extraMoney, setExtraMoney] = useState(0);

  const [totalMoney, setTotalMoney] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadListOrderDetail();
  }, [props.id]);

  const handleSearch = (value) => {
    setSearchValue(value);
    // Gọi API để tìm kiếm sản phẩm dựa trên giá trị nhập vào
    loadProduct(value);
  };

  const loadProduct = (value) => {
    request
      .get("/shoe-detail/findByName", {
        params: {
          value: value,
        },
      })
      .then((response) => {
        setProductOptions(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onSelect = (value) => {
    request
      .post("/bill-detail", {
        codeShoeDetail: value,
        idBill: props.id,
      })
      .then((response) => {
        if (response.status === 201) {
          message.success("Thêm thành công!");
        } else if (response.status === 200) {
          message.success("Sản phẩm đã tồn tại, đã cập nhật số lượng!");
        }
        loadListOrderDetail();
      })
      .catch((e) => {
        if (e.response.status === 400) {
          message.error("Không tìm thấy sản phẩm!");
        }
        console.log(e);
      });
    console.log("Selected:", value);
    setSearchValue("");
  };

  const loadListOrderDetail = () => {
    request
      .get(`/bill/detail/${props.id}`)
      .then((response) => {
        setListOrderDetail(response);
        const calculatedTotalMoney = response.reduce((total, item) => {
          return total + item.quantity * item.price;
        }, 0);

        setTotalMoney(calculatedTotalMoney);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận xóa?`,
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        request
          .remove(`/bill-detail/${id}`)
          .then((response) => {
            console.log(response);
            message.success("Xóa thành công!");
            loadListOrderDetail();
            loadProduct("");
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };

  const handleChangeQuantity = (item, id) => {
    const data = { ...item };
    function setQuantity(value) {
      data.quantity = value;
    }
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <Input
          placeholder="Nhập số lượng mới"
          onChange={(e) => setQuantity(e.target.value)}
        />
      ),
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .put(`/bill-detail/${id}`, data)
          .then((response) => {
            if (response.status === 200) {
              message.success("Cập nhật số lượng thành công!");
            } else if (response.status === 202) {
              message.success("Đã xóa sản phẩm khỏi đơn hàng!");
            }
            loadListOrderDetail();
            loadProduct("");
          })
          .catch((e) => {
            if (e.response.status === 411) {
              message.error("Vui lòng nhập số lượng hợp lệ!");
            }
          });
      },
    });
  };

  const changeTypeOrder = (e) => {
    const value = e.target.value;
    if (value === "0") {
      setFeeShip(0);
    } else {
      caculateFee();
    }
    setTypeOrder(value);
  };

  const handleChangeAddress = (item) => {
    setAutoFillAddress(item);
    message.success("Đã cập nhật địa chỉ mới!");
  };

  const getCustomer = async (id) => {
    setCustomer(await request.get(`/customer/${id}`));
    const dataAddress = await request.get(`/address/${id}`);
    setListAddress(dataAddress);
    setAutoFillAddress(
      dataAddress.find((item) => item.defaultAddress === true) || dataAddress[0]
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
  const handleCreateBill = () => {
    const data = { ...props };
    data.type = typeOrder;
    data.customer = customer;
    data.phoneNumber = customer === null ? phoneNumber : customer?.phoneNumber;
    if (customer !== null && typeOrder === "1") {
      data.moneyShip = feeShip;
      data.address =
        autoFillAddress.specificAddress +
        "." +
        autoFillAddress.ward +
        "." +
        autoFillAddress.district +
        "." +
        autoFillAddress.province;
    }
    data.totalMoney = totalMoney;
    data.waitPay = waitPay;
    data.note = note;
    data.paymentMethod = paymentMethod;
    console.log(data);
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận tạo đơn hàng?`,
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        request
          .put(`/bill/${data.id}`, data)
          .then((response) => {
            if (response.status === 200) {
              message.success("Tạo đơn hàng thành công!");
              onSuccess();
              navigate(`/admin/bill/${response.data.id}`);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };
  const handleSetWaitPay = (checked) => {
    setWaitPay(checked);
  };

  return (
    <>
      <div className="d-flex mb-2">
        <div className="flex-grow-1">
          <h6>Đơn hàng {props.code}</h6>
        </div>
        <div className="">
          <QrCode title={"QR Code sản phẩm"} onQrSuccess={onSelect} />
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6">
          <h6 className="text-center">Thông tin khách hàng</h6>
          <div className="row">
            <div class="col-xl-6 mb-2">
              <CustomerInfo handleSelect={handleSelectCustomer} />
            </div>
            <div class="col-xl-6 mb-2">
              <label for="" class="form-label">
                <span className="me-3">Khách hàng</span>{" "}
                {customer !== null && typeOrder === "1" && (
                  <ChooseAddress
                    props={listAddress}
                    handleChooe={handleChangeAddress}
                  />
                )}
              </label>
              <div className="bg-secondary-subtle py-1 rounded">
                {customer === null ? (
                  <span className="fw-semibold mx-2">Khách lẻ</span>
                ) : (
                  <>
                    <span className="bg-secondary-subtle mx-2">
                      {customer.name}
                    </span>
                    <i
                      className="fas fa-circle-xmark text-danger"
                      onClick={() => handleDeleteCustomer()}
                    ></i>
                  </>
                )}
              </div>
            </div>

            <div class="col-xl-6 mb-2">
              <label for="" class="form-label">
                Người bán
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                defaultValue={props.account.name}
                readOnly
              />
            </div>
            <div class="col-xl-6 mb-2">
              <label for="" class="form-label">
                Số điện thoại
              </label>
              {customer !== null ? (
                <input
                  type="text"
                  class="form-control form-control-sm"
                  value={
                    autoFillAddress?.phoneNumber || customer?.phoneNumber || ""
                  }
                />
              ) : (
                <>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Số điện thoại khách hàng..."
                    onChange={(event) => setPhoneNumber(event.target.value)}
                  />
                </>
              )}
            </div>
            <div className="col-xl-6 mb-2">
              <label for="" class="form-label">
                Mã đơn hàng
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                value={props.code}
                readOnly
              />
            </div>
            <div className="col-xl-6 mb-2">
              <label for="" class="form-label">
                Tổng tiền sản phẩm
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                value={totalMoney}
              />
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Hình thức mua hàng</label>
              <select
                class="form-select form-select-sm"
                onChange={(event) => changeTypeOrder(event)}
              >
                <option selected value={0}>
                  Tại cửa hàng
                </option>
                {customer !== null ? (
                  <>
                    <option value={1}>Online</option>
                  </>
                ) : (
                  ""
                )}
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Hình thức thanh toán</label>
              <select
                class="form-select form-select-sm"
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option selected value={0}>
                  Tiền mặt
                </option>
                <option value={1}>Chuyển khoản</option>
              </select>
            </div>
            {typeOrder === "1" && (
              <>
                <GHNInfo
                  dataAddress={setDataAddress}
                  distr={autoFillAddress.district}
                  prov={autoFillAddress.province}
                  war={autoFillAddress.ward}
                />
                <div className="row align-middle">
                  <div className="col-xl-8 mb-3">
                    <label htmlFor="" className="form-label">
                      Địa chỉ cụ thể
                    </label>
                    <textarea
                      className="form-control"
                      value={
                        autoFillAddress.length !== 0
                          ? autoFillAddress.specificAddress
                          : ""
                      }
                    ></textarea>
                  </div>
                  <div className="col-xl-4 mb-3">
                    <img
                      src="https://donhang.ghn.vn/static/media/Giao_Hang_Nhanh_Toan_Quoc_color.b7d18fe5.png"
                      alt=""
                      width={"100%"}
                    />
                  </div>
                </div>
                <div className="col-xl-12 mb-2">
                  <label for="" class="form-label">
                    Phí ship
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm text-danger"
                    value={feeShip}
                  />
                </div>
              </>
            )}
            <div className="mb-3 col-xl-6">
              <Switch
                defaultChecked={false}
                onChange={handleSetWaitPay}
                size="small"
                className="me-2"
              />
              Chờ thanh toán
            </div>
            <div className="mb-3 col-xl-6 fw-semibold">
              Phải trả:{" "}
              <span className="text-danger">
                <FormatCurrency value={totalMoney + (typeOrder === "1" ? feeShip : 0)} />
              </span>
            </div>
            {typeOrder === "0" ? (
              <>
                <div className="col-xl-6 mb-2">
                  <label for="" class="form-label">
                    Tiền khách đưa
                  </label>
                  <input type="text" class="form-control form-control-sm" 
                  onChange={(event) => setExtraMoney(event.target.value - totalMoney)}/>
                </div>
                <div className="col-xl-6 mb-2">
                  <label for="" class="form-label">
                    Tiền thừa
                  </label>
                  <input type="text" class="form-control form-control-sm" value={extraMoney}/>
                </div>
              </>
            ) : (
              ""
            )}
            <div class="mb-3">
              <label for="" class="form-label">
                Ghi chú
              </label>
              <textarea
                class="form-control"
                placeholder="Nhập ghi chú ..."
                rows="2"
                onChange={(event) => setNote(event.target.value)}
              ></textarea>
            </div>
            <div className="col-xl-12">
              <button
                type="button"
                class="w-100 btn btn-warning btn-sm"
                onClick={() => handleCreateBill()}
              >
                Tạo hóa đơn
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-6 border-start">
          <AutoComplete
            value={searchValue}
            onChange={handleSearch}
            onSelect={onSelect}
            className="w-100"
            options={productOptions.map((product) => ({
              value: product.shoeDetail.code,
              label: (
                <div className="row">
                  <div className="col-xl-3">
                    <Carousel
                      autoplay
                      autoplaySpeed={1500}
                      dots={false}
                      arrows={false}
                    >
                      {product.imagesList.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.name}
                            alt="images"
                            style={{ width: "100%", height: "100px" }}
                            className="object-fit-contain"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                  <div className="col-xl-9">
                    <span className="fw-semibold text-uppercase">
                      {product.shoeDetail.shoe.name} [
                      {product.shoeDetail.color.name} -{" "}
                      {product.shoeDetail.size.name}]
                    </span>
                    <div className="row">
                      <div className="col-xl-6">
                        <span>
                          Danh mục:{" "}
                          <span className="fw-semibold">
                            {product.shoeDetail.shoe.category.name}
                          </span>
                        </span>
                      </div>
                      <div className="col-xl-6">
                        <span>
                          Thương hiệu:{" "}
                          <span className="fw-semibold">
                            {product.shoeDetail.shoe.brand.name}
                          </span>
                        </span>
                      </div>
                      <div className="col-xl-6">
                        <span>
                          Đơn giá:{" "}
                          <span className="fw-semibold text-danger">
                            <FormatCurrency value={product.shoeDetail.price} />
                          </span>
                        </span>
                      </div>
                      <div className="col-xl-6">
                        <span>Số lượng: {product.shoeDetail.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            }))}
          >
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
          </AutoComplete>
          <div class="table-responsive mt-2">
            <table class="table table-sm table-striped text-nowrap align-middle">
              <thead>
                <tr>
                  <th scope="col" colSpan={2}>
                    #
                  </th>
                  <th scope="col">Sản phẩm</th>
                  <th scope="col">SL</th>
                  <th scope="col">Đơn giá</th>
                  <th scope="col" colSpan={2}>
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {listOrderDetail.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <Empty description={"Chưa có sản phẩm"} />
                    </td>
                  </tr>
                ) : (
                  listOrderDetail.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Carousel
                          autoplay
                          autoplaySpeed={1500}
                          dots={false}
                          arrows={false}
                          style={{ width: "80px", height: "80px" }}
                        >
                          {item.imagesList.map((image, index) => (
                            <div key={index}>
                              <img
                                src={image.name}
                                alt="images"
                                style={{ width: "80px", height: "80px" }}
                                className="object-fit-contain"
                              />
                            </div>
                          ))}
                        </Carousel>
                      </td>
                      <td className="text-wrap">
                        {item.shoeDetail.shoe.name} [
                        {item.shoeDetail.color.name} -{" "}
                        {item.shoeDetail.size.name}]
                      </td>
                      <td>
                        {item.quantity}
                        <small
                          className="ps-3"
                          onClick={() => handleChangeQuantity(item, item.id)}
                        >
                          <i class="fas fa-edit"></i>
                        </small>
                      </td>
                      <td>
                        <FormatCurrency value={item.price} />
                      </td>
                      <td className="text-success fw-semibold">
                        <FormatCurrency value={item.quantity * item.price} />
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-sm border-0"
                          onClick={() => handleDeleteBillDetail(item.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                <tr className="table-secondary">
                  <td colSpan={5} className="fw-semibold">
                    Tạm tính
                  </td>
                  <td colSpan={2} className="fw-bold text-danger">
                    <FormatCurrency value={totalMoney} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderItem;
