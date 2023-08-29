import React from "react";
import { useForm } from "react-hook-form";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { Option } from "antd/es/mentions";

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
  }, [searchOption,url])

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
      <Select
          className="me-2"
          showSearch
          onChange={onChange}
          optionFilterProp="children"
          style={{ width: '100%' }}
          onSearch={setSearchOption}
          defaultValue={selected}
        >
          <Option value="">-- Chọn {label} --</Option>
          {option.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={showModal}>
          <i className="fas fa-plus-circle"></i>
        </Button>
      </div>

      <Modal title={`Thêm ${label}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form layout="vertical">
          <Form.Item label={'Tên'} name={"name"} rules={[{ required: true, message: "Tên không được để trống!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <div
        className="modal fade"
        id={`${name}Modal`}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Thêm {label}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id={`${name}Form`} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("name", { required: true })}
                  />
                  <small id="helpId" className="form-text text-muted">
                    {errors.name && "Tên không được để trống!"}
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                form={`${name}Form`}
                data-bs-dismiss={isValid && "modal"}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectField;
