/* eslint-disable eqeqeq */
import { Breadcrumb, Button, Col, Collapse, Input, Row, Select, notification } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import AddShoeModal from "~/components/Admin/Product/AddShoeModal";
import AttributeModal from "~/components/Admin/Product/AttributeModal";
import SelectField from "~/components/Admin/Product/SelectField";
import TableProduct from "~/components/Admin/Product/TableProduct";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function AddProduct() {
  const navigate = useNavigate();

  const [sole, setSole] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSole, setSelectedSole] = useState(null);

  const [searchSize, setSearchSize] = useState(null);
  const [searchColor, setSearchColor] = useState(null);
  const [searchSole, setSearchSole] = useState(null);

  const [product, setProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    const options = [];
    selectedColors.forEach((colorItem) => {
      selectedSizes.forEach((sizeItem) => {
        const option = {
          shoe: selectedProduct,
          color: colorItem,
          size: sizeItem,
          sole: selectedSole,
          price: 100000,
          quantity: 10,
          deleted: false,
          weight: 2000,
          images: []
        };
        options.push(option);
      });
    });
    setProductDetail(options);
    console.log(options)
  }, [selectedColors, selectedSizes, selectedProduct, selectedSole]);

  useEffect(() => {
    request.get("/shoe", { params: { name: searchProduct } }).then((response) => {
      setProduct(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [searchProduct])
  useEffect(() => {
    request.get("/size", { params: { name: searchSize } }).then((response) => {
      setSize(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [searchSize])
  useEffect(() => {
    request.get("/color", { params: { name: searchColor } }).then((response) => {
      setColor(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [searchColor])

  useEffect(() => {
    request.get("/sole", { params: { name: searchSole } }).then((response) => {
      setSole(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [searchSole])

  const handleChangeProductDetail = (items) => {
    console.log("--- đã nhảy sang add shoe ---")
    setProductDetail(items);
    console.log(items)
  }

  const handleCreate = () => {
    toast.success("Thêm thành công!");
  }

  return (
    <BaseUI>
      <div className="">
        <Breadcrumb className="mb-2"
          items={[{ href: "/", title: <FaHome /> }, { href: "/admin/product", title: "Danh sách sản phẩm" }, { title: "Thêm sản phẩm" },]}
        />
        <Row gutter={24}>
          <Col xl={24}>
            <label className="mb-1">Tên sản phẩm</label>
            <div className="d-flex">
              <Select
                className="me-2 w-100" size="large"
                showSearch
                onChange={(value) => {
                  setSelectedProduct(product.find(item => item.id === value))
                }}
                placeholder="Nhập tên giày..."
                optionFilterProp="children"
                onSearch={setSearchProduct}
              >
                <Option value="">Chọn giày</Option>
                {product.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <AddShoeModal />
            </div>
          </Col>
          <Col xl={24} className="my-3">
            <Collapse defaultActiveKey={0} className="rounded-0 border-0">
              <Collapse.Panel key={0} header={"Thuộc tính"} className="border-bottom-0">
                <div className="container">
                  <label className="mb-1">Loại đế</label>
                  <div className="d-flex align-items-center">
                    <Select
                      className="me-2 w-100" size="large"
                      showSearch
                      onChange={(value) => {
                        setSelectedSole(sole.find(item => item.id === value))
                      }}
                      placeholder="Nhập tên đế giày..."
                      optionFilterProp="children"
                      onSearch={setSearchSole}
                    >
                      <Option value="">Chọn loại đế</Option>
                      {sole.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                    <Button size="large" type="primary">
                      <FaPlus />
                    </Button>
                  </div>
                  <label className="mb-1">Kích cỡ</label>
                  <div className="d-flex align-items-center">
                    <Select
                      className="me-2 w-100" size="large"
                      showSearch mode="multiple"
                      onChange={async (selectedValues) => {
                        setSelectedSizes(await Promise.all(selectedValues.map(async (item) => {
                          return await request.get(`/size/${item}`);
                        })))
                      }}
                      placeholder="Nhập kích cỡ..."
                      optionFilterProp="children"
                      onSearch={setSearchSize}
                    >
                      {size.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                    <Button size="large" type="primary">
                      <FaPlus />
                    </Button>
                  </div>

                  <label className="mb-1">Màu sắc</label>
                  <div className="d-flex align-items-center">
                    <Select
                      className="me-2 w-100" size="large"
                      showSearch mode="multiple"
                      onChange={async (selectedValues) => {
                        setSelectedColors(await Promise.all(selectedValues.map(async (item) => {
                          return await request.get(`/color/${item}`);
                        })))
                      }}
                      placeholder="Nhập màu sắc..."
                      optionFilterProp="children"
                      onSearch={setSearchColor}
                    >
                      {color.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                    <Button size="large" type="primary">
                      <FaPlus />
                    </Button>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
        {selectedProduct === null || selectedProduct === undefined || selectedSizes.length === 0 || selectedColors.length === 0 ? (
          ""
        ) : (
          <>
            <TableProduct props={productDetail} handleChange={handleChangeProductDetail} />
            <Button type="primary" className="bg-warning float-end mt-3" onClick={handleCreate}>Thêm sản phẩm</Button>
          </>
        )}
      </div>
    </BaseUI>
  );
}

export default AddProduct;
