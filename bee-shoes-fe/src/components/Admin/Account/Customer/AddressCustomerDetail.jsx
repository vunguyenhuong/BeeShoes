import { Collapse, Pagination } from "antd";
import React from "react";
import Loading from "~/components/Loading/Loading";
import ItemAddress from "./ItemAddress";
import { useState } from "react";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";
// import Pagination from "~/components/Pagination";
import CreateAddressModal from "./CreateAddressModal";
import { useParams } from "react-router-dom";

function AddressCustomerDetail() {
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const { id } = useParams();

  useEffect(() => {
    loadData(id, currentPage, pageSize);
  }, [id, currentPage, pageSize]);

  const loadData = (id, currentPage, pageSize) => {
    setLoading(true);
    const timeout = setTimeout(() => {
      request
        .get(`/address/${id}`, {
          params: {
            page: currentPage,
            sizePage: pageSize,
            status: false,
          },
        })
        .then((response) => {
          console.log(response);
          setListAddress(response.content);
          setTotalPages(response.totalPages);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }, 800);
    return () => clearTimeout(timeout);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CreateAddressModal
        idCustomer={id}
        onSuccess={() => loadData(id, currentPage, pageSize)}
      />
      {listAddress.map((item) => (
        <>
          <Collapse
            size="small"
            defaultActiveKey={item.index}
            className="mb-3 rounded-0 border-0"
            items={[
              {
                key: `${item.index}`,
                label: <span className="fw-semibold">Địa chỉ {item.index}</span>,
                children: (
                  <ItemAddress
                    props={item}
                    onSuccess={() => loadData(id, currentPage, pageSize)}
                  />  
                ),
                className: "border-bottom-0",
              },
            ]}
          />
        </>
      ))}
      {/* <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChange={handlePageChange}
      /> */}
      <Pagination
        showSizeChanger
        showQuickJumper
        defaultCurrent={currentPage}
        pageSize={pageSize}
        pageSizeOptions={[2, 5, 10, 20, 100]}
        total={totalPages * pageSize}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </>
  );
}

export default AddressCustomerDetail;
