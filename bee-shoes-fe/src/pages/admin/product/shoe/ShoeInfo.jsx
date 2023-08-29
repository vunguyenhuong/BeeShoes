import { Button, Empty, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [imageUpdate, setImageUpdate] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeRow, setActiveRow] = useState(0);
  const fields = ["code", "quantity", "price", "weight"];

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const productData = await request.get(`/shoe/${id}`);
      const productDetailData = await request.get(
        `/shoe-detail/findByShoe/${id}`
      );
      setProduct(productData.data);
      setListProductDetail(productDetailData.data);
      setProductDetail(productDetailData.data[0]);
      if (productDetailData.data.length !== 0) {
        fields.map((item) =>
          setValue(item, productDetailData.data[0].shoeDetail[item])
        );
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const loadData = async (index) => {
    const productData = await request.get(`/shoe/${id}`);
    const productDetailData = await request.get(
      `/shoe-detail/findByShoe/${id}`
    );
    setProduct(productData.data);
    setListProductDetail(productDetailData.data);
    if (productData.data !== 0) {
      setProductDetail(productDetailData.data[index]);
    }
  };

  const handleRowClick = (index) => {
    setActiveRow(index);
    setProductDetail(listProductDetail[index]);
    fields.map((item) =>
      setValue(item, listProductDetail[index].shoeDetail[item])
    );
  };

  const handleDeleteImage = (id, index) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa hình ảnh ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .delete(`/images/${id}`)
          .then((response) => {
            if (response.status === 200) {
              message.success("Xóa thành công!");
              loadData(index);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };

  const handleImageChange = (e) => {
    setImageUpdate(e)
  };

  var dataUpdate =
    listProductDetail.length !== 0 ? { ...productDetail.shoeDetail } : "";
  const handleChangeSize = async (value) => {
    await request.get(`/size/${value}`).then((response) => {
      dataUpdate.size = response.data;
    });
  };
  const handleChangeColor = async (value) => {
    await request.get(`/color/${value}`).then((response) => {
      dataUpdate.color = response.data;
    });
  };
  const handleChangeSole = async (value) => {
    await request.get(`/sole/${value}`).then((response) => {
      dataUpdate.sole = response.data;
    });
  };

  const handleUpdate = (data) => {
    dataUpdate.code = data.code;
    dataUpdate.price = data.price;
    dataUpdate.quantity = data.quantity;
    dataUpdate.weight = data.weight;
    console.log(dataUpdate);
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận sửa phiên bản ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .put(`/shoe-detail/${dataUpdate.id}`, dataUpdate)
          .then((response) => {
            if (response.status === 200) {
              message.success("Cập nhật thành công!");
              loadData(activeRow);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };

  const handleDeleteShoeDetail = () => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác xóa sửa phiên bản ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        message.success("Test!");
        // request
        //   .put(`/shoe-detail/${dataUpdate.id}`, dataUpdate)
        //   .then((response) => {
        //     if (response.status === 200) {
        //       message.success("Cập nhật thành công!");
        //       loadData(activeRow);
        //     }
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //   });
      },
    });
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
                  onClick={() => handleDeleteShoeDetail()}
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
                  <h6>Phiên bản {`(${listProductDetail.length})`}</h6>
                </div>
                <div class="card-body m-0 p-0">
                  <div class="table-responsive">
                    <table class="table pb-0 mb-0">
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
                                [{item.shoeDetail.size.name} -
                                {item.shoeDetail.color.name} -{" "}
                                {item.shoeDetail.sole.name}]
                              </td>
                              <td>{item.shoeDetail.quantity}</td>
                              <td>{item.shoeDetail.price}</td>
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
                        onClick={() => handleDeleteShoeDetail()}
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
                      Tên phiên bản: {productDetail.shoeDetail.shoe.name} -{" "}
                      {productDetail.shoeDetail.code} [
                      {productDetail.shoeDetail.size.name} -{" "}
                      {productDetail.shoeDetail.color.name} -{" "}
                      {productDetail.shoeDetail.sole.name}]
                      <div className="row mt-3">
                        <form
                          className="row p-0 m-0"
                          id="formUpdate"
                          onSubmit={handleSubmit(handleUpdate)}
                        >
                          <div class="mb-3 col-xl-12">
                            <label class="form-label">Mã phiên bản</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              {...register("code", { required: true })}
                            />
                            <small class="form-text text-danger">
                              {errors.code && (
                                <span>Mã không được để trống!</span>
                              )}
                            </small>
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Số lượng</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              {...register("quantity", { required: true })}
                            />
                            <small class="form-text text-danger">
                              {errors.quantity && (
                                <span>Số lượng không được để trống!</span>
                              )}
                            </small>
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Đơn giá</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              {...register("price", { required: true })}
                            />
                            <small class="form-text text-danger">
                              {errors.price && (
                                <span>Đơn giá không được để trống!</span>
                              )}
                            </small>
                          </div>
                          <div class="mb-3 col-xl-4">
                            <label class="form-label">Cân nặng</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              {...register("weight", { required: true })}
                            />
                            <small class="form-text text-danger">
                              {errors.weight && (
                                <span>Cân nặng không được để trống!</span>
                              )}
                            </small>
                          </div>
                        </form>

                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Kích cỡ"}
                            name={"size"}
                            url={"/size"}
                            selected={productDetail.shoeDetail.size.id}
                            onChange={handleChangeSize}
                          />
                        </div>
                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Màu sắc"}
                            name={"color"}
                            url={"/color"}
                            selected={productDetail.shoeDetail.color.id}
                            onChange={handleChangeColor}
                          />
                        </div>
                        <div className="mb-3 col-xl-4">
                          <SelectField
                            label={"Đế giày"}
                            name={"sole"}
                            url={"/sole"}
                            selected={productDetail.shoeDetail.sole.id}
                            onChange={handleChangeSole}
                          />
                        </div>
                        <div className="col-xl-4">
                          <label class="form-label">QR code phiên bản</label>
                          <div className="mt-2">
                            <QRCode
                              value={`${productDetail.shoeDetail.code}`}
                              size={256}
                              className="w-100 h-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-8">
                          <label class="form-label">
                            Hình ảnh {productDetail.imagesList.length}
                          </label>
                          <div className="d-flex flex-wrap">
                            {productDetail.imagesList.map((image, index) => (
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
                                    onClick={() =>
                                      handleDeleteImage(image.id, index)
                                    }
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
