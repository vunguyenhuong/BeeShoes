import { Button, Col, Empty, Input, Modal, Radio, Row, Select, } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function Customer() {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [customerStatus, setCustomerStatus] = useState("");
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    loadData();
  }, [searchValue, pageSize, customerStatus, currentPage, customerStatus]);

  const loadData = async () => {
    try {
      const response = await request.get("/customer", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          deleted: customerStatus,
        },
      });
      setCustomerList(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const handleUpdateStatus = (customer) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <div>
          <p>{`Cập nhật trạng thái ${customer.name} thành ${customer.deleted === false ? "Không hoạt động" : "Hoạt động"
            } ?`}</p>
          {customer.deleted === false ? (
            <Input
              placeholder="Nhập lý do nghỉ việc"
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
          .put(`/customer/${customer.id}`, {
            ...customer,
            deleted:
              customer.deleted === true
                ? (customer.deleted = false)
                : (customer.deleted = true),
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success("Cập nhật thành công!");
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
      <h6>Danh sách khách hàng</h6>
      <Row gutter={10}>
        <Col span={8}>
          <label className="mb-1">Nhập tên, email, số điện thoại</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm khách hàng theo tên, email, sdt ..."
          />
        </Col>
        <Col span={8} className="text-nowrap">
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={""} className="align-middle"
            onChange={(event) => setCustomerStatus(event.target.value)}
          >
            <Radio value={""}>Tất cả</Radio>
            <Radio value={false}>Hoạt động</Radio>
            <Radio value={true}>Không hoạt động</Radio>
          </Radio.Group>
        </Col>
        <Col span={4}>
          <div className="mb-1">Số bản ghi</div>
          <Select
            defaultValue={3}
            style={{ width: "100%" }}
            onChange={(value) => setPageSize(value)}
            options={[{ value: 3 }, { value: 5 }, { value: 10 }, { value: 15 }]}
          />
        </Col>
        <Col span={4}>
          <div className="mb-1">‍</div>
          <Link to={"/admin/customer/add"}>
            <Button type="primary" className="bg-warning">
              <i className="fas fa-plus-circle me-1"></i>Thêm khách hàng
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="table-responsive mt-3">
        <table className="table table-borderless table-striped  align-middle">
          <thead className="fw-semibold table-secondary">
            <tr>
              <td>#</td>
              <td>Tên</td>
              <td>Email</td>
              <td>SĐT</td>
              <td>Ngày tham gia</td>
              <td>Trạng thái</td>
              <td>Thao tác</td>
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
              customerList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    <FormatDate date={item.createAt} />
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateStatus(item)}
                      class={`btn btn-sm border-0 fw-semibold ${item.deleted === true ? "text-danger" : "text-success"
                        }`}
                    >
                      {item.deleted === true ? "Không hoạt động" : "Hoạt động"}
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
    </BaseUI>
  );
}

export default Customer;
