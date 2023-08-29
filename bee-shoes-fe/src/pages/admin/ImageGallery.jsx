import React, { useEffect, useState } from "react";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function ImageGallery() {
  const [listImages, setListImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(async () => {
    await request
      .get(`/image-gallery/products`)
      .then((response) => {
        setListImages(response);
      })
      .catch((e) => {
        console.log(e);
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <BaseUI>
    <h5>Thư viện hình ảnh</h5>
    {loading === true ? <Loading/> : (
        <div className="row">
        {listImages.map((item, index) => (
          <div className="col-xl-3 mb-3" key={index}>
            <img src={item.url} alt="" width={"100%"} height={"300px"} className="object-fit-contain"/>
          </div>
        ))}
      </div>
    )}
    </BaseUI>
  );
}

export default ImageGallery;
