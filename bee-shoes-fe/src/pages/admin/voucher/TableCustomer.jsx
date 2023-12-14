import { Table } from "antd";
import Input from "antd/es/input/Input";
import React, { useState } from "react";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";

function TableCustomer({ setCustomerIds, setRowKeys }) {
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
        request.get("/customer", {
            params: { name: searchValue, page: 1, sizePage: 1_000_000 },
        }).then((response) => {
            setProductList(response.data);
            setTotalPages(response.totalPages);
            console.log(response.totalPages);
        }).catch((error) => {
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
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log(newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setCustomerIds(newSelectedRowKeys);

    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Input placeholder="Tìm kiếm khách hàng theo tên, email, sdt..." onChange={(e) => setSearchValue(e.target.value)} />
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
                    total: productList.length,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />
        </>
    );
}

export default TableCustomer