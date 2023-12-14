import { Table } from "antd";
import Input from "antd/es/input/Input";
import React, { useState } from "react";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";

function TableShoe({ setProductIds, setRowKeys }) {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    loadShoe(searchValue, pageSize, currentPage);
  }, [pageSize, currentPage, searchValue]);

  useEffect(() => {
    setSelectedRowKeys(setRowKeys);
  }, [setRowKeys])

  const loadShoe = () => {
    request
      .get("/shoe", {
        params: { name: searchValue, page: 1, sizePage: 1_000_000 },
      })
      .then((response) => {
        setProductList(response.data);
        setTotalPages(response.totalPages);
        console.log(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    setProductIds(newSelectedRowKeys);

  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Input placeholder="Tìm kiếm sản phẩm theo tên..." onChange={(e) => setSearchValue(e.target.value)} />
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={productList}
        columns={columns}
        className="mt-3"
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: true,
          total:productList.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </>
  );
}

export default TableShoe;
