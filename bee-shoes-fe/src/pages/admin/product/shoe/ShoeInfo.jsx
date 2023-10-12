import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Row, Table, Tooltip } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import request from "~/utils/httpRequest";
import UpdateShoe from "./UpdateShoe";
import UpdateShoeDetail from "./UpdateShoeDetail";
import FormatCurrency from "~/utils/FormatCurrency";
import Title from "antd/es/typography/Title";

function ShoeInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData(id);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const loadData = async (id) => {
    await request.get(`/shoe/${id}`).then(response => {
      setProduct(response.data);
      setLoading(false);
    }).catch(e => {
      console.log(e);
    })
  }

  useEffect(() => {
    loadShoeDetail(id, currentPage, pageSize);
  }, [id, currentPage, pageSize])

  const loadShoeDetail = (id, currentPage, pageSize) => {
    request.get('/shoe-detail', {
      params: {
        shoe: id, page: currentPage, sizePage: pageSize,
      }
    }).then(response => {
      setListProductDetail(response.data.data);
      setTotalPages(response.data.totalPages);
    })
  }

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đế giày',
      dataIndex: 'sole',
      key: 'sole',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (x) => x == null ? 0 : x,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (x) => <FormatCurrency value={x} />
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: (<i className="fas fa-image"></i>),
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: "100px" }} >
          {images.split(',').map((image, index) => (
            <img src={image} alt="images" style={{ width: "100px", height: "100px" }} className="object-fit-contain" />
          ))}
        </Carousel>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (x, record) => (
        <>
          <UpdateShoeDetail props={record} />
          <Tooltip placement="bottom" title="Xóa">
            <Button type="text"><i className="fas fa-trash text-danger"></i></Button>
          </Tooltip>
        </>
      )
    },
  ];

  return (
    <>
      <BaseUI>
        <Breadcrumb className="mb-2"
          items={[{ href: "/", title: <FaHome /> }, { href: "/admin/product", title: "Danh sách sản phẩm" }, { title: `` },]}
        />
        {/* Thông tin chung sản phẩm */}
        <Row gutter={24}>
          <Col xl={24} className="d-flex align-items-center py-1 mb-3" style={{ backgroundColor: "#F2F2F2" }}>
            <div className="flex-grow-1">
              <Title level={5} className="my-2">Thông tin sản phẩm</Title>
            </div>
            <div className="">
              <Tooltip placement="top" title="Xóa">
                <Button type="primary" className="bg-danger me-1"><i className="fas fa-trash"></i></Button>
              </Tooltip>
              <UpdateShoe props={product} onSuccess={() => { loadData(id); loadShoeDetail(id, currentPage, pageSize) }} />
            </div>
          </Col>
          <Col xl={8}>
            <ul className="list-unstyled">
              <li>
                Danh mục: <span className="float-end fw-semibold">{product.category.name}</span>
              </li>
              <li>
                Thương hiệu: <span className="float-end fw-semibold">{product.brand.name}</span>
              </li>
            </ul>
          </Col>
          <Col xl={8}>
            <ul className="list-unstyled">
              <li>
                Người tạo: <span className="float-end fw-semibold">{product.createBy === null ? 'abc' : product.createBy}</span>
              </li>
              <li>
                Người chỉnh sửa: <span className="float-end fw-semibold">{product.updateBy}</span>
              </li>
            </ul>
          </Col>
          <Col xl={8}>
            <ul className="list-unstyled">
              <li>
                Ngày tạo: <span className="float-end fw-semibold"><FormatDate date={product.createAt} /></span>
              </li>
              <li>
                Ngày cập nhật cuối: <span className="float-end fw-semibold"><FormatDate date={product.updateAt} /></span>
              </li>
            </ul>
          </Col>
          <Divider />
        </Row>
        {/* Thông tin chi tiết */}
        <Title level={5}>Chi tiết sản phẩm</Title>
        <Table dataSource={listProductDetail} columns={columns} className="mt-3"
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
      </BaseUI>
    </>
  );
}

export default ShoeInfo;
