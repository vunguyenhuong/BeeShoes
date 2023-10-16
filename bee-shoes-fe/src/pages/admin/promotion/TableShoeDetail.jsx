import { Carousel, Table } from "antd";
import React, { useEffect, useState } from "react";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";

function TableShoeDetail() {
  const [listProductDetail, setListProductDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [id, setId] = useState(1);
  
  useEffect(() => {
    loadShoeDetail(id, currentPage, pageSize);
  }, [id, currentPage, pageSize])

  const loadShoeDetail = (id, currentPage, pageSize) => {
    request.get('/shoe-detail', {
      params: {
        shoe: id, page: currentPage, sizePage: pageSize,
      }
    }).then(response => {
      setListProductDetail(response.data);
      setTotalPages(response.data.totalPages);
    })
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (x) => (x == null ? 0 : x),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (x) => <FormatCurrency value={x} />,
    },
  ];

  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <Table
      rowKey="id"
      rowSelection={rowSelection}
      dataSource={listProductDetail}
      columns={columns}
      className="mt-3"
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
      }}
    />
  );
}

export default TableShoeDetail;
