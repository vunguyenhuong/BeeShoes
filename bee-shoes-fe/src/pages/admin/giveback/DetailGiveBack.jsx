/* eslint-disable jsx-a11y/alt-text */
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";
import "./give-back.css";
import ModalQuantityGiveBack from "./modal/ModalQuantityGiveBack";

export default function DetailGiveBack() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const nav = useNavigate();
  const [bill, setBill] = useState(null);

  const loadDatabillInformation = () => {
    request
      .get(`bill/give-back-information`, {
        params: {
          codeBill: id,
        },
      })
      .then((response) => {
        setBill(response.data);
        console.log(response.data);
      })
      .catch((error) => {});
  };

  const loadDatabill = () => {
    request
      .get(`bill/give-back`, {
        params: {
          idBill: bill.idBill,
        },
      })
      .then((response) => {
        setDataProductBill(response.data);
        console.log(response.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    loadDatabillInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (bill != null) {
      loadDatabill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill]);

  const [dataProductBill, setDataProductBill] = useState([]);

  const [dataProductGiveBack, setDataProductGiveBack] = useState([]);

  const columnProductBill = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: "5%",
      dataIndex: "stt",
    },
    {
      title: "Tên sản phẩm",
      key: "nameProduct",
      align: "center",
      dataIndex: "nameProduct",
    },
    {
      title: "Màu Sắc",
      dataIndex: "codeColor",
      key: "codeColor",
      width: "8px",
      align: "center",
    },
    {
      title: "Số lượng",
      key: "quantity",
      align: "center",
      dataIndex: "quantity",
    },
    {
      title: "Giá tiền",
      key: "price",
      align: "center",
      dataIndex: "price",
      render: (_, record) => <span>{formatCurrency(record.price)}</span>,
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      align: "center",
      dataIndex: "totalPrice",
      render: (_, record) => (
        <span>{formatCurrency(totalMoneyProduct(record))}</span>
      ),
    },
    {
      title: "Trạng thái",
      key: "statusBillDetail",
      align: "center",
      dataIndex: "statusBillDetail",
      render: (text, record) => {
        const genderClass = record.statusBillDetail
          ? "trangthai-sd"
          : "trangthai-ksd";
        const isButtonDisabled = !record.statusBillDetail;

        return (
          <div>
            <button
              className={`gender ${genderClass}`}
              disabled={isButtonDisabled}
            >
              {record.statusBillDetail ? "Thành công" : "Hoàn hàng"}
            </button>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      width: "8%",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Tooltip title="Hoàn trả hàng">
            <Button
              type="primary"
              style={{ backgroundColor: "#20B2AA" }}
              onClick={() => handleModalQuantityGiveBack(record)}
              disabled={bill.statusBill !== "6"}
            >
              Trả
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const columnProductGiveBack = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      dataIndex: "stt",
      width: "8%",
    },
    {
      title: "Tên sản phẩm",
      key: "nameProduct",
      align: "center",
      dataIndex: "nameProduct",
      width: "8%",
    },
    {
      title: "Màu Sắc",
      dataIndex: "codeColor",
      key: "codeColor",
      width: "8%",
      align: "center",
    },
    {
      title: "Số lượng",
      key: "quantity",
      align: "center",
      width: "8%",
      dataIndex: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, record.idProduct)}
        />
      ),
    },
    {
      title: "Giá tiền",
      key: "price",
      align: "center",
      width: "8%",
      dataIndex: "price",
      render: (_, record) => <span>{formatCurrency(record.price)}</span>,
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      align: "center",
      width: "8%",
      dataIndex: "totalPrice",
      render: (_, record) => (
        <span>{formatCurrency(totalMoneyProduct(record))}</span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      width: "8%",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="primary"
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteGiveBack(record)}
            >
              Xóa
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleModalQuantityGiveBack = (record) => {
    console.log(record);
    showModal();
    setSelectedProduct(record);
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  // cập nhập số lượng
  const handleQuantityChange = (value, id) => {
    const productInBill = dataProductBill.find(
      (product) => product.idProduct === id
    );
    if (productInBill) {
      if (value > productInBill.quantity) {
        toast.warning("Số lượng đổi trả vượt quá số lượng mua hàng.");
        return;
      }
      setDataProductGiveBack((prevTableData) =>
        prevTableData.map((item) =>
          item.idProduct === id
            ? {
                ...item,
                quantity: value,
                totalPrice:
                  item.promotion === null
                    ? item.quantity * item.price
                    : item.quantity * (item.price * (100 - item.promotion)),
              }
            : item
        )
      );
    }
  };

  // modal nhập số lượng đổi trả
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (values) => {
    const quantityCustom = values;
    if (selectedProduct) {
      // Kiểm tra xem sản phẩm đã tồn tại trong dataProductGiveBack hay chưa
      const productExists = dataProductGiveBack.some(
        (item) => item.idProduct === selectedProduct.idProduct
      );
      if (quantityCustom > selectedProduct.quantity) {
        toast.warning("Đã quá số lượng mua hàng.");
        return;
      }
      // Nếu sản phẩm đã tồn tại, cập nhật lại số lượng
      if (productExists) {
        setDataProductGiveBack((prevData) =>
          prevData.map((item) =>
            item.idProduct === selectedProduct.idProduct
              ? {
                  ...item,
                  quantity: quantityCustom,
                  totalPrice: quantityCustom * selectedProduct.price,
                }
              : item
          )
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào danh sách
        const updatedProduct = {
          ...selectedProduct,
          quantity: quantityCustom,
          totalPrice: quantityCustom * selectedProduct.price,
          stt: dataProductGiveBack.length + 1,
        };

        setDataProductGiveBack((prevData) => [...prevData, updatedProduct]);
      }
      form.resetFields();
      setSelectedProduct(null);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const totalMoneyProduct = (product) => {
    return product.price * product.quantity;
  };

  const totalMoneyBill = () => {
    let total = 0;
    dataProductBill.forEach((data) => {
      if (data.statusBillDetail) {
        const money = totalMoneyProduct(data);
        total += money;
      }
    });
    return total;
  };

  const totalMoneyBillGiveBack = () => {
    let total = 0;
    dataProductGiveBack.map((data) => {
      const money = totalMoneyProduct(data);
      total += money;
    });
    return total;
  };

  // xóa sản phẩm đổi trả
  const handleDeleteGiveBack = (record) => {
    const newDataProductGiveBack = dataProductGiveBack
      .filter((product) => product.idProduct !== record.idProduct)
      .map((product, index) => ({ ...product, stt: index + 1 }));
    setDataProductGiveBack(newDataProductGiveBack);
  };

  // hoàn trả tất cả sản phẩm
  const handleAllGiveBackToBill = () => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý thêm không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: () => {
          const newDataProductGiveBack = dataProductBill.map((item) => ({
            ...item,
          }));
          setDataProductGiveBack(newDataProductGiveBack);
          resolve();
        },
      });
    });
  };

  // success hoàn trả
  const handleSuccessGiveBack = () => {
    form
      .validateFields()
      .then((values) => {
        return new Promise((resolve) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý trả hàng không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
          });
        });
      })
      .then((values) => {
        const updateBill = {
          note: values.note,
          idBill: bill.idBill,
          idAccount: bill.idAccount,
          totalBillGiveBack: totalMoneyBillGiveBack(),
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(dataProductGiveBack));
        formData.append("updateBill", JSON.stringify(updateBill));

        console.log(dataProductGiveBack);
        request
          .post(`bill/give-back`, formData)
          .then(() => {
            //     nav("/give-back-management");
            toast.success("Hoàn trả thành công.");
          })
          .catch((error) => {});
      })
      .catch((err) => console.log({ err }));
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <div>
          <Card style={{ marginRight: "20px" }}>
            <h1 style={{ fontSize: "22px" }}>Thông tin khách hàng</h1>
            {bill != null && (
              <Row style={{ width: "100%", marginTop: "30px" }}>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Tên khách hàng:
                    </Col>
                    <Col span={16}>
                      {bill.userName === "" ? (
                        <span
                          style={{
                            backgroundColor: " #ccc",
                            color: "white",
                            width: "180px",
                            borderRadius: "15px",
                            padding: " 5px 19px",
                            marginLeft: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Khách lẻ
                        </span>
                      ) : (
                        <span style={{ color: "black" }}>
                          {bill.nameCustomer}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Ngày giao hàng:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>
                        {bill.deliveryDate !== null &&
                          moment(bill.deliveryDate).format("DD-MM-YYYY")}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Số điện thoại:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>{bill.phoneNumber}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Ngày nhận hàng:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>
                        {bill.completionDate !== null &&
                          moment(bill.completionDate).format("DD-MM-YYYY")}
                      </span>
                    </Col>
                  </Row>
                </Col>

                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Địa chỉ:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>{bill.address}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px" }}>
                    <Col
                      span={8}
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginTop: "8px",
                      }}
                    >
                      Trạng thái :
                    </Col>
                    <Col span={16}>
                      <Button
                        style={{
                          backgroundColor: "#6633FF",
                          color: "white",
                          width: "180px",
                          borderRadius: "15px",
                          padding: " 5px 38px",
                          pointerEvents: "none",
                        }}
                      >
                        {bill.statusBill === "1"
                          ? "Tạo Hóa đơn"
                          : bill.statusBill === "2"
                          ? "Chờ xác nhận"
                          : bill.statusBill === "3"
                          ? "Xác nhận"
                          : bill.statusBill === "4"
                          ? "Chờ chờ vận chuyển"
                          : bill.statusBill === "5"
                          ? "Đang vận chuyển"
                          : bill.statusBill === "6"
                          ? "Thành công"
                          : bill.statusBill === "8"
                          ? "Trả hàng"
                          : "Đã hủy"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row
                    style={{
                      marginLeft: "20px",
                      marginTop: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Ghi chú:
                    </Col>
                    <Col span={16}>
                      <span>{bill.note}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Loại:
                    </Col>
                    <Col span={16}>
                      <Button
                        style={{
                          backgroundColor: "#6633FF",
                          color: "white",
                          width: "180px",
                          borderRadius: "15px",
                          padding: " 5px 38px",
                          pointerEvents: "none",
                        }}
                      >
                        {bill.typeBill === "0" ? "OFFLINE" : "ONLINE"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Card>
          <Card style={{ marginTop: "10px", marginRight: "10px" }}>
            <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
              Thông tin đơn hàng
            </h1>
            <Row justify={"end"}>
              <Tooltip title="Trả hàng hòa toàn">
                <Button
                  type="primary"
                  style={{
                    height: "40px",
                    fontWeight: "bold",
                    margin: "5px 10px 10px 0px ",
                  }}
                  onClick={() => handleAllGiveBackToBill()}
                  disabled={bill !== null && bill.statusBill !== "6"}
                >
                  <span style={{ marginLeft: "5px" }}>Trả hàng tất cả</span>
                </Button>
              </Tooltip>
            </Row>
            <Table
              columns={columnProductBill}
              dataSource={dataProductBill}
              pagination={{ pageSize: 3 }}
              rowKey={"id"}
            />
            <br />
            <hr />
            <Row justify={"end"} style={{ marginTop: "10px" }}>
              <Col>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  Tổng tiền :
                </span>
              </Col>
              <Col style={{ marginLeft: "10px", marginRight: "10%" }}>
                <span
                  style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}
                >
                  {formatCurrency(totalMoneyBill())}
                </span>
              </Col>
            </Row>
          </Card>
          <Row justify={"space-between"}>
            <Col span={16}>
              <Card
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  height: "100%",
                }}
              >
                <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
                  Thông tin đơn hàng trả
                </h1>
                {dataProductGiveBack.length > 0 ? (
                  <div className="table-bill-give-back">
                    <Table
                      columns={columnProductGiveBack}
                      dataSource={dataProductGiveBack}
                      pagination={{ pageSize: 3 }}
                      rowKey={"id"}
                    />
                  </div>
                ) : (
                  <Row style={{ width: "100%" }}>
                    <Row
                      justify={"center"}
                      style={{
                        width: "100%",
                        position: "relative",
                        marginTop: "8%",
                      }}
                    >
                      <Col span={9} align="center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiSWIoLaZSLHBPWAeO0RZFEiqaDNA0pyOboAdbGJqtUBkYAf65Z7rPVukqwmxTiJY87WQ&usqp=CAU"
                          style={{ marginTop: "20px", width: "100%" }}
                        />
                      </Col>
                    </Row>
                    <Row justify={"center"} style={{ width: "100%" }}>
                      <Col>
                        <span style={{ fontSize: "15px" }}>
                          {" "}
                          Không có sản phẩm nào đổi trả
                        </span>
                      </Col>
                    </Row>
                  </Row>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  height: "100%",
                }}
              >
                <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
                  Thông tin thanh toán{" "}
                </h1>
                <Row style={{ marginTop: "40px" }}>
                  <Col span={12}>
                    <span style={{ fontWeight: "bold" }}>
                      Tổng giá gốc hàng :{" "}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {formatCurrency(totalMoneyBill())}
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                  <Col span={12}>
                    <span style={{ fontWeight: "bold" }}>
                      Tổng giá trả hàng :{" "}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {" "}
                      {formatCurrency(totalMoneyBillGiveBack())}
                    </span>
                  </Col>
                </Row>
                <br />
                <hr />
                <Row style={{ marginTop: "30px" }}>
                  <Col span={12}>
                    <span style={{ fontWeight: "bold" }}>
                      Tiền thừa trả khách :{" "}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {formatCurrency(totalMoneyBillGiveBack())}
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                  <Col>
                    <Form.Item
                      label="Mô tả : "
                      name="note"
                      style={{ fontWeight: "bold" }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả khi trả hàng.",
                        },
                        {
                          validator: (_, value) => {
                            if (value && value.trim() === "") {
                              return Promise.reject(
                                "Không được chỉ nhập khoảng trắng"
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        placeholder="Nhập mô tả "
                        style={{ width: "300px" }}
                        onKeyDown={(e) => {
                          if (e.key === " " && e.target.value === "") {
                            e.preventDefault();
                            e.target.value.replace(/\s/g, "");
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Tooltip title="Trả hàng">
                  <Button
                    style={{
                      width: "100%",
                      height: "50px",
                      marginTop: "10px",
                      backgroundColor: "#00CD00",
                      color: "white",
                    }}
                    onClick={handleSuccessGiveBack}
                  >
                    <h2>Trả hàng</h2>
                  </Button>
                </Tooltip>
              </Card>
            </Col>
          </Row>
        </div>
        <ModalQuantityGiveBack
          visible={isModalOpen}
          onCancel={handleCancel}
          handleSusses={(values) => handleOk(values)}
        />
      </Form>
    </>
  );
}
