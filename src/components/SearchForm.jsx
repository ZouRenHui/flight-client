import React, { useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import api from "../services/http";

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    depCity: "",
    arrCity: "",
    departureDate: "",
    returnDate: "",
    withStop: 0,
    hasReturn: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 添加错误状态
  const [errors, setErrors] = useState({
    depCity: "",
    arrCity: "",
    departureDate: "",
    returnDate: "",
  });
  const [error, setError] = useState("");

  const city = [
    "",
    "Beijing",
    "Los Angeles",
    "London",
    "New York",
    "San Francisco",
    "Paris",
    "Tokyo",
    "Dubai",
    "Singapore",
    "Sydney",
    "Frankfurt",
    "Amsterdam",
    "Toronto",
    "Seoul",
    "Delhi",
    "São Paulo",
    "Mexico City",
    "Johannesburg",
    "Istanbul",
    "Bangkok",
    "Zurich",
    "Barcelona",
    "Madrid",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    // 清除当前字段的错误
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证逻辑
    const newErrors = {};

    // 检查出发城市
    if (!searchParams.depCity) {
      newErrors.depCity = "Please select a departure city";
    }

    // 检查到达城市
    if (!searchParams.arrCity) {
      newErrors.arrCity = "Please select an arrival city";
    }

    // 检查出发日期
    if (!searchParams.departureDate) {
      newErrors.departureDate = "Please select a departure date";
    }

    // 如果是往返航班，检查返回日期
    if (searchParams.hasReturn === 2 && !searchParams.returnDate) {
      newErrors.returnDate = "Please select a return date";
    }

    // 设置错误状态
    setErrors(newErrors);

    // 如果没有错误，执行搜索
    if (Object.keys(newErrors).length === 0) {
      try {
        // 准备查询参数
        const params = {
          depCity: searchParams.depCity,
          arrCity: searchParams.arrCity,
          withStop: searchParams.withStop,
          hasReturn: searchParams.hasReturn,
        };

        // 获取 JWT 令牌
        const token = localStorage.getItem("token") || "";

        // 发送 API 请求
        const response = await api.get("http://localhost:8080/api/flights", {
          params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // 检查响应状态
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        console.log("Flight search success:", response.data);
        const flights = response.data.data;
        console.log("flights:", flights);
        if (onSearch) {
          onSearch(flights);
        }

        // 存储航班数据到 localStorage
        localStorage.setItem(
          "flightSearchParams",
          JSON.stringify(searchParams)
        );

        // 存储日期信息
        localStorage.setItem("depDate", searchParams.departureDate);
        localStorage.setItem("returnDate", searchParams.returnDate || "");

        //navigate("/flights");
      } catch (error) {
        console.error("Flight search failed:", error);
        setError(error.message);

        // 显示更详细的错误信息
        if (error.response) {
          console.error("Error details:", error.response.data);
          setError(
            `Server error: ${
              error.response.data.message || error.response.statusText
            }`
          );
        }
      }
      // onSearch(searchParams);
    }
  };

  // 切换行程类型时清除返回日期的错误
  const handleTripTypeChange = (type) => {
    setSearchParams({
      ...searchParams,
      hasReturn: type,
      returnDate: type === 1 ? "" : searchParams.returnDate,
    });

    // 清除返回日期的错误
    if (type === 1 && errors.returnDate) {
      setErrors({ ...errors, returnDate: "" });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Find Your Perfect Flight
      </h2>

      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            searchParams.hasReturn === 1
              ? "bg-blue-500 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => handleTripTypeChange(1)}
        >
          One Way
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            searchParams.hasReturn === 2
              ? "bg-blue-500 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => handleTripTypeChange(2)}
        >
          Round Trip
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Departure City */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <select
            name="depCity"
            value={searchParams.depCity}
            onChange={handleInputChange}
            className={`w-full p-3 border ${
              errors.depCity ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            {city.map((fromCity) => (
              <option key={fromCity} value={fromCity}>
                {fromCity === "" ? "--Dep City--" : fromCity}
              </option>
            ))}
          </select>
          {errors.depCity && (
            <p className="mt-1 text-sm text-red-500">{errors.depCity}</p>
          )}
        </div>

        {/* Arrival City */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <select
            name="arrCity"
            value={searchParams.arrCity}
            onChange={handleInputChange}
            className={`w-full p-3 border ${
              errors.arrCity ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            {city.map((toCity) => (
              <option key={toCity} value={toCity}>
                {toCity === "" ? "--Arr City--" : toCity}
              </option>
            ))}
          </select>
          {errors.arrCity && (
            <p className="mt-1 text-sm text-red-500">{errors.arrCity}</p>
          )}
        </div>

        {/* Departure Date */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure
          </label>
          <input
            type="date"
            name="departureDate"
            value={searchParams.departureDate}
            onChange={handleInputChange}
            className={`w-full p-3 border ${
              errors.departureDate ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.departureDate && (
            <p className="mt-1 text-sm text-red-500">{errors.departureDate}</p>
          )}
        </div>

        {/* Return Date (only for round trip) */}
        {searchParams.hasReturn === 2 ? (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <input
              type="date"
              name="returnDate"
              value={searchParams.returnDate}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.returnDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-500">{errors.returnDate}</p>
            )}
          </div>
        ) : (
          <div className="flex-1 min-w-[200px]"></div>
        )}

        {/* Trip Type */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip type
          </label>
          <select
            name="withStop"
            value={searchParams.withStop}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[0, 1, 2].map((num) => (
              <option key={num} value={num}>
                {num === 0 ? "All" : num === 1 ? "WithStop" : "NoStop"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-4 flex justify-center mt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition w-full md:w-auto"
          >
            Search Flights
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
