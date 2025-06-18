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
  const [selectedOutboundFlightId, setSelectedOutboundFlightId] = useState(null);
  const [selectedReturnFlightId, setSelectedReturnFlightId] = useState(null);
  const [hasReturn, setHasReturn] = useState(1); // 1: One Way, 2: Round Trip
  const [outboundFlight, setOutboundFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const searchParamsStr = localStorage.getItem("flightSearchParams");
  const searchParams = searchParamsStr ? JSON.parse(searchParamsStr) : {};

  useEffect(() => {
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [token, userData, navigate]); // 依赖项确保只执行一次（首次渲染）

  const handleSelectFlight = (flight) => {
    if (hasReturn === 1) {
      setOutboundFlight(flight);
      localStorage.setItem("outboundFlight", JSON.stringify(flight));
      setSelectedOutboundFlightId(flight.flightId);
      // localStorage.setItem("selectedFlightId", flight.flightId);
    } else if (hasReturn === 2) {
      if (searchParams) {
        if (flight.depCity === searchParams.depCity) {
          setOutboundFlight(flight);
          localStorage.setItem("outboundFlight", JSON.stringify(flight));
          setSelectedOutboundFlightId(flight.flightId);
        } else {
          setReturnFlight(flight);
          localStorage.setItem("returnFlight", JSON.stringify(flight));
          setSelectedReturnFlightId(flight.flightId);
        }
      }
    }
  };

  const shouldShowBookReview =
    (hasReturn === 1 && outboundFlight) ||
    (hasReturn === 2 && outboundFlight && returnFlight);

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <SearchForm
        onSearch={(foundFlights) => setFlights(foundFlights)}
        onTripTypeChange={(type) => {
          setHasReturn(type);
          setOutboundFlight(null);
          setReturnFlight(null);
        }}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-1 gap-4">
          {flights &&
            flights.map((flight) => (
              <FlightCard
                key={flight.flightId}
                flight={flight}
                selectedOutboundFlightId={selectedOutboundFlightId}
                selectedReturnFlightId={selectedReturnFlightId}
                onSelect={() => handleSelectFlight(flight)}
              />
            ))}
        </div>
      </div>

      {shouldShowBookReview && (
        <div className="sticky bottom-0 bg-white shadow-md p-4 flex justify-center">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            onClick={() => navigate("/NewBooking")}
          >
            Book Review
          </button>
        </div>
      )}
    </div>
  );
};
export default Home;
