import { Empty, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Loading from "~/components/Loading/Loading";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function Customer() {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [staffStatus, setStaffStatus] = useState("");
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    loadData();
  }, [searchValue, pageSize, staffStatus, currentPage]);

  const loadData = async () => {
    try {
      const response = await request.get("/customer", {
        params: {
          value: searchValue,
          page: currentPage,
          pageSize: pageSize,
          status: staffStatus,
        },
      });
      setStaffList(response.content);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePageSize = (e) => {
    setPageSize(e.target.value);
  };
  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };
  const handleChangeStatus = (e) => {
    setStaffStatus(e.target.value);
    console.log(e.target.value);
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const handleUpdateStatus = (staff) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <div>
          <p>{`Xác nhận ${staff.name} ${
            staff.deleted === false ? "kích hoạt" : "hủy kích hoạt"
          } tài khoản này ? ?`}</p>
          {staff.deleted === false ? (
            <Input
              placeholder="Nhập lý do hủy kích hoạt"
              onChange={(e) => console.log(e.target.value)}
            />
          ) : (
            ""
          )}
        </div>
      ),
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .put(`/customer/${staff.id}`, {
            ...staff,
            deleted:
              staff.deleted === true
                ? (staff.deleted = false)
                : (staff.deleted = true),
          })
          .then((response) => {
            if (response.status === 200) {
              message.success("Cập nhật thành công!");
              loadData();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
    });
  };

  return (
    <BaseUI>
      <div className="">
        <h6>Danh sách khách hàng</h6>
        <div className="d-flex align-items-center">
          <div className="p-2 flex-grow-1">
            <label className="mb-1">Nhập tên, email, số điện thoại: </label>
            <input
              className="form-control form-control-sm me-2"
              name="ten"
              type="search"
              defaultValue={""}
              placeholder="Tìm kiếm khách hàng theo tên, email ..."
              onChange={(event) => handleChangeSearchValue(event)}
            />
          </div>
          <div className="p-2">
            <label className="mb-1">Trạng thái: </label>
            <div className="">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="status"
                  id="statusAll"
                  value=""
                  onChange={(event) => handleChangeStatus(event)}
                  defaultChecked={true}
                />
                <label class="form-check-label" for="statusAll">
                  Tất cả
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="status"
                  id="statusOnline"
                  value="false"
                  onChange={(event) => handleChangeStatus(event)}
                />
                <label class="form-check-label" for="statusOnline">
                  Kích hoạt
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="status"
                  id="statusOffline"
                  value="true"
                  onChange={(event) => handleChangeStatus(event)}
                />
                <label class="form-check-label" for="statusOffline">
                  Hủy kích hoạt
                </label>
              </div>
            </div>
          </div>
          <div className="p-2">
            <label className="mb-1">Số bản ghi: </label>
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
            <label className="mb-1">ㅤ</label>
            <div className="">
              <Link
                type="button"
                className="btn btn-warning btn-sm"
                to={"/admin/customer/add"}
              >
                <i className="fas fa-plus-circle"></i> Thêm khách hàng
              </Link>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm">
            <thead className="">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {totalPages === 0 ? (
                <tr className="text-center fw-semibold">
                  <td colSpan={8}>
                    <Empty />
                  </td>
                </tr>
              ) : (
                staffList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <FormatDate date={item.createAt} />
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdateStatus(item)}
                        class={`btn btn-sm border-0 fw-semibold ${
                          item.deleted === true ? "text-danger" : "__bee-text"
                        }`}
                      >
                        {item.deleted === true ? "Hủy kích hoạt" : "Kích hoạt"}
                      </button>
                    </td>
                    <td>
                      <Link
                        to={`/admin/customer/${item.id}`}
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
    </BaseUI>
  );
}

export default Customer;
