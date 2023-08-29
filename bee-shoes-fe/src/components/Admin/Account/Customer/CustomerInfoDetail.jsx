import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";

function CustomerInfoDetail({ idCustomer }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState({});
  const fields = ["username", "name", "gender", "email", "birthday", "avatar", "deleted"];
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      request
      .get(`/customer/${idCustomer}`)
      .then((response) => {
        setStaff(response);
        fields.map((item) => setValue(item, response[item]));
      })
      .catch((e) => {
        console.log(e);
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [idCustomer]);

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
  const handleUpdateStaff = (data) => {
    swal("Xác nhân cập nhật thông tin ?", {
      icon: "warning",
      buttons: ["Không", "Đồng ý!"],
    }).then(async (action) => {
      if (action) {
        setLoading(true);
        if(data.avatar === staff.avatar || data.avatar.length === 0){
          data.avatar = staff.avatar
        }else{
          data.avatar = await uploadImage(data.avatar[0])
        }

        console.log(data.avatar);
        console.log("Staff ava: " + staff.avatar);
        request
          .put(`/customer/${idCustomer}`, data)
          .then((response) => {
            if (response.status === 200) {
              toast.success("Cập nhật thành công!");
              setLoading(false);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
    console.log(data);
  };

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleUpdateStaff)}>
      <div className="mb-3">
          <label class="form-label">Hình ảnh</label>
          <input
            type="file"
            class="form-control"
            {...register("avatar")}
            onChange={handleImageSelect}
          />
          {previewUrl ? (
            <div className="text-center">
              <img
                src={previewUrl}
                alt="Preview"
                width={"50%"}
                className="mt-2 shadow-lg bg-body-tertiary"
              />
            </div>
          ) : (
            <div className="text-center">
              <img
                src={`https://res.cloudinary.com/beeshoes/image/upload/v1690189926/${staff.avatar}`}
                alt="Preview"
                width={"50%"}
                className="mt-2 shadow-lg bg-body-tertiary"
              />
            </div>
          )}
        </div>
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            class="form-control"
            placeholder="Nhập username ..."
            {...register("username", { required: true })}
          />
          <small class="form-text text-danger">
            {errors.username && <span>Username không được để trống!</span>}
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
              />
              <label class="form-check-label px-3" for="genderFemale">
                Nữ
              </label>
            </div>
          </div>
          <small class="form-text text-danger">
            {errors.gender && <span>Giới tính không được để trống!</span>}
          </small>
        </div>
        <div class="mb-3">
          <label class="form-label">Ngày sinh</label>
          <input
            type="date"
            class="form-control"
            {...register("birthday", { required: true })}
          />
          <small class="form-text text-danger">
            {errors.birthday && <span>Ngày sinh không được để trống!</span>}
          </small>
        </div>
        <div class="mb-3">
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
        
        <button type="submit" class="btn btn-warning mb-3 w-100">
          Cập nhật
        </button>
      </form>
    </>
  );
}

export default CustomerInfoDetail;
