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
        toast.success("Đăng nhập thành công");
        console.log(res.data);
        setToken(res.data.token);
        setUserToken(res.data.token);
        sessionStorage.setItem("idAccount", jwtDecode(res.data.token).id);
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching shoe details: ", error);
    }
  };
  return (
    <div>
      <form className="w-full max-w-xs" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email*
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Mật khẩu*
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}

          {/* <p className="text-xs italic">Nhớ mật khẩu</p> */}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={login}
          >
            ĐĂNG NHẬP
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
