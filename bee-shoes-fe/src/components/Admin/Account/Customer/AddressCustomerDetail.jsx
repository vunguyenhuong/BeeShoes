import { Collapse } from "antd";
import React from "react";
import Loading from "~/components/Loading/Loading";
import ItemAddress from "./ItemAddress";
import { useState } from "react";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";
import Pagination from "~/components/Pagination";

function AddressCustomerDetail({ idCustomer }) {
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    loadData(idCustomer,currentPage);
  }, [idCustomer,currentPage])
  const loadData = (id,currentPage) => {
    setLoading(true);
    const timeout = setTimeout(() => {
      request.get(`/address/${id}`, {params: {page: currentPage}}).then(response => {
        setListAddress(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
      }).catch(e => {
        console.log(e);
      })
    }, 800);
    return () => clearTimeout(timeout);
  }
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {listAddress.map((item, index) => (
        <>
          <Collapse
            size="small"
            defaultActiveKey={index} className='mb-3 rounded-0 border-0'
            items={[{ key: `${index}`, label: <span className="fw-semibold">Địa chỉ {index + 1}</span>, children: <ItemAddress props={item} onSuccess={() => loadData(idCustomer)}/>, className: 'border-bottom-0' }]}
          />
        </>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChange={handlePageChange}
      />
    </>
  );
}

export default AddressCustomerDetail;
