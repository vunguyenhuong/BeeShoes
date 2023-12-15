import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Switch,
} from "antd";
import React from "react";
import Loading from "~/components/Loading/Loading";
import ItemAddress from "./ItemAddress";
import { useState } from "react";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";
// import Pagination from "~/components/Pagination";
import CreateAddressModal from "./CreateAddressModal";
import { useParams } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import GHNInfo from "~/components/GhnInfo";

function AddressCustomerDetail() {
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const { id } = useParams();
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [dataAddress, setDataAddress] = useState(null);
  const [autoFillAddress, setAutoFillAddress] = useState([]);

  useEffect(() => {
    loadData(id, currentPage, pageSize);
  }, [id, currentPage, pageSize]);

  const loadData = (id, currentPage, pageSize) => {
    setLoading(true);
    const timeout = setTimeout(() => {
      request
        .get(`/address/${id}`, {
          params: {
            page: currentPage,
            sizePage: pageSize,
            status: false,
          },
        })
        .then((response) => {
          console.log(response);
          setListAddress(response.content);
          setTotalPages(response.totalPages);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    });
    return () => clearTimeout(timeout);
  };

  if (loading) {
    return <Loading />;
  }

  const handleAdd = (data) => {
    data.account = id;
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm địa chỉ mới? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .post("/address", data)
          .then((response) => {
            setCurrentPage(1);
            loadData(id, currentPage, pageSize);
            form.resetFields();
            toast.success("Thêm mới thành công!");
          })
          .catch((e) => console.log(e));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <Collapse
        expandIcon={({ isActive }) => (
          <span>
            {isActive ? (
              <i class="fa-solid fa-xmark text-danger fw-bold"></i>
            ) : (
              <i class="fa-solid fa-plus text-success fw-bold"></i>
            )}
          </span>
        )}
        size="small"
        items={[
          {
            key: "0",
            label: (
              <span className="fw-bold text-success">Tạo địa chỉ mới</span>
            ),
            children: (
              <Form onFinish={handleAdd} layout="vertical" form={form}>
                <Row gutter={10}>
                  <Col xl={12}>
                    <Form.Item
                      label={"Tên"}
                      name={"name"}
                      rules={[
                        {
                          required: true,
                          message: "Tên không được để trống!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên người nhận..." />
                    </Form.Item>
                  </Col>
                  <Col xl={12}>
                    <Form.Item
                      label={"Số điện thoại"}
                      name={"phoneNumber"}
                      rules={[
                        {
                          required: true,
                          message: "Số điện thoại không được để trống!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>
                  </Col>
                  <Col xl={24}>
                    <Form.Item
                      label={"Địa chỉ cụ thể"}
                      name={"specificAddress"}
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ cụ thể không được để trống!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ cụ thể ..." />
                    </Form.Item>
                  </Col>

                  <GHNInfo
                    dataAddress={setDataAddress}
                    distr={autoFillAddress.district}
                    prov={autoFillAddress.province}
                    war={autoFillAddress.ward}
                  />
                </Row>
                <div className="d-flex justify-content-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-success"
                  >
                    <i className="fas fa-plus-circle me-1"></i> Thêm
                  </Button>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <Divider orientation="left" />

      {listAddress.map((item) => (
        <>
          <Collapse
            size="small"
            defaultActiveKey={item.index}
            className="mb-3 rounded-0 border-0"
            items={[
              {
                key: `${item.index}`,
                label: (
                  <span className="fw-semibold">Địa chỉ {item.index}</span>
                ),
                children: (
                  <ItemAddress
                    props={item}
                    onSuccess={() => loadData(id, currentPage, pageSize)}
                  />
                ),
                className: "border-bottom-0",
              },
            ]}
          />
        </>
      ))}
      {/* <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChange={handlePageChange}
      /> */}
      <Pagination
        showSizeChanger
        showQuickJumper
        defaultCurrent={currentPage}
        pageSize={pageSize}
        pageSizeOptions={[2, 5, 10, 20, 100]}
        total={totalPages * pageSize}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </>
  );
}

export default AddressCustomerDetail;
