import { Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import QrCode from "~/components/QrCode";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function AddCustomer() {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataAddress, setDataAddress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl("");
    }
  };

  const handleQrSuccess = (value) => {
    const withoutName = value.substring(14, value.length);
    const splits = withoutName.split("|");
    const birthday = splits[1];
    if (value.substring(0, 12).length === 12) {
      message.success(`Đã tìm thấy ${splits[0].toString()}!`);
      setValue("gender", splits[2]);
      setValue("username", value.substring(0, 12));
      setValue("name", splits[0]);
      setValue(
        "birthday",
        `${birthday.substring(4)}-${birthday.substring(
          2,
          4
        )}-${birthday.substring(0, 2)}`
      );
      setValue("specificAddress", splits[3]);
    }
  };

  const genderCheck = watch("gender");
  const handleChangeGender = (value) => {
    setValue("gender", value);
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      const { v4: uuidv4 } = require("uuid");
      const randomImageName = uuidv4().replace(/-/g, "");
      formData.append("file", file);
      formData.append("folder", "account");
      formData.append("upload_preset", "demo-upload");
      formData.append("public_id", randomImageName);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/beeshoes/image/upload",
        formData
      );

      console.log("Hình ảnh đã được tải lên:", response.data.public_id);
      return `${response.data.public_id}.${response.data.format}`;
    } catch (error) {
      console.log("Error uploading and saving image:", error);
      return null;
    }
  };

  const handleAddStaff = (data) => {
    if (dataAddress === null) {
      message.error("Vui lòng chọn địa chỉ!");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        maskClosable: true,
        content: "Xác nhận thêm mới khách hàng ?",
        okText: "Ok",
        cancelText: "Cancel",
        onOk: async () => {
          setLoading(true);
          const avatar = await uploadImage(data.avatar[0]);
          const dataRequest = {
            username: data.username,
            name: data.name,
            email: data.email,
            avatar: avatar,
            gender: data.gender,
            birthday: data.birthday,
            addressList: [
              {
                name: data.name,
                phoneNumber: data.phoneNumber,
                specificAddress: data.specificAddress,
                ward: dataAddress.ward,
                district: dataAddress.district,
                province: dataAddress.province,
              },
            ],
          };
          request
            .post("/customer", dataRequest)
            .then((response) => {
              if (response.status === 200) {
                message.success("Thêm thành công!");
                setLoading(false);
                navigate("/admin/customer");
              }
            })
            .catch((e) => {
              console.log(e);
              setLoading(false);
            });
        },
      });
    }
  };

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  return (
    <BaseUI>
      <div className="">
        <div className="d-flex">
          <div className="flex-grow-1">
            <nav className="breadcrumb fw-semibold">
              <Link
                className="breadcrumb-item __bee-text text-decoration-none"
                to={"/admin/staff"}
              >
                Danh sách khách hàng
              </Link>
              <span className="breadcrumb-item">Thêm khách hàng</span>
            </nav>
          </div>
          <div className="">
            <QrCode title={"Quét CCCD"} onQrSuccess={handleQrSuccess} />
          </div>
        </div>

        <div className="">
          <form onSubmit={handleSubmit(handleAddStaff)}>
            <div className="row">
              <div className="col-xl-4 border-end border-3">
                <h6 className="border-bottom border-3 pb-2">
                  Thông tin nhân viên
                </h6>
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input
                    class="form-control"
                    placeholder="Nhập username ..."
                    {...register("username", { required: true })}
                  />
                  <small class="form-text text-danger">
                    {errors.username && (
                      <span>Username không được để trống!</span>
                    )}
                  </small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên nhân viên ..."
                    {...register("name", { required: true })}
                  />
                  <small class="form-text text-danger">
                    {errors.name && <span>Tên không được để trống!</span>}
                  </small>
                </div>
                <div className="mb-3">
                  <label class="form-label">Giới tính</label>
                  <div className="">
                    <div class="form-check form-check-inline me-5">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="genderMale"
                        value={"Nam"}
                        {...register("gender", { required: true })}
                        checked={genderCheck === "Nam"}
                        onChange={() => handleChangeGender("Nam")}
                      />
                      <label class="form-check-label px-3" for="genderMale">
                        Nam
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="genderFemale"
                        value={"Nữ"}
                        {...register("gender", { required: true })}
                        checked={genderCheck === "Nữ"}
                        onChange={() => handleChangeGender("Nữ")}
                      />
                      <label class="form-check-label px-3" for="genderFemale">
                        Nữ
                      </label>
                    </div>
                  </div>
                  <small class="form-text text-danger">
                    {errors.gender && (
                      <span>Giới tính không được để trống!</span>
                    )}
                  </small>
                </div>
                <div className="mb-3">
                  <label class="form-label">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    class="form-control"
                    {...register("avatar", { required: true })}
                    onChange={handleImageSelect}
                  />
                  {previewUrl && (
                    <div className="text-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        width={"50%"}
                        className="mt-2 shadow-lg bg-body-tertiary"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-8">
                <h6 className="border-bottom border-3 pb-2">
                  Thông tin chi tiết
                </h6>
                <div className="row">
                  <div class="col-xl-6 mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      class="form-control"
                      placeholder="dd/mm/yyyy"
                      {...register("birthday", { required: true })}
                    />
                    <small class="form-text text-danger">
                      {errors.birthday && (
                        <span>Ngày sinh không được để trống!</span>
                      )}
                    </small>
                  </div>
                  <div class="col-xl-6 mb-3">
                    <label class="form-label">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập email ..."
                      {...register("email", { required: true })}
                    />
                    <small class="form-text text-danger">
                      {errors.email && <span>Email không được để trống!</span>}
                    </small>
                  </div>
                  <div class="col-xl-5 mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập số điện thoại ..."
                      {...register("phoneNumber", {
                        required: {
                          value: true,
                          message: "Số điện thoại không được để trống!",
                        },
                        pattern: {
                          value: /^0[0-9]{9}$/,
                          message: "Số điện thoại không đúng định dạng!",
                        },
                      })}
                    />
                    <small class="form-text text-danger">
                      {errors.phoneNumber && (
                        <span>{errors.phoneNumber.message}</span>
                      )}
                    </small>
                  </div>
                  <div class="col-xl-7 mb-3">
                    <label class="form-label">Địa chỉ cụ thể</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập địa chỉ cụ thể ..."
                      {...register("specificAddress", { required: true })}
                    />
                    <small class="form-text text-danger">
                      {errors.specificAddress && (
                        <span>Địa chỉ cụ thể không được để trống!</span>
                      )}
                    </small>
                  </div>
                  <GHNInfo dataAddress={setDataAddress} />
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" class="btn btn-success">
                    <i className="fas fa-plus-circle"></i> Thêm khách hàng
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BaseUI>
  );
}

export default AddCustomer;
