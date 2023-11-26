import React from "react";
import { Navigate } from "react-router-dom";
import { getTokenEmpoloyee } from "./helper/useCookies";

const withAuth = (Component) => {
  const AuthRoute = () => {
    const token = getTokenEmpoloyee();

    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      return <Navigate to="/admin/login" />;
    }

    // Nếu có token, hiển thị component yêu cầu
    return <Component />;
  };

  return AuthRoute;
};

export default withAuth;
