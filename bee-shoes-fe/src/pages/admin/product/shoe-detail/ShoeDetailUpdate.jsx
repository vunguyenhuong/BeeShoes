import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Link, useParams } from "react-router-dom";
import SelectField from "~/components/Admin/Product/SelectField";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function ShoeDetailUpdate() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listImages, setListImages] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      loadSize();
      loadColor();
      loadListImages();
      request
        .get(`/shoe-detail/${id}`)
        .then((response) => {
          setProduct(response);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }, 800);
    return () => clearTimeout(timeout);
  }, [id]);

  const loadListImages = async () => {
    await request
      .get(`images/${id}`)
      .then((response) => {
        setListImages(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadSize = async () => {
    await request
      .get("/size")
      .then((response) => {
        setSize(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadColor = async () => {
    await request
      .get("/color")
      .then((response) => {
        setColor(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeSize = (value) => {
    request
      .get(`/size/${value}`)
      .then((response) => {
        setSelectedSize(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChangeColor = (value) => {
    request
      .get(`/color/${value}`)
      .then((response) => {
        setSelectedColor(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }
  return (
    <>
      <BaseUI>
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/product"}
          >
            Danh sách sản phẩm
          </Link>
          <span className="breadcrumb-item">
            {product.shoe.name} [{product.color.name} - {product.size.name}]
          </span>
        </nav>
        <div className="card rounded-0">
          <div className="card-header bg-secondary-subtle">
            <h6 className="card-title">Thông tin sản phẩm</h6>
          </div>
          <div className="card-body">
            <div className="row small">
              <div className="col-xl-4">
                <p>
                  <strong>Danh mục: </strong> {product.shoe.category.name}
                </p>
                <p>
                  <strong>Thương hiệu: </strong> {product.shoe.brand.name}
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>Người tạo: </strong> {product.shoe.createBy}
                </p>
                <p>
                  <strong>Người chỉnh sửa: </strong> {product.shoe.updateBy}
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>Ngày tạo: </strong>
                  <FormatDate date={product.shoe.createAt} />
                </p>
                <p>
                  <strong>Ngày cập nhật cuối: </strong>
                  <FormatDate date={product.shoe.updateAt} />
                </p>
              </div>
            </div>
          </div>
        </div>
        <h5 className="mt-3">Chi tiết sản phẩm</h5>
        <div className="card rounded-0">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-4">
                <label className="mb-2">Kích cỡ:</label>
                <SelectField
                  label={"Kích cỡ"}
                  name={"size"}
                  url={"/size"}
                  options={size}
                  onAddSuccess={loadSize}
                  onChange={handleChangeSize}
                  selected={product.size.id}
                />
              </div>
              <div className="col-xl-4">
                <label className="mb-2">Màu sắc:</label>
                <SelectField
                  label={"Màu sắc"}
                  name={"color"}
                  url={"/color"}
                  options={color}
                  onAddSuccess={loadColor}
                  onChange={handleChangeColor}
                  selected={product.color.id}
                />
              </div>
              <div className="col-xl-4">
                <label className="mb-2">Cân nặng:</label>
                <input
                  type="text"
                  defaultValue={product.weight}
                  className="form-control"
                />
              </div>
              <div className="col-xl-4">
                <label className="mb-2">Đơn giá:</label>
                <input
                  type="text"
                  defaultValue={product.price}
                  className="form-control"
                />
              </div>
              <div className="col-xl-2">
                <label className="mb-2">Số lượng:</label>
                <input
                  type="text"
                  defaultValue={product.quantity}
                  className="form-control"
                />
              </div>
              <div className="col-xl-6">
                <label className="mb-2">Trạng thái:</label>
                <div className="">
                  <div className="form-check form-check-inline col-xl-6">
                    <input
                      className="form-check-input"
                      type="radio"
                      value={false}
                      defaultChecked={!product.deleted}
                    />
                    <label className="form-check-label">Kích hoạt</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      value={true}
                      defaultChecked={product.deleted}
                    />
                    <label className="form-check-label">Hủy kích hoạt</label>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 mt-3">
                <label className="mb-2">QR Code sản phẩm:</label>
                <div className="mt-2">
                  <QRCode
                    value={`${product.code}`}
                    size={256}
                    style={{ height: "64px", width: "64px" }}
                  />
                </div>
              </div>
              <div className="col-xl-8 mt-3">
                <label className="mb-2">Hình ảnh:</label>
                <div className="row">
                  {listImages.map((item) => (
                    <div className="col-xl-3" key={item.id}>
                      <img src={item.name} alt="img" width={"100%"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseUI>
    </>
  );
}

export default ShoeDetailUpdate;
