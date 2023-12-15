import axios from "axios";
import React, { useEffect, useState } from "react";

function ImagesGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Thay thế các thông tin bên dưới bằng API Key, API Secret và Cloud Name của bạn.
    const apiKey = "532144793489458";
    const apiSecret = "ybMZlE8rrX5AYNg_-wi_C1r6g8A";
    const cloudName = "beeshoes";
    const folder = "products"; // Tên thư mục chứa ảnh bạn muốn lấy.

    // Gọi API của Cloudinary để lấy danh sách ảnh từ thư mục cụ thể
    axios
      .get(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
        params: {
          type: "upload",
          prefix: `${folder}/`, // Đặt tiền tố của tên thư mục, nếu muốn lấy từ tất cả các thư mục, hãy để trống.
          api_key: apiKey,
          api_secret: apiSecret,
        },
      })
      .then((response) => {
        setImages(response.data.resources);
      })
      .catch((error) => {
        console.error("Error fetching images: ", error);
      });
  }, []);

  return (
    <>
      <button
        type="button"
        class="btn"
        data-bs-toggle="modal"
        data-bs-target="#modalId"
      >
        + Thêm hình ảnh
      </button>

      <div
        class="modal fade"
        id="modalId"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitleId">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                {images.map((image) => (
                  <img
                    key={image.public_id}
                    src={image.secure_url}
                    alt={image.public_id}
                    style={{ width: "150px", height: "auto", margin: "5px" }}
                  />
                ))}
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
              <button type="button" class="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImagesGallery;
