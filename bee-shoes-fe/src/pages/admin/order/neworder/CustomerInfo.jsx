import { AutoComplete, Avatar, Button, Input, Modal, Select } from "antd";
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
    request.get("/customer", {
      params: {
        name: value,
      },
    }).then((response) => {
      setCustomerData(response.data);
    }).catch((error) => {
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
      <div className="d-flex">
        <div className="flex-grow-1 me-1">
          <AutoComplete
            value={searchValue}
            onChange={handleSearch}
            onSelect={onSelect}
            style={{ width: "300px" }}
            options={customerData.map((customer) => ({
              value: customer.id,
              label: (
                <>
                  <div className="d-flex">
                    <Avatar src={`${customer.avatar}`} shape="circle" size={"default"} className="me-2" />
                    <div className="">
                      {customer.name} - {customer.gender}
                      <br />
                      {customer.phoneNumber}
                    </div>
                  </div>
                </>
              ),
            }))}
          >
            <Input.Search placeholder="Tìm kiếm khách hàng..." />
          </AutoComplete>
        </div>
        <div className="">
          <Button type="primary" className="bg-warning text-dark" icon={<i className="fas fa-plus-circle"></i>} onClick={showModal}>Thêm mới KH</Button>
        </div>
      </div>


      <Modal title="Thêm mới khách hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} footer="">
        abcs
      </Modal>
    </>
  );
}

export default CustomerInfo;
