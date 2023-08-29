import { Button, Carousel } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import FormatCurrency from "~/utils/FormatCurrency";
import httpRequest from "~/utils/httpRequest";
import ModalDetail from "./ModalDetail";

function DetailProduct() {
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const color = searchParams.get("color");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      httpRequest
        .get(`/shoe/v1/${id}`)
        .then((resposne) => {
          setItem(resposne.data);
          console.log(resposne);
          console.log(color);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }, 800);
    return () => clearTimeout(timeout);
  }, [id]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {color !== null ? ("xxx") : (
        <div className="row">
        {item.map((shoe, index) => (
          <div className="col-xl-4 text-center">
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
            <h5 className="mt-3">{shoe.name}</h5>
            <p className="text-danger fw-semibold">
              <FormatCurrency value={shoe.minPrice} /> -{" "}
              <FormatCurrency value={shoe.maxPrice} />
            </p>
            <div className="mt-5">
              <ModalDetail shoe={shoe}></ModalDetail>
            </div>
          </div>
        ))}
      </div>
      )}
    </>
  );
}

export default DetailProduct;
