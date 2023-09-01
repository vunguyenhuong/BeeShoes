import { Button, Empty, Input, Modal, message } from "antd";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Link, useParams } from "react-router-dom";
import ImageModalUpdate from "~/components/Admin/Product/ImageModalUpdate";
import SelectField from "~/components/Admin/Product/SelectField";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import request from "~/utils/httpRequest";

function ShoeInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [imageUpdate, setImageUpdate] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const productData = await request.get(`/shoe/${id}`);
      const productDetailData = await request.get(`/shoe-detail`, {params: {shoe: id}});
      setProduct(productData.data);
      setListProductDetail(productDetailData.data.data);
      setProductDetail(productDetailData.data.data[0]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const handleRowClick = (index) => {
    setActiveRow(index);
    setProductDetail(listProductDetail[index]);
  };

  const handleImageChange = (e) => {
    setImageUpdate(e)
  };

  

  const handleUpdateImage = () => {
    console.log(imageUpdate)
    setImageUpdate([]);
    console.log(imageUpdate)
  }

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
          <span className="breadcrumb-item">{product.name}</span>
        </nav>
        {/* Thông tin chung sản phẩm */}
        <div className="card rounded-0">
          <div className="card-header border-0 rounded-0">
            <div className="d-flex">
              <div className="flex-grow-1">
                <h6 className="card-title">Thông tin sản phẩm</h6>
              </div>
              <div className="me-1">
                <button
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="">
                <button
                  className="btn btn-warning btn-sm"
                >
                  <i className="fas fa-edit"></i> Sửa sản phẩm
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-xl-4">
                <p>
                  <strong>Danh mục: </strong> {product.category.name}
                </p>
                <p>
                  <strong>Thương hiệu: </strong> {product.brand.name}
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>Người tạo: </strong> {product.createBy}
                </p>
                <p>
                  <strong>Người chỉnh sửa: </strong> {product.updateBy}
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>Ngày tạo: </strong>
                  <FormatDate date={product.createAt} />
                </p>
                <p>
                  <strong>Ngày cập nhật cuối: </strong>
                  <FormatDate date={product.updateAt} />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Thông tin chi tiết */}
        <div className="mt-3">
          <h5>Chi tiết phiên bản</h5>
          <div class="row">
            <div class="col-4">
              <div class="card rounded-0">
                <div className="card-header border-0 rounded-0">
                  <h6>Phiên bản </h6>
                </div>
                <div class="card-body m-0 p-0">
                  <div class="table-responsive">
                    <table class="table pb-0 mb-0 table-borderless">
                      {listProductDetail.length === 0 ? (
                        <Empty />
                      ) : (
                        <tbody>
                          {listProductDetail.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                activeRow === index ? "table-warning" : ""
                              }
                              onClick={() => handleRowClick(index)}
                            >
                              <td>
                                [{item.size.name} -
                                {item.color.name} -{" "}
                                {item.sole.name}]
                              </td>
                              <td>{item.quantity}</td>
                              <td>{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                  <div className="text-center">
                    <Button
                      icon={<i className="fas fa-plus-circle"></i>}
                      className="w-100 bg-warning text-black rounded-0"
                    >
                      Thêm phiên bản
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="card rounded-0">
                <div className="card-header rounded-0 border-0">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h6>Thông tin chi tiết phiên bản</h6>
                    </div>
                    <div className="me-1">
                      <button
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="btn btn-warning btn-sm"
                        type="submit"
                        form="formUpdate"
                      >
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  {listProductDetail.length === 0 ? (
                    <Empty />
                  ) : (
                    <div className="">
                      Tên phiên bản: {productDetail.shoe.name} -{" "}
                      {productDetail.code} [
                      {productDetail.size.name} -{" "}
                      {productDetail.color.name} -{" "}
                      {productDetail.sole.name}]
                      <div className="row mt-3">
                        <form
                          className="row p-0 m-0"
                          id="formUpdate"
                        >
                          <div class="mb-3 col-xl-12">
                            <label class="form-label">Mã phiên bản</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Số lượng</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Đơn giá</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Cân nặng</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                            />
                          </div>
                        </form>

                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Kích cỡ"}
                            name={"size"}
                            url={"/size"}
                            selected={productDetail.size.id}
                          />
                        </div>
                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Màu sắc"}
                            name={"color"}
                            url={"/color"}
                            selected={productDetail.color.id}
                          />
                        </div>
                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Đế giày"}
                            name={"sole"}
                            url={"/sole"}
                            selected={productDetail.sole.id}
                          />
                        </div>
                        <div className="col-xl-4">
                          <label class="form-label">QR code phiên bản</label>
                          <div className="mt-2">
                            <QRCode
                              value={`${productDetail.code}`}
                              size={256}
                              className="w-100 h-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-8">
                          <label class="form-label">
                            Hình ảnh
                          </label>
                          <div className="d-flex flex-wrap">
                            {productDetail.images.map((image, index) => (
                              <div
                                className="position-relative me-2 mt-2"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                }}
                              >
                                <img
                                  src={image.name}
                                  alt="images"
                                  width={100}
                                  height={100}
                                  className="object-fit-cover border border-warning"
                                />
                                <div className="position-absolute end-0 top-0">
                                  <button
                                    type="button"
                                    class="btn btn-sm border-0 text-danger"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}

                            <div
                              style={{ width: "100px", height: "100px" }}
                              className="position-relative rounded-0 
                            border border-warning d-flex align-items-center 
                            justify-content-center mt-2"
                            >
                              <ImageModalUpdate sttModal={0} handleChange={handleImageChange} handleUpdateImage={handleUpdateImage}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseUI>
    </>
  );
}

export default ShoeInfo;
