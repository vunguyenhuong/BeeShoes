import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Row, Tooltip } from "antd";
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

function ShoeInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
    loadShoeDetail(id,currentPage,pageSize);
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

  return (
    <>
      <BaseUI>
        <Breadcrumb className="mb-2"
          items={[{ href: "/", title: <FaHome /> }, { href: "/admin/product", title: "Danh sách sản phẩm" }, { title: `${product.name}` },]}
        />
        {/* Thông tin chung sản phẩm */}
        <Row gutter={24}>
          <Col xl={24} className="d-flex align-items-center py-1 mb-3" style={{ backgroundColor: "#F2F2F2" }}>
            <div className="flex-grow-1">
              <span className="fw-semibold">Thông tin sản phẩm</span>
            </div>
            <div className="">
              <Tooltip placement="top" title="Xóa">
                <Button type="primary" className="bg-danger me-1"><i className="fas fa-trash"></i></Button>
              </Tooltip>
              <UpdateShoe props={product} onSuccess={() => loadData(id)} />
            </div>
          </Col>
          <Col xl={8}>
            <p><strong>Danh mục: </strong> {product.category.name}</p>
            <p><strong>Thương hiệu: </strong> {product.brand.name}</p>
          </Col>
          <Col xl={8}>
            <p><strong>Người tạo: </strong> {product.createBy}</p>
            <p><strong>Người chỉnh sửa: </strong> {product.updateBy}</p>
          </Col>
          <Col xl={8}>
            <p><strong>Ngày tạo: </strong> <FormatDate date={product.createAt} /></p>
            <p><strong>Ngày cập nhật cuối: </strong> <FormatDate date={product.updateAt} /></p>
          </Col>
          <Divider />
        </Row>
        {/* Thông tin chi tiết */}
        <div class="table-responsive">
          <span className="fw-semibold">Chi tiết sản phẩm</span>
          <table class="table pb-0 mb-0 table-borderless table-striped align-middle">
            {listProductDetail.length === 0 ? (
              <Empty />
            ) : (
              <tbody>
                <tr className="fw-semibold">
                  <td>#</td>
                  <td>Tên</td>
                  <td>Loại đế</td>
                  <td>Số lượng</td>
                  <td>Đơn giá</td>
                  <td>Cân nặng</td>
                  <td><i className="fas fa-image"></i></td>
                  <td>Hành động</td>
                </tr>
                {listProductDetail.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>
                      {item.shoe.name} [{item.size.name} -
                      {item.color.name}]
                    </td>
                    <td>{item.sole.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.weight}</td>
                    <td>
                      <Carousel
                        autoplay
                        autoplaySpeed={2000}
                        dots={false}
                        arrows={false}
                        style={{ width: "100px" }}
                      >
                        {item.images.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.name}
                              alt="images"
                              style={{ width: "100px", height: "100px" }}
                              className="object-fit-cover"
                            />
                          </div>
                        ))}
                      </Carousel>
                    </td>
                    <td>
                      <UpdateShoeDetail props={item} />
                      <Tooltip placement="bottom" title="Xóa">
                        <Button type="text"><i className="fas fa-trash text-danger"></i></Button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage}
          handleChange={(page) => {
            if (page < 1) page = 1;
            setCurrentPage(page);
          }}
        />
      </BaseUI>
    </>
  );
}

export default ShoeInfo;
