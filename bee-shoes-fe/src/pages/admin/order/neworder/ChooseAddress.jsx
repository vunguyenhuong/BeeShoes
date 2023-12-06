import { Modal, Button, Col, Row, Table, } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import DetailAddress from "~/components/DetailAddress";
import * as request from "~/utils/httpRequest";
import CreateAddressModal from "~/components/Admin/Account/Customer/CreateAddressModal";

function ChooseAddress({ idCustomer, onSuccess }) {
  const [addressList, setAddressList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadDataAddress(idCustomer, currentPage, pageSize);
  }, [idCustomer, currentPage, pageSize]);

  const loadDataAddress = (idCustomer, currentPage, pageSize) => {
    request
      .get(`/address/${idCustomer}`, {
        params: {
          // name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: false,
        },
      })
      .then((response) => {
        setAddressList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      className: "text-center",
    },
    {
      title: "Tên người nhận",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      className: "text-center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      className: "text-center",
      render: (x, item) => (
        <>
          {item.specificAddress}
          {", "}
          <DetailAddress
            distr={item.district}
            prov={item.province}
            war={item.ward}
          />
        </>
      ),
    },
    {
      title: "Mặc định",
      key: "defaultAddress",
      className: "text-center",
      render: (x, item) => (
        <>
          {item.defaultAddress ? (
            <i class="fa-solid fa-check text-success" />
          ) : (
            <i class="fa-solid fa-xmark text-danger" />
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "text-center",
      render: (x, record) => <Button onClick={() => handleSelectAddress(record)}>Chọn</Button>
    },
  ];

  const handleSelectAddress = (address) => {
    setIsModalOpen(false);
    onSuccess(address);
    console.log(address);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="text"
        icon={<i className="fas fa-location-dot"></i>}
        className="text-success fw-semibold"
      >
        Chọn địa chỉ
      </Button>
      <Modal
        title={
          <Row>
            <Col span={18}>
              <div className="flex-grow-1">Chọn địa chỉ khác</div>
            </Col>
            <Col span={6}>
              <CreateAddressModal
                idCustomer={idCustomer}
                onSuccess={() => {
                  setCurrentPage(1);
                  loadDataAddress(idCustomer, currentPage, pageSize);
                }}
              />
            </Col>
          </Row>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={1000}
        footer=""
      >
        <Table
          dataSource={addressList}
          columns={columns}
          className="mt-3"
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Modal>
    </>
  );
}

export default ChooseAddress;
