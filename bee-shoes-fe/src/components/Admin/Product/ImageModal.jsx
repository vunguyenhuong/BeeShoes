import { Empty, Modal } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";

function ImageModal({ colorName, sttModal, handleChange }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadImage(colorName);
  }, [colorName]);

  const loadImage = (colorFolder) => {
    request.get(`/image-gallery/${colorFolder}`).then((response) => {
      setListImage(response);
    }).catch((e) => {
      console.log(e);
    });
  }

  const handleImageSelect = (event) => {
    const imageUrl = event.target.value;
    if (event.target.checked) {
      if (selectedImages.length >= 3) {
        toast.error("Chỉ được chọn tối đa 3 hình ảnh!");
        event.target.checked = false;
      } else {
        setSelectedImages((prevSelectedImages) => [
          ...prevSelectedImages,
          imageUrl,
        ]);
      }
    } else {
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter((url) => url !== imageUrl)
      );
    }
  };

  useEffect(() => {
    handleChange(colorName, sttModal, selectedImages);

  }, [selectedImages]);

  const handleUploadImage = (event) => {
    const fileList = event.target.files;
    const formData = new FormData();
    let validImages = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith("image/")) {
        formData.append("images", file);
        validImages.push(file);
      } else {
        toast.error(`Tệp ${file.name} không phải là ảnh và sẽ không được thêm.`);
      }
    }
    if (validImages.length > 0) {
      swal({
        title: `Xác nhận thêm ${validImages.length} ảnh ?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          setLoading(true);
          formData.append("folder", colorName);
          await request.post('/image-gallery', formData, { headers: { "Content-Type": "multipart/form-data", }, }).then(response => {
            toast.success("Thêm thành công!");
            loadImage(colorName);
            setLoading(false);
          }).catch(e => {
            console.log(e);
          })
        }
      });
    } else {
      toast.error("Không tìm thấy ảnh hợp lệ!");
    }
  }
  return (
    <>
      <button
        type="button"
        class="btn border-0 btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal${sttModal}`}
      >
        <i className="fas fa-image"></i>
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
                    <h6>Danh sách ảnh các sản phẩm màu {colorName.toLowerCase()}</h6>
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
                        accept="image/*"
                        className="position-absolute opacity-0"
                        style={{ width: "100%", height: "100%" }}
                        onChange={(event) => handleUploadImage(event)}
                      />
                    </button>
                  </div>
                </div>
                {loading ? <Loading /> : (
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
                )}
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageModal;
