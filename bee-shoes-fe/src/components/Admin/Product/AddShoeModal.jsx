import React, { useEffect, useState } from "react";
import SelectField from "./SelectField";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { Button, Col, Collapse, Input, Modal, Row, message } from "antd";
import { FaPlus, FaPlusCircle } from "react-icons/fa";

function AddShoeModal({ onAddSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productName, setProductName] = useState(null);

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

  const handleChangeProductName = (event) => {
    setProductName(event.target.value);
  };

  const handleCreateShoe = (e) => {
    if (
      productName === "" ||
      productName === null ||
      selectedCategory === null ||
      selectedBrand === null
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
    } else {
      const data = {
        name: productName,
        category: selectedCategory,
        brand: selectedBrand,
      };
      swal("Xác nhân thêm mới giày?", {
        icon: "warning",
        buttons: ["Không", "Đồng ý!"],
      }).then((action) => {
        if (action) {
          request
            .post("/shoe", data)
            .then((response) => {
              console.log(response);
              if (response.status === 201) {
                toast.success("Thêm thành công!");
                onAddSuccess();
              }
            })
            .catch((e) => {
              if (e.response.status === 409)
                toast.error(`${e.response.data.name} đã tồn tại!`);
            });
        }
      });
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal} className="bg-warning" size="large">
        <FaPlusCircle/>
      </Button>
      <Modal title="Thêm giày" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <label className="mb-2">Nhập tên giày</label>
        <Input />
        <SelectField url={"/category"} label={"Danh mục"} onChange={setSelectedCategory} />
        <SelectField url={"/brand"} label={"Thương hiệu"} onChange={setSelectedBrand} />
      </Modal>

    </>
  );
}

export default AddShoeModal;
