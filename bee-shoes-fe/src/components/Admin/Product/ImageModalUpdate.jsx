import { Empty } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as request from "~/utils/httpRequest";

function ImageModalUpdate({ sttModal, handleChange }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [listImage, setListImage] = useState([]);
  useEffect(() => {
    request
      .get(`/image-gallery/products`)
      .then((response) => {
        setListImage(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleImageSelect = (event) => {
    const imageUrl = event.target.value;
    if (event.target.checked) {
      setSelectedImages((prevSelectedImages) => [
        ...prevSelectedImages,
        imageUrl,
      ]);
    } else {
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter((url) => url !== imageUrl)
      );
    }
  };

  useEffect(() => {
    handleChange(selectedImages);
    // console.log(selectedImages);
  }, [selectedImages]);

  return (
    <>
      <button
        type="button"
        class="btn border-0 btn-sm"
        style={{ width: "100px", height: "100px" }}
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal${sttModal}`}
      >
        <i className="fas fa-plus"></i>
      </button>

      <div
        class="modal fade modal-lg"
        id={`exampleModal${sttModal}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Chọn hình ảnh
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="">
                <h6>Danh sách ảnh của sản phẩm</h6>
                <div className="row overflow-auto text-center">
                  {selectedImages.length === 0 ? (
                    <div className="container">
                      <Empty />
                    </div>
                  ) : (
                    selectedImages.map((image, index) => (
                      <div className="col-xl-2 position-relative" key={index}>
                        <img
                          src={image}
                          alt="img"
                          width={"100%"}
                          height={150}
                          className="object-fit-lg-scale border border-1 mb-3"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="">
                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1">
                    <h6>Danh sách ảnh hiện có</h6>
                  </div>
                  <div className="">
                    <button
                      className="position-relative d-flex align-items-center 
                            justify-content-center btn btn-warning btn-sm"
                    >
                      <i className="fas fa-plus"></i> Thêm ảnh vào hệ thống
                      <input
                        type="file"
                        multiple
                        className="position-absolute opacity-0"
                        style={{ width: "100%", height: "100%" }}
                        // onChange={(event) => }
                      />
                    </button>
                  </div>
                </div>
                <div
                  className="row overflow-auto text-center"
                  style={{ height: "250px" }}
                >
                  {listImage.map((image, index) => (
                    <div className="col-xl-2 position-relative" key={index}>
                      <label htmlFor={`check${sttModal}Img${index}`}>
                        <img
                          src={image.url}
                          alt="img"
                          width={"100%"}
                          height={150}
                          className="object-fit-lg-scale border border-1 mb-3"
                        />
                      </label>
                      <div className="position-absolute top-0">
                        <input
                          type="checkbox"
                          id={`check${sttModal}Img${index}`}
                          name="imageSelect"
                          value={image.url}
                          onChange={handleImageSelect}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button type="button" class="btn btn-warning">Thêm</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageModalUpdate;
