import React from 'react'
import { useState, useEffect } from 'react';
import * as request from "~/utils/httpRequest";

function DetailAddress({prov, distr, war}) {
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);
    const configApi = {
        headers: {
          Token: "aef361b5-f26a-11ed-bc91-ba0234fcde32",
          "Content-Type": "application/json",
          ShopId: 124173,
        },
      };

    useEffect(() => {
        request
          .get(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
            configApi
          )
          .then((response) => {
            setProvince(response.data.find((item) => item.ProvinceID === parseInt(prov)).ProvinceName)
          })
          .catch((e) => {
            console.log(e);
          });

          request
        .get(
          `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${prov}`,
          configApi
        )
        .then((response) => {
          setDistrict(response.data.find((item) => item.DistrictID === parseInt(distr)).DistrictName);
        })
        .catch((e) => {
          console.log(e);
        });
      request
        .get(
          `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${distr}`,
          configApi
        )
        .then((response) => {
          setWard(response.data.find((item) => item.WardCode === war).WardName);
          console.log(response.data)
        })
        .catch((e) => {
          console.log(e);
        });
      }, [distr,prov,war]);
  return (
    <>
    {`${ward}, ${district}, ${province}`}
    </>
  )
}

export default DetailAddress;