import { Col, Divider, Empty, Modal, Row } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as request from "~/utils/httpRequest";

function ImageModalUpdate({ sttModal, handleChange }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [listImage, setListImage] = useState([]);

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
        onClick={showModal}
      >
        <i className="fas fa-plus"></i>
      </button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={800}>
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
        <Divider/>
        <Row gutter={10}>
        {listImage.map((image, index) => (
          <Col xl={4} key={index}>
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
          </Col>
        ))}
        </Row>
      </Modal>

    </>
  );
}

export default ImageModalUpdate;
