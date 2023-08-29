import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import DetailAddress from "~/components/DetailAddress";
import * as request from "~/utils/httpRequest";

function ChooseAddress({ props, handleChooe }) {
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
    handleChooe(item)
    setIsModalOpen(false);
  }
  return (
    <>
      <span className="text-primary fw-semibold" onClick={showModal}>
        <i className="fas fa-location-dot"></i> Chọn địa chỉ
      </span>
      <Modal
        title="Chọn địa chỉ khác"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={1000}
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
                    <DetailAddress distr={item.district} prov={item.province} war={item.ward}/>
                  </td>
                  <td>
                  <input class="form-check-input" type="checkbox" checked={item.defaultAddress}/>
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
      </Modal>
    </>
  );
}

export default ChooseAddress;
