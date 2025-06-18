import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/http";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    country: "",
    phone: "",
  });
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    try {
      const response = await api.post("/auth/createUser", registerData);
      alert("User created successfully. You can now log in.");
      setShowRegister(false);
    } catch (err) {
      let msg = "Registration failed.";
      if (err.response?.data?.message) msg = err.response.data.message;
      setRegisterError(msg);
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
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="text-blue-500 hover:underline"
          >
            Create a new user
          </button>
        </p>
      </form>

      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            {registerError && <p className="text-red-500">{registerError}</p>}
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={registerData.firstName}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    firstName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={registerData.lastName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, lastName: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={registerData.gender}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    gender: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 border rounded"
                value={registerData.country}
                onChange={(e) =>
                  setRegisterData({ ...registerData, country: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-2 border rounded"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
