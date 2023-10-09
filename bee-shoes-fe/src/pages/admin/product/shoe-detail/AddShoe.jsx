/* eslint-disable eqeqeq */
import { Breadcrumb, Button, Col, Collapse, Row, Select, Space } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddProperties from "~/components/Admin/Product/AddProperties";
import AddShoeModal from "~/components/Admin/Product/AddShoeModal";
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

  const [reloadInterval, setReloadInterval] = useState(null);
  const [reloadSole, setReloadSole] = useState(false);
  const [pageSize, setPageSize] = useState(100);

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
        };
        options.push(option);
      });
    });
    setProductDetail(options);
    console.log(options)
  }, [selectedColors, selectedSizes, selectedProduct, selectedSole]);

  const handleChangeProductDetail = (items) => {
    console.log("--- đã nhảy sang add shoe ---")
    setProductDetail(items);
    console.log(items)
  }

  useEffect(() => {
    request.get("/shoe", { params: { name: searchProduct } }).then((response) => {
      setProduct(response.data);
    }).catch((error) => {
      console.log(error);
    });
     // Khởi tạo interval khi component được tạo
     const intervalId = setInterval(() => {
      request.get("/shoe", { params: { name: searchProduct } }).then((response) => {
        setProduct(response.data);
      }).catch((error) => {
        console.log(error);
      });
      console.log("test");
    }, 1000);

    // Lưu intervalId vào state để sau này có thể xóa interval
    setReloadInterval(intervalId);

    // Hủy interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [searchProduct])
  useEffect(() => {
    request.get("/size", { params: { name: searchSize, pageSize: pageSize } }).then((response) => {
      setSize(response.data);
    }).catch((error) => {
      console.log(error);
    });
       // Khởi tạo interval khi component được tạo
       const intervalId = setInterval(() => {
        request.get("/size", { params: { name: searchSize, pageSize: pageSize } }).then((response) => {
          setSize(response.data);
        }).catch((error) => {
          console.log(error);
        });
        console.log("test");
      }, 1000);
  
      // Lưu intervalId vào state để sau này có thể xóa interval
      setReloadInterval(intervalId);
  
      // Hủy interval khi component unmount
      return () => {
        clearInterval(intervalId);
      };
    
  }, [searchSize, pageSize])
  useEffect(() => {
    request.get("/color", { params: { name: searchColor } }).then((response) => {
      setColor(response.data);
    }).catch((error) => {
      console.log(error);
    });
       // Khởi tạo interval khi component được tạo
       const intervalId = setInterval(() => {
        request.get("/color", { params: { name: searchColor } }).then((response) => {
          setColor(response.data);
        }).catch((error) => {
          console.log(error);
        });
        console.log("test");
      }, 1000);
  
      // Lưu intervalId vào state để sau này có thể xóa interval
      setReloadInterval(intervalId);
  
      // Hủy interval khi component unmount
      return () => {
        clearInterval(intervalId);
      };
  }, [searchColor])
  useEffect(() => {
    request.get("/sole", { params: { name: searchSole } }).then((response) => {
      setSole(response.data);
    }).catch((error) => {
      console.log(error);
    });
         // Khởi tạo interval khi component được tạo
         const intervalId = setInterval(() => {
          request.get("/sole/findAll", { params: { name: searchSole } }).then((response) => {
            setSole(response.data);
          }).catch((error) => {
            console.log(error);
          });
          console.log("test");
        }, 1000);
    
        // Lưu intervalId vào state để sau này có thể xóa interval
        setReloadInterval(intervalId);
    
        // Hủy interval khi component unmount
        return () => {
          clearInterval(intervalId);
        };
  }, [searchSole])

  const handleCreate = () => {
    console.log(productDetail)
    productDetail.forEach((item) => {
      const data = {
        shoe: item.shoe.id,
        color: item.color.id,
        size: item.size.id,
        sole: item.sole.id,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
        listImages: item.images
      }
      request.post('/shoe-detail', data).then(response => {
        console.log(response);
      }).catch(e => {
        console.log(e);
      })
    })
    toast.success("Thêm thành công!");
    navigate("/admin/product");
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
                <Row gutter={24}>
                  <Col xl={24}>
                    <label className="mb-1">Loại đế</label>
                    <Select
                      key={reloadSole} 
                      className="me-2 w-100 mb-3" size="large"
                      showSearch
                      onChange={(value) => {
                        setSelectedSole(sole.find(item => item.id === value))
                      }}
                      placeholder="Nhập tên đế giày..."
                      optionFilterProp="children"
                      onSearch={setSearchSole}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Space className="my-2 ms-2">
                            <AddProperties onClick={() => setReloadSole(!reloadSole)} placeholder={"đế giày"} name={"sole"} />
                          </Space>
                        </>
                      )}
                    >
                      <Option value="">Chọn loại đế</Option>
                      {sole.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xl={12}>
                    <label className="mb-1">Kích cỡ</label>
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
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Space className="my-2 ms-2">
                            <AddProperties placeholder={"kích cỡ"} name={"size"} />
                          </Space>
                        </>
                      )}
                    >
                      {size.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xl={12}>
                    <label className="mb-1">Màu sắc</label>
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
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Space className="my-2 ms-2">
                            <AddProperties placeholder={"màu sắc"} name={"color"} />
                          </Space>
                        </>
                      )}
                    >
                      {color.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
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
