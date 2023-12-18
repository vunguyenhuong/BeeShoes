import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Form, Input, InputNumber, Modal, Row, Select, Switch, Table, Tooltip } from "antd";
import { QRCode as QRCodeAntd } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import request from "~/utils/httpRequest";
import UpdateShoe from "./UpdateShoe";
import UpdateShoeDetail from "./UpdateShoeDetail";
import FormatCurrency from "~/utils/FormatCurrency";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import { Option } from "antd/es/mentions";
import QRCode from 'qrcode-generator';
import download from 'downloadjs';
import JSZip from "jszip";


function ShoeInfo() {
  const [formFilter] = Form.useForm();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [listUpdate, setListUpdate] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [searchSize, setSearchSize] = useState('');
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);
  const [dataFilter, setDataFilter] = useState({});
  const [shoeDetailSelect, setShoeDetailSelect] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys, record) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    setShoeDetailSelect(record);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const downloadAllQRCode = () => {
    const zip = new JSZip();
    shoeDetailSelect.forEach((item, index) => {
      const qr = QRCode(0, 'H');
      qr.addData(item.code);
      qr.make();
      const canvas = document.createElement('canvas');
      canvas.width = qr.getModuleCount() * 10;
      canvas.height = qr.getModuleCount() * 10;
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#000000';
      qr.renderTo2dContext(context, 10);
      const folder = zip.folder(`qrcodes`);
      folder.file(`${item.code}${index + 1}.png`, canvas.toDataURL('image/png').split('base64,')[1], { base64: true });
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      download(content, 'qrcodes.zip', 'application/zip');
    });
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

  useEffect(() => {
    request.get('/size', { params: { name: searchSize } }).then(response => {
      setListSize(response.data.data);
    }).catch(e => {
      console.log(e);
    })
    request.get('/color', { params: { name: searchSize } }).then(response => {
      setListColor(response.data.data);
    }).catch(e => {
      console.log(e);
    })
    request.get('/sole', { params: { name: searchSize } }).then(response => {
      setListSole(response.data.data);
    }).catch(e => {
      console.log(e);
    })
  }, [searchSize])

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
      render: (x, record) => (
        <>
          {x}
          <br />
          {record.discountValue !== null && <small className="fw-semibold">SALE <span className="text-danger">{record.discountPercent} %</span></small>}
        </>
      )
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
            <>
              {record.discountValue == null ? <FormatCurrency value={x} /> : (
                <>
                  <span className="text-danger"><FormatCurrency value={record.discountValue} /></span> <span className="text-decoration-line-through text-secondary"><FormatCurrency value={record.price} /></span>
                </>
              )}
            </>
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
          <UpdateShoeDetail props={record} onSuccess={() => loadShoeDetail()} />
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
  }, [id, currentPage, pageSize, dataFilter])

  const loadShoeDetail = (id, currentPage, pageSize) => {
    request.get('/shoe-detail', {
      params: {
        name: dataFilter.name,
        size: dataFilter.size,
        color: dataFilter.color,
        sole: dataFilter.sole,
        shoe: id,
        page: currentPage,
        sizePage: pageSize,
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
      okText: "Xác nhận",
      cancelText: "Hủy",
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
          {selectedRowKeys.length > 0 && (
            <>
              <div className="me-2">
                <Button type="primary" onClick={() => downloadAllQRCode()}><i class="fa-solid fa-download me-2"></i> Tải QR</Button>
              </div>
              <div className="">
                <Button type="primary" onClick={() => handleUpdateFast()} className="bg-warning">Cập nhật {selectedRowKeys.length} sản phẩm</Button>
              </div>
            </>
          )}
        </div>
        <Form layout='vertical' onFinish={(data) => setDataFilter(data)} form={formFilter}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item label="Kích cỡ" name={"size"}>
                <Select showSearch placeholder="Chọn kích cỡ..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                  <Option value="">Chọn kích cỡ</Option>
                  {listSize.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Màu sắc" name={"color"}>
                <Select showSearch placeholder="Chọn màu sắc..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                  <Option value="">Chọn màu sắc</Option>
                  {listColor.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Loại đế" name={"sole"}>
                <Select showSearch placeholder="Chọn loại đế..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                  <Option value="">Chọn loại đế</Option>
                  {listSole.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="text-center">
            <Button className='me-1 bg-danger' onClick={() => { formFilter.resetFields() }} type='primary' icon={<i class="fa-solid fa-rotate-left"></i>}>Làm mới</Button>
            <Button htmlType='submit' className='bg-warning text-dark' type='primary' icon={<i className='fas fa-search'></i>}>Tìm kiếm</Button>
          </div>
        </Form>
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
