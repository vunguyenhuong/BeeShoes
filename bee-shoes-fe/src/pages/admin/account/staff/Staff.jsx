import {
  Button,
  Col,
  Divider,
  Empty,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import Column from "antd/es/table/Column";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [staffStatus, setStaffStatus] = useState("");
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    loadData();
  }, [searchValue, pageSize, staffStatus, currentPage, staffStatus]);

  const loadData = async () => {
    try {
      const response = await request.get("/staff", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          deleted: staffStatus,
        },
      });
      setStaffList(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
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
          <p>{`Cập nhật trạng thái ${staff.name} thành ${
            staff.deleted === false ? "Đã nghỉ" : "Đang làm"
          } ?`}</p>
          {staff.deleted === false ? (
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
          .put(`/staff/${staff.id}`, {
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
      <h6>Danh sách nhân viên</h6>
      <Row gutter={10}>
        <Col span={8}>
          <label className="mb-1">Nhập tên, email, số điện thoại</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm nhân viên theo tên, email, sdt ..."
          />
        </Col>
        <Col span={8}>
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={""}
            onChange={(event) => setStaffStatus(event.target.value)}
          >
            <Radio value={""}>Tất cả</Radio>
            <Radio value={false}>Đang làm</Radio>
            <Radio value={true}>Đã nghỉ</Radio>
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
          <Link to={"/admin/staff/add"}>
            <Button type="primary" className="bg-warning">
              <i className="fas fa-plus-circle me-1"></i>Thêm nhân viên
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
              <td>Ngày tạo</td>
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
                        item.deleted === true ? "text-danger" : "text-success"
                      }`}
                    >
                      {item.deleted === true ? "Đã nghỉ" : "Đang làm"}
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/admin/staff/${item.id}`}
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

export default Staff;
