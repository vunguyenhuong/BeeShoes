import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken, setUserToken } from "~/helper/useCookies";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/; // Regex đơn giản cho định dạng email
    return re.test(email);
  };
  const validatePassword = (password) => {
    // Định dạng mật khẩu: ít nhất 6 ký tự, ít nhất một số, một chữ hoa
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };
  const login = async () => {
    // if (!validateEmail(email)) {
    //   setErrors((prev) => ({ ...prev, email: "Email không hợp lệ." }));
    //   return;
    // } else {
    //   setErrors((prev) => ({ ...prev, email: "" }));
    // }

    // if (!validatePassword(password)) {
    //   setErrors((prev) => ({ ...prev, password: "Mật khẩu không hợp lệ." }));
    //   return;
    // } else {
    //   setErrors((prev) => ({ ...prev, password: "" }));
    // }
    try {
      const res = await axios({
        method: "post",

        url: `http://localhost:8080/login-v2/singin`,
        data: {
          email: email,
          password: password,
        },
      });
      if (res.status) {
        if (jwtDecode(res.data.token).role === 'ROLE_USER') {
          toast.error('Bạn không có quyền truy cập tính năng này!')
        } else {
          toast.success("Đăng nhập thành công");
          setToken(res.data.token);
          setUserToken(res.data.token);
          sessionStorage.setItem("idAccount", jwtDecode(res.data.token).id);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response.data)
    }
  };
  return (
    <div class="container-fluid">
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="row">
          <h5 class="text-center m-0 p-0">LOGIN</h5>
          <div className="container">
            <div class="mb-3">
              <label class="form-label">Tài khoản</label>
              <input type="text" class="form-control rounded-0" name="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-control rounded-0" name="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div class="mb-3">
              <button type="submit" class="btn btn-outline-dark rounded-0 w-100" onClick={login}>Đăng nhập</button>
            </div>
          </div>
          <a href="/forgot" class="text-dark small"><i class="fas fa-key"></i> Quên mật khẩu ?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
