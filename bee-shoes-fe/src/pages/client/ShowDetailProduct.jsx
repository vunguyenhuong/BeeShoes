import React from "react";
import { useLocation } from "react-router-dom";

function ShowDetailProduct() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const color = searchParams.get("color");
  return <div>ShowDetailProduct</div>;
}

export default ShowDetailProduct;
