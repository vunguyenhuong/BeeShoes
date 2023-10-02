import { Collapse } from "antd";
import React from "react";
import Loading from "~/components/Loading/Loading";
import ItemAddress from "./ItemAddress";
import { useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { useState } from "react";

function AddressStaffDetail({ idStaff }) {
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(idStaff);
  }, [idStaff])
  
  const loadData = (id) => {
    setLoading(true);
    const timeout = setTimeout(() => {
      request.get(`/address/${id}`).then(response => {
        setListAddress(response.content);
        setLoading(false);
      }).catch(e => {
        console.log(e);
      })
    }, 800);
    return () => clearTimeout(timeout);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {listAddress.map((item, index) => (
        <>
          <Collapse
            size="small"
            defaultActiveKey={index}
            items={[{ key: `${index}`, label: 'Địa chỉ', children: <ItemAddress props={item} onSuccess={() => loadData(idStaff)} />, }]}
          />
        </>
      ))}
    </>
  );
}

export default AddressStaffDetail;
