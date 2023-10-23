import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Input, InputNumber, Modal, Row, Table, Tooltip } from "antd";
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
import { toast } from "react-toastify";



function ShoeInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [listUpdate, setListUpdate] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleWeightChange = (value, id) => {
    const x = listProductDetail.find((detail) => detail.id === id);
    const index = listUpdate.findIndex((item) => item.id === id);
    if (index !== -1) {
      listUpdate[index].weight = value;
    } else {
      listUpdate.push({ id: id, quantity: x.quantity, price: x.price, weight: value });
    }
    console.log(listUpdate);
  }
  const handleQuantityChange = (value, id) => {
    const x = listProductDetail.find((detail) => detail.id === id);
    const index = listUpdate.findIndex((item) => item.id === id);
    if (index !== -1) {
      listUpdate[index].quantity = value;
    } else {
      listUpdate.push({ id: id, quantity: value, price: x.price, weight: x.weight });
    }
    console.log(listUpdate);
  }
  const handlePriceChange = (value, id) => {
    const x = listProductDetail.find((detail) => detail.id === id);
    const index = listUpdate.findIndex((item) => item.id === id);
    if (index !== -1) {
      listUpdate[index].price = value;
    } else {
      listUpdate.push({ id: id, quantity: x.quantity, price: value, weight: x.weight });
    }
    console.log(listUpdate);
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
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
      render: (x, record) => (
        <>
          {selectedRowKeys.includes(record.id) ? (
            <InputNumber defaultValue={x} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
              controls={false}
              min={0}
              onChange={(value) => handleQuantityChange(value, record.id)}
            />
          ) : (
            <>{x}</>
          )}
        </>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (x, record) => (
        <>
          {selectedRowKeys.includes(record.id) ? (
            <InputNumber defaultValue={x} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
              controls={false}
              min={0}
              onChange={(value) => handlePriceChange(value, record.id)}
            />
          ) : (
            <FormatCurrency value={x} />
          )}
        </>
      )
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
      render: (x, record) => (
        <>
          {selectedRowKeys.includes(record.id) ? (
            <InputNumber defaultValue={x} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
              controls={false}
              min={0}
              onChange={(value) => handleWeightChange(value, record.id)}
            />
          ) : (
            <>{x}</>
          )}
        </>
      )
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

  const handleUpdateFast = () => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận cập nhật ${selectedRowKeys.length} sản phẩm ?`,
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request.put('/shoe-detail/update-fast', listUpdate).then(response => {
          toast.success("Cập nhật thành công!");
          loadShoeDetail(id, currentPage, pageSize);
          setSelectedRowKeys([]);
        }).catch(e => {
          console.log(e);
        })
      },
    });
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
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5}>Chi tiết sản phẩm</Title>
          </div>
          <div className="">
            {selectedRowKeys.length > 0 && <Button type="primary" onClick={() => handleUpdateFast()} className="bg-warning">Cập nhật {selectedRowKeys.length} sản phẩm</Button>}
          </div>
        </div>
        <Table dataSource={listProductDetail} columns={columns} className="mt-3"
          rowKey={"id"}
          rowSelection={rowSelection}
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
