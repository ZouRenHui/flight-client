import React, { useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import api from '../services/http';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.code === 401) {
        console.log("Login failed:", response.data);
        setError(response.data.message);
      } else {
        const token = response.data.data?.token;
        const user = response.data.data?.user;

        if (!token) {
          setError("Login failed: Token missing");
          return;
        }

        console.log("Login success:", response.data);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        // 优先使用后端返回的错误信息
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
        // 处理HTTP状态码
        else if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "No response from server. Check network connection.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
