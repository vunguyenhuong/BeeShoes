import React from "react";
import DetailAddress from "~/components/DetailAddress";

function InfoBill({ props }) {

  return (
    <>
      <div className="mt-3">
        <h6 className="text-uppercase bg-secondary-subtle p-3">Thông tin đơn hàng</h6>
        <div className="card rounded-0 border-0">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-4">
                <p>
                  <strong>
                    Trạng thái:
                    <span className="text-danger">
                      {props.status === 0
                        ? " Chờ thanh toán"
                        :props.status === 1
                        ? " Tạo đơn hàng"
                        : props.status === 2
                        ? " Chờ xác nhận"
                        : props.status === 3
                        ? " Xác nhận thông tin thanh toán"
                        : props.status === 4
                        ? " Chờ giao"
                        : props.status === 5
                        ? " Đang giao"
                        : props.status === 6
                        ? " Hoàn thành"
                        : props.status === 7
                        ? " Hủy"
                        : " Tạo đơn hàng"}
                    </span>
                  </strong>
                </p>
                <p>
                  <strong>
                    Loại đơn hàng:
                    <span className="text-danger">
                      {props.type === 0 ? " Tại quầy" : " Giao hàng"}
                    </span>
                  </strong>
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>
                    Mã đơn hàng:
                    <span className="text-danger"> #{props.code}</span>
                  </strong>
                </p>
                <p>
                  <strong>
                    Họ và tên:
                    <span className="text-danger">
                      {" "}
                      {props.customerName === null
                        ? "Khách hàng lẻ"
                        : props.customerName}
                    </span>
                  </strong>
                </p>
              </div>
              <div className="col-xl-4">
                <p>
                  <strong>Số điện thoại: {" "}
                    <span className="text-danger">
                    {props.phoneNumber}
                    </span>
                  </strong>
                </p>
                <p>
                  <strong>Địa chỉ: {" "}
                  {props.address}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoBill;
