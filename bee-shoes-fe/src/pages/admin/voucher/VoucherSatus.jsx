import React from "react";

// const VoucherStatus = ({ startDate, endDate }) => {
const VoucherStatus = ({status }) => {
  // const now = new Date();
  // const startDateObj = new Date(startDate);
  // const endDateObj = new Date(endDate);

  if (status===0) {
    return <span class="badge bg-success">Sắp diễn ra</span>;
  } else if (status===2) {
    return <span class="badge bg-danger bg-sm bg-dim">Đã kết thúc</span>;
  } else {
    return <span class="badge bg-primary bg-sm bg-dim">Đang diễn ra</span>;
  }
  // if (now < startDateObj) {
  //   return <span class="badge bg-success">Sắp diễn ra</span>;
  // } else if (now > endDateObj) {
  //   return <span class="badge bg-danger bg-sm bg-dim">Đã kết thúc</span>;
  // } else {
  //   return <span class="badge bg-primary bg-sm bg-dim">Đang diễn ra</span>;
  // }
};  

export default VoucherStatus;