import React from "react";
import { useForm } from "react-hook-form";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { Option } from "antd/es/mentions";
import { FaPlusCircle } from "react-icons/fa";

function SelectField({
  label,
  options,
  name,
  url,
  onAddSuccess,
  onChange,
  selected,
}) {
  const [option, setOption] = useState([]);
  const [searchOption, setSearchOption] = useState([]);

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const loadData = () => {
    request.get(url, { params: { name: searchOption } }).then((response) => {
      setOption(response.data);
    });
  }

  useEffect(() => {
    request.get(url, { params: { name: searchOption } }).then((response) => {
      setOption(response.data);
    });
  }, [searchOption, url])

  const onSubmit = (data) => {
    request
      .post(url, data)
      .then((response) => {
        if (response.status === 201) {
          message.success("Thêm thành công!");
          loadData()
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 409)
          message.error(`Thuộc tính ${e.response.data.name} đã tồn tại!`);
      });
  };
  return (
    <>
      <label className="mb-1">{label}</label>
      <div className="d-flex">
        <Select className="me-2" showSearch onChange={onChange} optionFilterProp="children" style={{ width: '100%' }} onSearch={setSearchOption} defaultValue={selected}>
          <Option value="">-- Chọn {label} --</Option>
          {option.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={showModal} className="bg-warning">
          <FaPlusCircle />
        </Button>
      </div>

      <Modal title={`Thêm ${label}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form layout="vertical">
          <Form.Item label={'Tên'} name={"name"} rules={[{ required: true, message: "Tên không được để trống!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SelectField;
