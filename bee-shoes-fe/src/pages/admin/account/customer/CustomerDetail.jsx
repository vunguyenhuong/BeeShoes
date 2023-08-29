import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import CustomerAddressDetail from "~/components/Admin/Account/Customer/CustomerAddressDetail";
import CustomerInfoDetail from "~/components/Admin/Account/Customer/CustomerInfoDetail";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function CustomerDetail() {
  const { id } = useParams();
  return (
    <>
      <BaseUI>
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/customer"}
          >
            Danh sách khách hàng
          </Link>
          <span className="breadcrumb-item">Chi tiết khách hàng</span>
        </nav>

        <div className="">
          <div className="row">
            <div className="col-xl-4 border-end border-3">
              <h6 className="border-bottom border-3 pb-2">
                Thông tin khách hàng
              </h6>
              <CustomerInfoDetail idCustomer={id} />
            </div>

            <div className="col-xl-8">
              <h6 className="border-bottom border-3 pb-2">Thông tin địa chỉ</h6>
              <CustomerAddressDetail idCustomer={id} />
            </div>
          </div>
        </div>
      </BaseUI>
    </>
  );
}

export default CustomerDetail;
