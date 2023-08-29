import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import AddressCustomerDetail from "./AddressCustomerDetail";

function CustomerAddressDetail({ idCustomer }) {
  const navigate = useNavigate();
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
  ];
  const [dataAddress, setDataAddress] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadListAddress();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [idCustomer, loading]);
  
  useEffect(() => {
    reset({
      name: "",
      phoneNumber: "",
      specificAddress: "",
      province: "",
      district: "",
      ward: "",
      defaultAddress: "",
    })
  }, [isSubmitSuccessful])

  const loadListAddress = async () => {
    try {
      const response = await request.get(`/address/${idCustomer}`);
      setListAddress(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateAddress = async (data) => {
    const customData = [
      {
        account: await request.get(`/customer/${idCustomer}`),
        name: data.name,
        phoneNumber: data.phoneNumber,
        specificAddress: data.specificAddress,
        province: dataAddress.province,
        district: dataAddress.district,
        ward: dataAddress.ward,
      },
    ];
    Modal.confirm({
        title: "Xác nhận",
        maskClosable: true,
        content: "Xác nhận thêm mới địa chỉ ?",
        okText: "Ok",
        cancelText: "Cancel",
        onOk: () => {
          setLoading(true);
          request
          .post("/address", customData)
          .then((response) => {
            if(response.status === 200){
              navigate(`/admin/customer/${idCustomer}`)
              message.success('Thêm thành công!');
              setLoading(false);
            }
          })
          .catch((e) => {
            console.log(e);
          });
        },
      });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {listAddress.map((item, key) => (
        <div className="" key={key}>
          <AddressCustomerDetail address={item} addressIndex={key} onSuccess={loadListAddress}/>
        </div>
      ))}
            <div className="d-flex justify-content-end my-3">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <i className="fas fa-plus-circle"></i> Địa chỉ mới
        </button>
      </div>

      <div class="collapse" id="collapseExample">
        <h6>Thêm địa chỉ mới</h6>
        <div class="card card-body">
          <form onSubmit={handleSubmit(handleCreateAddress)}>
            <div className="row">
              <div class="col-xl-12 mb-3">
                <label class="form-label">Tên </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập số tên người dùng ..."
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
              <GHNInfo dataAddress={setDataAddress} />
            </div>
            <div className="d-flex justify-content-end my-3">
              <button type="submit" class="btn btn-primary btn-sm me-2">
                Thêm địa chỉ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CustomerAddressDetail;
