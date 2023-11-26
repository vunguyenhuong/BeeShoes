import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { publicRouters } from "./route";
import { FloatButton } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUI from "./layouts/admin/BaseUI";
import CoreUI from "./layouts/admin/CoreUI";
import { getTokenEmpoloyee } from "./helper/useCookies";

function App() {
  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={
          <CoreUI>
            <route.element />
          </CoreUI>
        }
      />
    ));
  };

  return (
    <BrowserRouter>
      <Routes>{renderRoutes(publicRouters)}</Routes>
      <FloatButton.BackTop />
      <ToastContainer autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
