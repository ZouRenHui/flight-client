import React, { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const userData = localStorage.getItem("user");
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [token, userData, navigate]); // 依赖项确保只执行一次（首次渲染）

  if (!user) return null;

  return (
    <div className="w-full min-h-screen pt-8 px-4 bg-gray-50">
      <Header />
      <SearchForm onSearch={(flights) => setFlights(flights)} />
      {flights &&
        flights.map((flight) => (
          <FlightCard key={flight.flightId} flight={flight} />
        ))}
    </div>
  );
};
export default Home;
