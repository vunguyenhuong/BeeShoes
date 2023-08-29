import { AutoComplete, Avatar, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest"; // Import các hàm gọi API từ thư viện của bạn

function CustomerInfo({ handleSelect }) {
  const [customerData, setCustomerData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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
    loadCustomer("");
  }, []);

  const loadCustomer = (value) => {
    // Gọi API để lấy dữ liệu khách hàng
    request
      .get("/customer", {
        params: {
          value: value,
        },
      }) // Thay đổi đường dẫn API tùy theo yêu cầu của bạn
      .then((response) => {
        setCustomerData(response.content);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    loadCustomer(value);
  };

  const onSelect = (value) => {
    setSearchValue("");
    handleSelect(value);
  };

  return (
    <>
      <label className="form-label">
        <span className="me-3">Tìm khách hàng</span>{" "}
        <span className="text-success fw-semibold" onClick={showModal}>
          <i className="fas fa-plus-circle"></i> Thêm mới KH
        </span>
      </label>
      <div className="">
        <AutoComplete
          value={searchValue}
          onChange={handleSearch}
          onSelect={onSelect}
          style={{ width: "100%" }}
          options={customerData.map((customer) => ({
            value: customer.id,
            label: (
              <>
                <div className="d-flex">
                  <Avatar
                    src={`https://res.cloudinary.com/beeshoes/image/upload/v1690189926/${customer.avatar}`}
                    shape="circle"
                    size={"default"}
                    className="me-2"
                  />
                  <div className="">
                    <span>
                      {customer.name} - {customer.gender}
                    </span>
                    <br />
                    <span>{customer.phoneNumber}</span>
                  </div>
                </div>
              </>
            ),
          }))}
        >
          <Input.Search placeholder="Tìm kiếm khách hàng..." />
        </AutoComplete>
      </div>

      <Modal
        title="Thêm mới khách hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        
      </Modal>
    </>
  );
}

export default CustomerInfo;
