import { Button, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useState } from "react";

function PaymentMethod({bill}) {
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
  return (
    <>
      {bill.status === 0 ? (
        <>
        <Button type="primary" onClick={showModal}>Xác nhận thanh toán</Button>
      <Modal
        title="Xác nhận thanh toán"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div class="mb-3">
          <label for="" class="form-label">Name</label>
          <input type="text"
            class="form-control"/>
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Ghi chú</label>
          <textarea class="form-control" rows="3"></textarea>
        </div>
      </Modal>
        </>
      ): (
        <span className="text-success fw-semibold">Đơn hàng đã được thanh toán</span>
      )}
    </>
  );
}

export default PaymentMethod;
