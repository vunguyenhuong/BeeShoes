import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import GHNInfo from "~/components/GhnInfo";
import * as request from "~/utils/httpRequest";

function AddressCustomerDetail({ address, addressIndex, onSuccess }) {
  const [dataAddress, setDataAddress] = useState(null);
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
  const fields = [
    "name",
    "phoneNumber",
    "specificAddress",
    "ward",
    "district",
    "province",
    "defaultAddress",
  ];
  useEffect(() => {
    fields.map((item) => setValue(item, address[item]));
  }, [address]);

  const handleUpdateAddress = (data) => {
    const customData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      specificAddress: data.specificAddress,
      province: dataAddress != null ? dataAddress.province : data.province,
      district: dataAddress != null ? dataAddress.district : data.district,
      ward: dataAddress != null ? dataAddress.ward : data.ward,
      defaultAddress: data.defaultAddress ? true : false,
    };
    if ((dataAddress == null) & (data.province == null)) {
      toast.error("Vui lòng chọn địa chỉ!");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        maskClosable: true,
        content: "Xác nhận cập nhật địa chỉ ?",
        okText: "Ok",
        cancelText: "Cancel",
        onOk: () => {
          request
            .put(`/address/${address.id}`, customData)
            .then((response) => {
              if (response.status === 200) {
                onSuccess();
                message.success("Cập nhật thành công!");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        },
      });
    }
  };

  const handleDeleteAddress = () => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa địa chỉ ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .remove(`/address/${address.id}`)
          .then((response) => {
            if (response.status === 200) {
              onSuccess();
              message.success("Xóa thành công!");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };
  return (
    <>
      <div class="accordion mb-3" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#address${addressIndex}`}
              aria-expanded="true"
              aria-controls={`address${addressIndex}`}
            >
              Địa chỉ {addressIndex + 1}
            </button>
          </h2>
          <div
            id={`address${addressIndex}`}
            class="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <form onSubmit={handleSubmit(handleUpdateAddress)}>
                <div className="row">
                  <div class="col-xl-12 mb-3">
                    <label class="form-label">Tên</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập tên ..."
                      {...register("name", { required: true })}
                    />
                    <small class="form-text text-danger">
                      {errors.name && <span>Tên không được để trống!</span>}
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
                  <GHNInfo
                    dataAddress={setDataAddress}
                    prov={address.province}
                    distr={address.district}
                    war={address.ward}
                  />
                </div>
                <div className="d-flex my-3">
                  <div className="flex-grow-1">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="true"
                        id={`defaultAddress${addressIndex}`}
                        {...register("defaultAddress")}
                      />
                      <label
                        class="form-check-label"
                        for={`defaultAddress${addressIndex}`}
                      >
                        Địa chỉ mặc định
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm me-2"
                    onClick={() => handleDeleteAddress()}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button type="submit" class="btn btn-warning btn-sm">
                    <i className="fas fa-edit"></i> Sửa địa chỉ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressCustomerDetail;
