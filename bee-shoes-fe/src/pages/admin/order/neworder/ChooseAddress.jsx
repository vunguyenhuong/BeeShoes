import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import DetailAddress from "~/components/DetailAddress";
import * as request from "~/utils/httpRequest";

function ChooseAddress({ props, handleChoose }) {
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

  const handleChooseAddress = (item) => {
    handleChoose(item)
    setIsModalOpen(false);
  }

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };
  const handleOkAdd = () => {
    setIsModalOpen(false);
  };
  const handleCancelAdd = () => {
    setIsModalAddOpen(false);
  };
  return (
    <>
      <span className="text-primary fw-semibold" onClick={showModal}>
        <i className="fas fa-location-dot"></i> Chọn địa chỉ
      </span>
      <Modal
        title={
          <div className="d-flex">
            <div className="flex-grow-1">Chọn địa chỉ khác</div>
            <div onClick={showModalAdd} className="me-5 text-success focus">
              <i className="fas fa-location-dot"></i> Thêm mới
            </div>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={1000}
        footer=""
      >
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên người nhận</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Mặc định</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.map((item, index) => (
                <tr class="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    {item.specificAddress},{" "}
                    <DetailAddress distr={item.district} prov={item.province} war={item.ward} />
                  </td>
                  <td>
                    <input class="form-check-input" type="checkbox" checked={item.defaultAddress} />
                  </td>
                  <td>
                    <Button onClick={() => handleChooseAddress(item)} type="primary">
                      Chọn
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal centered title="Thêm địa chỉ" open={isModalAddOpen} onOk={handleOkAdd} onCancel={handleCancelAdd} footer="">
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Modal>
    </>
  );
}

export default ChooseAddress;
