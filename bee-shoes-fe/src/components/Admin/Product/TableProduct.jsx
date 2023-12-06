import { Button, Collapse, Empty, Input, InputNumber, Modal, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageModal from "./ImageModal";

function TableProduct({ props, handleChange }) {
  const [groupByColor, setGroupByColor] = useState([]);

  const handleImageSelect = (colorName, index, files) => {
    const updatedItems = [...groupByColor[colorName]];
    for (let i = 0; i < updatedItems.length; i++) {
      updatedItems[i] = { ...updatedItems[i], images: files };
    }
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat()
    );
    console.log(groupByColor)
  };

  const handleChangeQuantity = (value, colorName, index) => {
    if (value < 1) {
      toast.error("Số lượng phải >= 1!");
    } else {
      const updatedItems = [...groupByColor[colorName]];
      updatedItems[index] = { ...updatedItems[index], quantity: value };
      setGroupByColor({
        ...groupByColor,
        [colorName]: updatedItems,
      });
      handleChange(
        Object.values({
          ...groupByColor,
          [colorName]: [...updatedItems],
        }).flat()
      );
    }
  };
  const handleChangePrice = (event, colorName, index) => {
    const value = parseInt(event);
    if (value < 1) {
      toast.error("Đơn giá không hợp lệ!");
    } else {
      const updatedItems = [...groupByColor[colorName]];
      updatedItems[index] = { ...updatedItems[index], price: value };
      setGroupByColor({
        ...groupByColor,
        [colorName]: updatedItems,
      });
      handleChange(
        Object.values({
          ...groupByColor,
          [colorName]: [...updatedItems],
        }).flat()
      );
    }
  };
  const handleChangeWeight = (event, colorName, index) => {
    const value = parseInt(event);
    if (value < 1) {
      toast.error("Cân nặng không hợp lệ!");
    } else {
      const updatedItems = [...groupByColor[colorName]];
      updatedItems[index] = { ...updatedItems[index], weight: value };
      setGroupByColor({
        ...groupByColor,
        [colorName]: updatedItems,
      });
      handleChange(
        Object.values({
          ...groupByColor,
          [colorName]: [...updatedItems],
        }).flat()
      );
    }
  };
  const deleteProductDetail = (colorName, index) => {
    const items = groupByColor[colorName];
    items.splice(index, 1);

    // Cập nhật lại groupByColor sau khi xóa
    setGroupByColor({
      ...groupByColor,
      [colorName]: [...items],
    });

    const allItems = Object.values({
      ...groupByColor,
      [colorName]: [...items],
    }).flat();
    handleChange(allItems);
    toast.success('Xóa thành công!');
  };

  useEffect(() => {
    const groupedProducts = {};
    props.forEach((option) => {
      const colorName = option.color.name;

      if (!groupedProducts[colorName]) {
        groupedProducts[colorName] = [];
      }

      groupedProducts[colorName].push(option);
    });
    setGroupByColor(groupedProducts);
  }, [props]);

  return (
    <>
      <Collapse defaultActiveKey={0} className="rounded-0 border-0">
        <Collapse.Panel key={0} header={"Danh sách các sản phẩm cùng loại"} className="border-bottom-0">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap">
              <tbody>
                {Object.entries(groupByColor).map(([key, items], index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        colSpan="10"
                        className="bg-secondary-subtle text-center fw-bold"
                      >
                        Các sản phẩm màu{" "}
                        <span className="text-lowercase">{key}</span>
                      </td>
                    </tr>
                    <tr className="fw-semibold">
                      <td>#</td>
                      <td>Sản phẩm</td>
                      <td>Số lượng</td>
                      <td>Đơn giá</td>
                      <td>Cân nặng</td>
                      <td>Danh mục</td>
                      <td>Thương hiệu</td>
                      <td></td>
                      <td>Ảnh</td>
                    </tr>

                    {items.map((option, idx) => (
                      <tr key={idx}>
                        <>
                          {option.shoe && option.shoe !== undefined && option.shoe !== null ? (
                            <>
                              <td>{idx + 1}</td>
                              <td>
                                {option.shoe === undefined || option.shoe === null
                                  ? "Vui lòng chọn sản phẩm"
                                  : option.shoe.name}{" "}
                                [{option.color.name} - {option.size.name}]
                              </td>
                              <td width="130px">
                                <InputNumber
                                  defaultValue={option.quantity}
                                  style={{ width: "100%" }}
                                  step={1}
                                  formatter={(value) =>
                                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) =>
                                    value !== null && value !== undefined
                                      ? value.replace(/\$\s?|(,*)/g, "")
                                      : ""
                                  }
                                  onChange={(value) =>
                                    handleChangeQuantity(value, key, idx)}
                                  controls={false}
                                  min={1}
                                />
                              </td>
                              <td width="130px">
                                <InputNumber
                                  defaultValue={option.price}
                                  style={{ width: "100%" }}
                                  step={10000}
                                  formatter={(value) =>
                                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) =>
                                    value !== null && value !== undefined
                                      ? value.replace(/\$\s?|(,*)/g, "")
                                      : ""
                                  }
                                  onChange={(value) =>
                                    handleChangePrice(value, key, idx)}
                                  controls={false}
                                  min={0}
                                />
                              </td>
                              <td width="130px">
                                <InputNumber
                                  defaultValue={option.weight}
                                  style={{ width: "100%" }}
                                  step={10000}
                                  formatter={(value) =>
                                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) =>
                                    value !== null && value !== undefined
                                      ? value.replace(/\$\s?|(,*)/g, "")
                                      : ""
                                  }
                                  onChange={(value) =>
                                    handleChangeWeight(value, key, idx)}
                                  controls={false}
                                  min={0}
                                />
                              </td>
                              <td>{option.shoe.category}</td>
                              <td>{option.shoe.brand}</td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => deleteProductDetail(key, idx)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                              {idx === 0 ? (
                                <>
                                  <td className="align-middle" rowSpan={items.length}>
                                    <ImageModal
                                      sttModal={index}
                                      colorName={key}
                                      handleChange={handleImageSelect}
                                    />
                                  </td>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          ) : ""}
                        </>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={9} className="text-center">
                        {items.length > 0 && items[0].images !== undefined && items[0].images.length !== 0 ? (
                          items[0].images.map((image, stt) => (
                            <img
                              src={image}
                              width={100}
                              height={100}
                              alt=""
                              key={stt}
                              className="me-2 object-fit-cover"
                            />
                          ))
                        ) : (
                          <Empty description={"Không có ảnh"} />
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default TableProduct;
