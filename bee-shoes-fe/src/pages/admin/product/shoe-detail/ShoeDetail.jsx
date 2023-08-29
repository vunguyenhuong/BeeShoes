import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SelectFilter from "~/components/Admin/Product/SelectFilter";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";

function ShoeDetail() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [listCate, setListCate] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);

  const [selectedCate, setSelectedCate] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSole, setSelectedSole] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const [minPriceValue, setMinPriceValue] = useState(null);
  const [maxPriceValue, setMaxPriceValue] = useState(null);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  // detailImages
  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    request
      .get("/category")
      .then((response) => {
        setListCate(response);
      })
      .catch((error) => {
        console.log(error);
      });
    request
      .get("/brand")
      .then((response) => {
        setListBrand(response);
      })
      .catch((error) => {
        console.log(error);
      });
    request
      .get("/size")
      .then((response) => {
        setListSize(response);
      })
      .catch((error) => {
        console.log(error);
      });
    request
      .get("/color")
      .then((response) => {
        setListColor(response);
      })
      .catch((error) => {
        console.log(error);
      });
    request
      .get("/sole")
      .then((response) => {
        setListSole(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    request
      .get("/shoe-detail", {
        params: {
          name: searchValue,
          page: currentPage,
          pageSize: pageSize,
          category: selectedCate,
          brand: selectedBrand,
          size: selectedSize,
          color: selectedColor,
          sole: selectedSole,
          minPrice: minPriceValue,
          maxPrice: maxPriceValue,
        },
      })
      .then((response) => {
        setProductList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage, selectedCate,selectedBrand,selectedSize,selectedColor,selectedSole,pageSize,searchValue,
    minPriceValue,
    maxPriceValue
  ]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const changeCategory = (value) => {
    setSelectedCate(value);
  };
  const changeBrand = (value) => {
    setSelectedBrand(value);
  };
  const changeSize = (value) => {
    setSelectedSize(value);
  };
  const changeSole = (value) => {
    setSelectedSole(value);
  };
  const changeColor = (value) => {
    setSelectedColor(value);
  };
  const handleChangePageSize = (e) => {
    setPageSize(e.target.value);
  };
  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClickDetailImage = (id) => {
    request.get(`/images/${id}`).then((response) => {
      setListImage(response);
      console.log(response);
    });
  };
  return (
    <BaseUI>
    <h6 className="fw-bold">Danh sách sản phẩm</h6>
      <div className="">
        <div className="d-flex">
          <div className="p-2 flex-grow-1">
            <input
              className="form-control form-control-sm me-2"
              name="ten"
              type="search"
              defaultValue={""}
              placeholder="Tìm kiếm sản phẩm theo tên ..."
              onChange={(event) => handleChangeSearchValue(event)}
            />
          </div>
          <div className="p-2">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập giá tối thiểu..."
                onChange={(event) => setMinPriceValue(event.target.value)}
              />
              <span className="input-group-text bg-warning-subtitle">đến</span>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập giá tối đa..."
                onChange={(event) => setMaxPriceValue(event.target.value)}
              />
            </div>
          </div>
          <div className="p-2">
            <select
              className="form-select form-select-sm"
              onChange={(event) => handleChangePageSize(event)}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="p-2">
            <Link
              type="button"
              className="btn btn-warning btn-sm"
              to={"/admin/product/add"}
            >
              <i className="fas fa-plus-circle"></i> Thêm sản phẩm
            </Link>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          <SelectFilter
            items={listCate}
            label={"Danh mục"}
            handleChange={changeCategory}
          />
          <SelectFilter
            items={listBrand}
            label={"Thương hiệu"}
            handleChange={changeBrand}
          />
          <SelectFilter
            items={listSize}
            label={"Kích cỡ"}
            handleChange={changeSize}
          />
          <SelectFilter
            items={listColor}
            label={"Màu sắc"}
            handleChange={changeColor}
          />
          <SelectFilter
            items={listSole}
            label={"Đế giày"}
            handleChange={changeSole}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm">
            <thead className="bg-danger">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Danh mục</th>
                <th scope="col">Thương hiệu</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {totalPages === 0 ? (
              <tr className="text-center fw-semibold">
                <td colSpan={8}>
                  <Empty/>
                </td>
              </tr>
            ) : (
              productList.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    {item.shoe.name} [{item.color.name} - {item.size.name}]
                  </td>
                  <td>{item.quantity}</td>
                  <td><FormatCurrency value={item.price}/></td>
                  <td>{item.shoe.category.name}</td>
                  <td>{item.shoe.brand.name}</td>
                  <td>
                  <span class={`badge ${item.deleted === true ? 'bg-danger' : 'bg-primary'}`}>{item.deleted === true ? "Ngùng bán" : "Đang bán"}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#imagesModal"
                      onClick={() => handleClickDetailImage(item.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <Link
                      to={`/admin/product/${item.id}`}
                      className="btn btn-sm text-warning"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleChange={handlePageChange}
        />
      </div>

      <div
        className="modal fade"
        id="imagesModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Hình ảnh sản phẩm
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {listImage.map((item) => (
                  <div className="col-xl-4">
                    <img
                      width={"100%"}
                      src={item.name}
                      className="object-fit-cover h-100"
                      alt="..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseUI>
  );
}

export default ShoeDetail;
