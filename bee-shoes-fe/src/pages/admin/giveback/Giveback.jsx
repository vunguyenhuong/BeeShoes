import { Button, Card, Form, Input, Row } from "antd";
import React from "react";
import QrCode from "~/components/QrCode";
import "./give-back.css";
import * as request from "~/utils/httpRequest";
import { useNavigate } from "react-router-dom";
function Giveback() {
  const nav = useNavigate();
  const onFinish = (values) => {
    const bill = values.search;
    request
      .get(`bill/give-back-information`, {
        params: {
          codeBill: bill,
        },
      })
      .then((response) => {
        console.log(response);
        nav(`/admin/detail-give-back/${bill}`);
      })
      .catch((e) => {});
  };
  return (
    <>
      <Card className="contaier-give-back" style={{ height: "80vh" }}>
        <span style={{ fontSize: "23px" }}> Trả hàng</span>
        <div className="search-bill">
          <Row justify="center" align="middle">
            <Form
              name="customized_form_controls"
              layout="inline"
              onFinish={onFinish}
            >
              <Form.Item
                label="Mã hóa đơn "
                name="search"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã hóa đơn",
                  },
                ]}
                style={{ fontWeight: "bold", color: "blue" }}
              >
                <Input
                  style={{ height: "35px", width: "400px" }}
                  placeholder="Nhập mã đơn hàng..., VD: HD01234"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: "35px" }}
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
              <Form.Item>
                <QrCode />
              </Form.Item>
            </Form>
          </Row>
        </div>
      </Card>
    </>
  );
}

export default Giveback;
