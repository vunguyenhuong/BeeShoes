import { Col, Select } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";

const GHNInfo = ({ dataAddress, prov, distr, war }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

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
        setProvinces(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    if (distr !== undefined && war !== undefined) {
      request
        .get(
          `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${prov}`,
          configApi
        )
        .then((response) => {
          setDistricts(response.data);
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
          setWards(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [prov, distr, war]);

  const handleProvinceChange = (provinceCode) => {
    request
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`,
        configApi
      )
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setSelectedProvince(provinceCode);
  };

  const handleDistrictChange = (districtCode) => {
    request
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`,
        configApi
      )
      .then((response) => {
        setWards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setSelectedDistrict(districtCode);
  };

  useEffect(() => {
    setSelectedProvince(prov);
    setSelectedDistrict(distr);
    setSelectedWard(war);
  }, [prov, distr, war]);

  const handleWardChange = (wardCode) => {
    dataAddress({
      province: selectedProvince,
      district: selectedDistrict,
      ward: wardCode,
    });
  };

  return (
    <>
      <Col span={8}>
        <label className="mb-1">Tỉnh/thành phố</label>
        <Select
          showSearch
          onChange={handleProvinceChange}
          placeholder="Chọn tỉnh/thành phố..."
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
          defaultValue={!prov ? null : parseInt(prov)}
          style={{ width: "100%" }}
        >
          {provinces.map((province) => (
            <Option key={province.ProvinceID} value={province.ProvinceID}>
              {province.ProvinceName}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={8}>
        <label className="mb-1">Quận/huyện</label>
        <Select
          showSearch
          onChange={handleDistrictChange}
          placeholder="Chọn quận/huyện..."
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
          defaultValue={!distr ? null : parseInt(distr)}
          style={{ width: "100%" }}
        >
          {districts.map((province) => (
            <Option key={province.DistrictID} value={province.DistrictID}>
              {province.DistrictName}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={8}>
        <label className="mb-1">Xã/phường/thị trấn</label>
        <Select
          showSearch
          onChange={handleWardChange}
          placeholder="Chọn xã/phường/thị trấn..."
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
          defaultValue={war}
          style={{ width: "100%" }}
        >
          {wards.map((ward) => (
            <Option
              key={ward.WardCode}
              value={ward.WardCode}
              selected={ward.WardCode == selectedWard}
            >
              {ward.WardName}
            </Option>
          ))}
        </Select>
      </Col>
    </>
  );
};

export default GHNInfo;
