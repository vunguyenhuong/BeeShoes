import { Button, Carousel, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";

function ModalDetail({ shoe }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [size, setSize] = useState("");
  const [sole, setSole] = useState("");
  const [listSize, setListSize] = useState([]);
  const [listSole, setListSole] = useState([]);
  const [productDetail, setProductDetail] = useState();
  const showModal = () => {
    setIsModalOpen(true);
    setSize(null);
    setSole(null);
    setProductDetail(null);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSize(null);
    setSole(null);
    setProductDetail(null);
  };
  useEffect(() => {
    request
      .get("/shoe-detail/v1", {
        params: {
          shoe: shoe.shoeId,
          size: size,
          color: shoe.colorId,
          sole: sole,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [shoe.shoeId, shoe.colorId,size,sole]);
  useEffect(() => {
    request
      .get("/shoe-detail/findSize", {
        params: {
          idShoe: shoe.shoeId,
          idColor: shoe.colorId,
        },
      })
      .then((response) => {
        setListSize(response)
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  },[shoe.shoeId, shoe.colorId])
  useEffect(() => {
    request
      .get("/shoe-detail/findSole", {
        params: {
          idShoe: shoe.shoeId,
          idColor: shoe.colorId,
          idSize: size
        },
      })
      .then((response) => {
        setListSole(response)
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  },[shoe.shoeId, shoe.colorId, size])
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
        width={1000}
      >
        <div className="row">
          <div className="col-xl-4">
            <Carousel autoplay autoplaySpeed={2000} dots={false} arrows={false}>
              {shoe.imagesList.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt="images"
                    style={{ width: "100%", height: "300px" }}
                    className="object-fit-contain"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="col-xl-8">
            <h5 className="mt-3">{shoe.name}</h5>
            <p className="text-danger fw-semibold">
              <FormatCurrency value={shoe.minPrice} /> -{" "}
              <FormatCurrency value={shoe.maxPrice} />
            </p>
            Size: {" "}
            
            <Radio.Group name="size" onChange={(event) => setSize(event.target.value)}>
            {listSize.map((size, i)=>(
              <>
              <Radio value={size.id}>{size.name}</Radio> 
              </>
            ))}
            </Radio.Group>
            <br />
            Đế giày: {" "}
            
            <Radio.Group name="sole" onChange={(event) => setSole(event.target.value)}>
            {listSole.map((sole, i)=>(
              <>
              <Radio value={sole.id}>{sole.name}</Radio> 
              </>
            ))}
            </Radio.Group>
            <div className="row">
            <div className="col-xl-6 mt-5">
            <button type="button" class="btn btn-warning w-100">Mua ngay</button>
            </div>
            <div className="col-xl-6 mt-5">
            <button type="button" class="btn btn-outline-warning w-100">Thêm vào giỏ hàng</button>
            </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalDetail;
