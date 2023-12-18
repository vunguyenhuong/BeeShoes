import { Breadcrumb, Col, Form, Input, DatePicker, Row, Button, Modal, Empty } from "antd";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import { FaHome } from "react-icons/fa";
import TableShoe from "./TableShoe";
import TableShoeDetail from "./TableShoeDetail";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddPromotion() {
  const [form] = Form.useForm();
  const [productIds, setProductIds] = useState([]);
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState([]);

  const handleCreatePromotion = (data) => {
    if(productDetail.length === 0){
      toast.error("Vui lòng chọn sản phẩm áp dụng")
    }else{
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm đợt giảm giá mới?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        data.productDetails = productDetail
        request.post('/promotion', data).then(response => {
          console.log(response);
          toast.success("Thêm thành công!");
          navigate('/admin/promotion');
        }).catch(e => {
          console.log(e);
          toast.error(e.response.data);
        })
        console.log(data);
      },
    });
  }};

  useEffect(() => {

  });


  return (
    <>
      <Breadcrumb className="mb-2">
        <Breadcrumb.Item>
          <Link to="/">
            <FaHome /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/promotion">Danh sách đợt giảm giá</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thêm đợt giảm giá</Breadcrumb.Item>
      </Breadcrumb>
      <Form onFinish={handleCreatePromotion} layout="vertical" form={form}>
        <Row gutter={10}>
          <Col xl={12}>
            <Row gutter={10}>
              <Col xl={12}>
                <Form.Item label={"Mã đợt giảm giá"} name={"code"} rules={[{ required: true, message: "Mã đợt giảm giá không được để trống!", },]}>
                  <Input placeholder="Nhập mã đợt giảm giá..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Tên đợt giảm giá"} name={"name"} rules={[{ required: true, message: "Tên đợt giảm giá không được để trống!", },]} >
                  <Input placeholder="Nhập tên đợt giảm giá..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Giá trị (%)"} name={"value"} rules={[{ required: true, message: "Giá trị không được để trống!", },]} >
                  <Input placeholder="Nhập % đợt giảm giá..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày bắt đầu"} name={"startDate"} rules={[{ required: true, message: "Ngày bắt đầu không được để trống!", },]} >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày kết thúc"} name={"endDate"} rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Button type="primary" className="bg-warning" htmlType="submit">Thêm đợt giảm giá</Button>
              </Col>
            </Row>
          </Col>
          <Col xl={12}>
            <h6>Danh sách sản phẩm</h6>
            <TableShoe setProductIds={setProductIds} setRowKeys={null} />
          </Col>
          <Col xl={24}>
            <h6>Danh sách chi tiết sản phẩm</h6>

            {productIds.length === 0 ? <Empty /> : <TableShoeDetail idProduct={productIds} setSelectedProductDetail={(value) => setProductDetail(value)} />}
          </Col>
        </Row>
      </Form >
    </>
  );
}

export default AddPromotion;
