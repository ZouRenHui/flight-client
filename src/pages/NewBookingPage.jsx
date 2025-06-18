import React, { useState } from "react";
import Header from "../components/Header";
import PassengerPopup from "../components/PassengerCard";
import { useNavigate } from "react-router-dom";
import api from "../services/http";

const NewBooking = () => {
  const navigate = useNavigate();
  const outboundFlight = JSON.parse(localStorage.getItem("outboundFlight"));
  const returnFlight = JSON.parse(localStorage.getItem("returnFlight"));
  const [passengers, setPassengers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleAddPassenger = () => {
    setShowPopup(true);
  };

  const handlePassengerSelected = (passenger) => {
    setPassengers((prev) => [...prev, passenger]);
  };

  const handlePayment = async () => {
    const bookingNo = localStorage.getItem("bookingNo");
    const token = localStorage.getItem("token");

    try {
      await api.post(
        `/booking/pay/${bookingNo}`,
        {}, // 空请求体
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/bookings");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleCancel = async () => {
    const bookingNo = localStorage.getItem("bookingNo");
    const token = localStorage.getItem("token");

    try {
      await api.post(
        `/booking/cancel/${bookingNo}`,
        {}, // 空请求体
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("bookingNo", null);
      navigate("/");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const renderPassengerList = (passengers) =>
    passengers.map((p) => (
      <div
        key={p.passengerId}
        className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2 text-sm"
      >
        <span>
          {p.lastName} {p.firstName}
        </span>
        <span className="text-gray-600">
          {p.cabin.replace("priceClass", "")} ¥{p.price}
        </span>
      </div>
    ));

  const totalPrice = passengers.reduce((sum, p) => sum + p.price, 0);

  const renderFlightSection = (title, flight) => (
    <div className="p-4 bg-white rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-bold mb-4">{title} Flight</h2>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          From: {flight.depCity} - {flight.depName} ({flight.depCode})
        </div>
        <div>
          To: {flight.arrCity} - {flight.arrName} ({flight.arrCode})
        </div>
        <div>Departure Time: {flight.departureTime?.substring(0, 5)}</div>
        <div>Arrival Time: {flight.arrivalTime?.substring(0, 5)}</div>
        {flight.stopCity && (
          <>
            <div>Stopover City: {flight.stopCity}</div>
            <div>
              Stopover Airport: {flight.stopName} ({flight.stopCode})
            </div>
            <div>Stopover Time: {flight.stopTime?.substring(0, 5)}</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 pt-4">
        <button
          className="text-blue-600 text-sm mb-4 underline"
          onClick={() => navigate("/")}
        >
          Flight &gt; Booking Review
        </button>

        {outboundFlight && renderFlightSection("Outbound", outboundFlight)}
        {returnFlight && renderFlightSection("Return", returnFlight)}
      </div>

      <div className="px-4 pt-4">
        <div className="p-4 bg-white rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Passengers</h3>
            <button
              onClick={() => handleAddPassenger()}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Passenger
            </button>
          </div>
          {renderPassengerList(passengers)}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white shadow-inner p-4 flex justify-between items-center border-t">
        <div className="text-xl font-bold text-gray-800">
          Total: ¥{totalPrice}
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to cancel?")
              ) {
                handleCancel();
              }
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to proceed to payment?")
              ) {
                handlePayment();
              }
            }}
          >
            Payment
          </button>
        </div>
      </div>

      {showPopup && (
        <PassengerPopup
          onClose={() => setShowPopup(false)}
          onAdd={handlePassengerSelected}
        />
      )}
    </div>
  );
};

export default NewBooking;
