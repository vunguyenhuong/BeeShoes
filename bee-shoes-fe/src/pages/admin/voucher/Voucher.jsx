import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import FormatDate from "~/utils/FormatDate";
import { Empty } from "antd";
import { FaHome, FaTrash } from "react-icons/fa";

import FormatCurrency from "~/utils/FormatCurrency";
import VoucherSatus from "./VoucherSatus";

function Voucher() {
  const [voucherList, setVoucherList] = useState([]);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const [reloadInterval, setReloadInterval] = useState(null);
  const [selectedOption, setSelectedOption] = useState("voucher");

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    loadVoucher();
    // Khởi tạo interval khi component được tạo
    const intervalId = setInterval(() => {
      loadVoucher();
      console.log("test");
    }, 1000);

    // Lưu intervalId vào state để sau này có thể xóa interval
    setReloadInterval(intervalId);

    // Hủy interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [searchValue, pageSize, currentPage, statusValue]);



  const loadVoucher = async () => {

    try {
      const response = await request.get("/voucher", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: statusValue,
        },
      });
      // console.log(response );
      setVoucherList(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

 
  return (
    <BaseUI>
      <div className="">
        <Breadcrumb
          className="mb-2"
          items={[
            { href: "/", title: <FaHome /> },
            { title: "Danh sách Voucher" },
          ]}
        />
        <Row gutter={12}>
          <Col span={8}>
            <label className="mb-1">Nhập mã, tên Voucher </label>
            <Input
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm kiếm voucher theo tên, mã ..."
              //
            />
          </Col>
          <Col span={26}>
            <div className="mb-1">Trạng thái</div>
            <label className="mb-1">ㅤ</label>
            <Radio.Group
              defaultValue={""}
              onChange={(event) => {
                setStatusValue(event.target.value);
                setCurrentPage(1);
              }}
            >
              <Radio value={""}>Tất cả</Radio>
              <Radio value={0}>Sắp diễn ra</Radio>
              <Radio value={1}>Đang diễn ra</Radio>
              <Radio value={2}>Đã kết thúc</Radio>
            </Radio.Group>
          </Col>
          <Col span={2}>
            <div className="mb-1">Số bản ghi</div>
            <Select
              defaultValue={5}
              onChange={(value) => setPageSize(value)}
              options={[{ value: 5 }, { value: 10 }, { value: 15 }]}
            />
          </Col>

          <Col span={4}>
            <div className="mb-1">‍</div>
            <Link to={"/admin/voucher/add"}>
              <Button
                type="primary"
                className="bg-warning"
                style={{ textAlign: "center" }}
              >
                <i className="fas fa-plus-circle me-1"></i>Thêm Voucher
              </Button>
            </Link>
          </Col>
        </Row>
       
      <div className="mb-1">Hiển thị</div>
      <Select
        defaultValue={selectedOption}
        onChange={handleOptionChange}
        options={[
          { value: "voucher", label: "Voucher" },
          { value: "khuyenmai", label: "Khuyến mãi" }
        ]}
      />
      {selectedOption === "voucher" && (
          <div className="table-responsive mt-3">
          <table className="table table-hover table-striped table-bordered text-nowrap">
            <thead className="">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mã</th>
                <th scope="col" style={{ width: "40%" }}>
                  Tên
                </th>
                <th scope="col">Đơn tối thiểu</th>
                <th scope="col">Giảm</th>
                <th scope="col">Số lượng</th>
                {/* <th scope="col">Thời gian diễn ra</th> */}
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
                voucherList.map((item, index) => (
                  <tr key={item.id}>
                    <td> {indexOfFirstItem + index + 1}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>
                      <FormatCurrency value={item.minBillValue} />
                    </td>

                    <td>{item.percentReduce}%</td>
                    <td>{item.quantity}</td>

                    <td className="text-center">
                      <VoucherSatus
                         status={item.status}
                      />
                      {/* <VoucherSatus
                        startDate={item.startDate}
                        endDate={item.endDate}
                      /> */}
                    </td>

                    <td className="text-center">
                      <Link to={`/admin/voucher/${item.id}`}>
                        <i className="fa-solid fa-circle-info text-secondary "></i>
                      </Link>
                      {/* <i className="fas fa-edit text-danger"> </i> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleChange={handlePageChange}
        />
        </div>
      )}
      {selectedOption === "khuyenmai" && (
        // Hiển thị nội dung khuyến mãi tại đây
        <div>Bảng hiển thị khuyến mãi</div>
      )}

  

     
      </div>
    </BaseUI>
  );
}

export default Voucher;
