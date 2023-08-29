import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import Pagination from "~/components/Pagination";
import { Link } from "react-router-dom";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";

const Bill = () => {
  const [billList, setBillList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(3);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const handleChangePageSize = (e) => {
    setPageSize(e.target.value);
  };
  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const loadData = () => {
    request
      .get("/bill", {
        params: {
          value: searchValue,
          page: currentPage,
          pageSize: pageSize,
        },
      })
      .then((response) => {
        setBillList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, searchValue]);

  return (
    <BaseUI>
      <div class="">
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/bill"}
          >
            Danh sách hóa đơn
          </Link>
        </nav>
        <div className="d-flex">
          <div className="p-2 flex-grow-1">
            <input
              className="form-control form-control-sm me-2"
              name="code"
              type="search"
              defaultValue={""}
              placeholder="Mã hóa đơn..."
              onChange={(event) => handleChangeSearchValue(event)}
            />
          </div>
          <div className="p-2">
            {/* <div class="input-group input-group-sm">
              <input
                type="text"
                class="form-control"
                placeholder="Nhập giá tối thiểu..."
                onChange={(event) => setMinPriceValue(event.target.value)}
              />
              <span class="input-group-text bg-warning-subtitle">đến</span>
              <input
                type="text"
                class="form-control"
                placeholder="Nhập giá tối đa..."
                onChange={(event) => setMaxPriceValue(event.target.value)}
              />
            </div> */}
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
              class="btn btn-warning btn-sm"
              to={"/admin/order"}
            >
              <i className="fas fa-plus-circle"></i> Tạo đơn hàng
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="">
              <tr>
                <th>#</th>
                <th>Mã HĐ</th>
                <th>Tổng tiền</th>
                <th>Ngày Tạo</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Loại đơn hàng</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {billList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>#{item.code}</td>
                  <td className="fw-semibold text-danger">
                    <FormatCurrency value={item.totalMoney} />
                  </td>
                  <td>
                    <FormatDate date={item.createAt} />
                  </td>
                  <td>
                    {item.customerName === null || item.customerName === "" ? (
                      <span class="badge bg-secondary py-2 rounded-3 w-100">
                        Khách lẻ
                      </span>
                    ) : (
                      item.customerName
                    )}
                  </td>
                  <td>
                    {item.phoneNumber === null ? "Chưa có" : item.phoneNumber}
                  </td>
                  <td>
                    <span
                      class={`badge bg-${
                        item.type === 0
                          ? "success"
                          : item.type === 1
                          ? "primary"
                          : "danger"
                      } py-2 rounded-3 w-100`}
                    >
                      {item.type === 0
                        ? "Tại quầy"
                        : item.type === 1
                        ? "Giao hàng"
                        : "Chưa thanh toán"}
                    </span>
                  </td>
                  <td className="">
                    <span class="badge bg-secondary py-2 rounded-3 w-100 text-wrap">
                      {item.status === 1
                        ? " Tạo đơn hàng"
                        : item.status === 2
                        ? " Chờ xác nhận"
                        : item.status === 3
                        ? " Xác nhận thông tin thanh toán"
                        : item.status === 4
                        ? " Chờ giao"
                        : item.status === 5
                        ? " Đang giao"
                        : item.status === 6
                        ? " Hoàn thành"
                        : item.status === 7
                        ? " Hủy"
                        : " Chờ thanh toán"}
                    </span>
                  </td>
                  <td>
                    <Link
                      type="button"
                      class="btn btn-sm border-0"
                      to={`/admin/bill/${item.id}`}
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChange={handlePageChange}
      />
    </BaseUI>
  );
};

export default Bill;
