import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRouters } from "./route";
import { FloatButton } from "antd";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  console.log(process.env.API_KEY);
  return (
    <BrowserRouter>
    <Routes>
      {publicRouters.map((route, index) => {
        const Page = route.element
        return <Route exact key={index} path={route.path} element={<Page />}></Route>
      })
      }
    </Routes>
    <FloatButton.BackTop/>
    <ToastContainer autoClose={3000}/>
  </BrowserRouter>
  );
}

export default App;
