import { Breadcrumb, Button, Col, Input, Radio, Row, Table,Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import FormatCurrency from "~/utils/FormatCurrency";
import VoucherSatus from "./VoucherSatus";

function Voucher() {
  const { confirm } = Modal;
  const [voucherList, setVoucherList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [pageSize, setPageSize] = useState(5);

  

  useEffect(() => {
    loadVoucher();
    const intervalId = setInterval(() => {
      loadVoucher();
      console.log('e');
    }, 1000);
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
      setVoucherList(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận ",
      content: "Bạn có chắc muốn kết thúc phiếu giảm giá này không?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
        .put(`/voucher/update/end-date/${item.id}`)
        .then((response) => {
          if (response.status === 200) {
            loadVoucher();
            toast.success("Kết thúc thành công!");
       }
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minBillValue',
      key: 'minBillValue',
      render: (x) => <FormatCurrency value={x} />
    },
    {
      title: 'Giảm',
      dataIndex: 'percentReduce',
      key: 'percentReduce',
      render: (x) => `${x}%`
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (x) => <VoucherSatus status={x} />
    },

    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (x, item) => (
        <>
           <Tooltip placement="top" title="Chỉnh sửa">
          <Link to={`/admin/voucher/${x}`} className="btn btn-sm text-warning">
            <i className="fas fa-edit"></i>
          </Link>
          </Tooltip>
          <Tooltip placement="top" title="Kết thúc">
          <Button
              type="text"
              icon={<i class="fa-solid fa-calendar-xmark text-danger"></i>}
              onClick={() => showDeleteConfirm(item)}    
          /></Tooltip>
        </>
      )
    },
  ];

  return (
    <BaseUI>
      <div className="">
        <Breadcrumb
          className="mb-2"
          items={[
            { href: "/", title: <FaHome /> },
            { title: "Danh sách phiếu giảm giá" },
          ]}
        />
        <Row gutter={12}>
          <Col span={6}>
            <label className="mb-1">Nhập mã, tên phiếu giảm giá </label>
            <Input
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm kiếm phiếu giảm giá theo tên, mã ..."
            //
            />
          </Col>
          <Col span={14}>
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
          {/* <Col span={2}>
            <div className="mb-1">Số bản ghi</div>
            <Select
              defaultValue={5}
              onChange={(value) => setPageSize(value)}
              options={[{ value: 5 }, { value: 10 }, { value: 15 }]}
            />
          </Col> */}

          <Col span={4}>
            <div className="mb-1">‍</div>
            <Link to={"/admin/voucher/add"}>
              <Button
                type="primary"
                className="bg-warning"
                style={{ textAlign: "center" }}
              >
                <i className="fas fa-plus-circle me-1"></i>Thêm phiếu giảm giá
              </Button>
            </Link>
          </Col>
        </Row>
        <Table dataSource={voucherList} columns={columns} className="mt-3"
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }} />
      </div>
    </BaseUI>
  );
}

export default Voucher;
