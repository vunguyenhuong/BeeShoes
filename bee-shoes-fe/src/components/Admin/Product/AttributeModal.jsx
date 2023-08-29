import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";

function AttributeModal({
  nameModal,
  options,
  selectedOptions,
  setSelectedOptions,
  url,
  onAddSuccess,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleToggleOption = (item) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(item)
        ? prevOptions.filter((option) => option !== item)
        : [...prevOptions, item]
    );
  };

  const onSubmit = (data) => {
    request.post(url, data).then((response) => {
      if (response.status === 201) {
        toast.success("Thêm thành công!");
        onAddSuccess();
      }
    }).catch(e => {
      console.log(e);
      if(e.response.status === 409) toast.error(`Thuộc tính ${e.response.data.name} đã tồn tại!`)
    })
  };
  return (
    <>
      <button
        type="button"
        class="btn btn-outline-primary ms-3 mb-3"
        data-bs-toggle="modal"
        data-bs-target={`#${nameModal}Modal`}
      >
        <i className="fas fa-plus"></i>
      </button>
      <div
        class="modal fade"
        id={`${nameModal}Modal`}
        data-bs-backdrop="static"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Giá trị thuộc tính</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="row">
                <div class="mb-3 col-xl-8">
                  <form
                    id={`${nameModal}Form`}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <input
                      type="text"
                      class="form-control form-control-sm w-100"
                      placeholder="Nhập giá trị thuộc tính..."
                      {...register("name", { required: true })}
                    />
                    <small id="helpId" className="form-text text-muted">
                      {errors.name && "Không được để trống!"}
                    </small>
                  </form>
                </div>
                <div className="col-xl-4">
                  <button
                    type="submit"
                    form={`${nameModal}Form`}
                    class="btn btn-sm btn-warning w-100"
                  >
                    Thêm
                  </button>
                </div>
                {options.map((item) => (
                  <div className="col-xl-3 mb-3 text-center">
                    <button
                      type="button"
                      className={`btn btn-outline-warning ${
                        selectedOptions.includes(item) ? "active" : ""
                      }`}
                      data-bs-toggle="button"
                      onClick={() => handleToggleOption(item)}
                    >
                      {item.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttributeModal;
