import {Breadcrumb, Button, Col, Input, Radio, Row, Table, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import FormatDate from '~/utils/FormatDate';
import httpRequest from '~/utils/httpRequest';
import * as request from "~/utils/httpRequest";
import VoucherStatus from '../voucher/VoucherSatus';
import { FaHome } from "react-icons/fa";
import { toast } from "react-toastify";

function Promotion() {
    const { confirm } = Modal;
    const [promotions, setPromotions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
  
    const [searchValue, setSearchValue] = useState("");
    const [statusValue, setStatusValue] = useState("");
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
       loadDataPromotions();
       const intervalId = setInterval(() => {
        loadDataPromotions();
        console.log('e');
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }, [searchValue, pageSize, currentPage, statusValue]);

const loadDataPromotions =async () => {  
    // httpRequest.get('/promotion').then(response => {
    //     setPromotions(response.data.data);
    // }).catch(e => {
    //     console.log(e);
    // })
    try {
        const response = await request.get("/promotion", {
          params: {
            name: searchValue,
            page: currentPage,
            sizePage: pageSize,
            status: statusValue,
          },
        });
        setPromotions(response.data);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.log(e);
      }
    };
  
// const loadDataPromotions =async () => {  
//     httpRequest.get('/promotion').then(response => {
//         setPromotions(response.data.data);
//     }).catch(e => {
//         console.log(e);
//     })

//  };
const showDeleteConfirm = (id) => {
    confirm({
      title: "Xác nhận ",
      content: "Bạn có chắc muốn kết thúc đợt giảm giá này không?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        httpRequest
        .put(`/promotion/update/end-date/${id}`)
        .then((response) => {
          if (response.status === 200) {
            loadDataPromotions();
            toast.success("Kết thúc thành công!");
       }
      })
      .catch((e) => {
        console.log(e);
        console.log('---------');
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
            className: "text-center",
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
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (x) => <FormatDate date={x} />
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (x) => <FormatDate date={x} />
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (x) => <VoucherStatus status={x} />
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
            key: 'id',
            render: (x,item) => (
                <>
                    <Tooltip placement="top" title="Chỉnh sửa">
                            <Link to={`/admin/promotion/${x}`} className="btn btn-sm text-warning">
                                <i className="fas fa-edit"></i>
                            </Link>
                    </Tooltip>
                    <Tooltip placement="top" title="Kết thúc">
                        <Button
                            type="text"
                            icon={<i class="fa-solid fa-calendar-xmark text-danger"></i>}
                            onClick={() => showDeleteConfirm(x)}    
                        />
                    </Tooltip>
                </>
            )
        },
    ]
    return (
        <>
        <Breadcrumb
          className="mb-2"
          items={[
            { href: "/", title: <FaHome /> },
            { title: "Danh sách đợt giảm giá" },
          ]}
        />
            <Row gutter={12}>
                <Col span={8}>
                    <label className="mb-1">Tìm kiếm </label>
                    <Input
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Tìm kiếm đợt giảm giá theo tên, mã ..."
                    //
                    />
                </Col>
                <Col span={12}>
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
                    <Link to={"/admin/promotion/create"}>
                        <Button
                            type="primary"
                            className="bg-warning"
                            style={{ textAlign: "center" }}
                        >
                            <i className="fas fa-plus-circle me-1"></i>Thêm đợt giảm giá
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table className="mt-3" columns={columns} dataSource={promotions}
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

        </>
    )
}

export default Promotion