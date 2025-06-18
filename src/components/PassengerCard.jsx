import React, { useEffect, useState } from "react";
import api from "../services/http";
import dayjs from "dayjs";

const cabinOptions = [
  { label: "Economy", key: "priceClassY" },
  { label: "Business", key: "priceClassC" },
  { label: "First Class", key: "priceClassF" },
];

const PassengerPopup = ({ onClose, onAdd }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [passengers, setPassengers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState("priceClassY");
  const outboundFlight = localStorage.getItem("outboundFlight")
    ? JSON.parse(localStorage.getItem("outboundFlight"))
    : {};
  const returnFlight = localStorage.getItem("returnFlight")
    ? JSON.parse(localStorage.getItem("returnFlight"))
    : {};
  const searchParamsStr = localStorage.getItem("flightSearchParams");
  const searchParams = searchParamsStr ? JSON.parse(searchParamsStr) : {};

  useEffect(() => {
    const fetchPassengers = async () => {
      const res = await api.get("/passenger", {
        params: { userId: user.userId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPassengers(res.data.data);
    };

    fetchPassengers();
  }, []);

  const selectedPassenger = passengers.find(
    (p) => p.passengerId === selectedId
  );

  let price = outboundFlight[selectedCabin];
  if (returnFlight) {
    price += returnFlight[selectedCabin];
  }

  const handleAddBookInfo = async () => {
    const now = dayjs();
    const bookingTime = now.format("YYYY/MM/DD HH:mm:ss");
    const nowtime = now.format("YYYYMMDDHHmmss");
    const bookingNo = "BK" + nowtime + user.userId;
    // const bookingNo =
    //   hisBookingNo && hisBookingNo.trim() !== ""
    //     ? hisBookingNo
    //     : "BK" + nowtime + user.userId;

    console.log("✅ 最终使用的 bookingNo:", bookingNo);

    const bookingData = {
      bookingNo: bookingNo,
      userId: user.userId,
      passengerId: selectedId,
      flightIdOutbound: outboundFlight.flightId,
      flightIdReturn: returnFlight ? returnFlight.flightId : null,
      outboundDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      status: 0,
      flightClass:
        selectedCabin === "priceClassY"
          ? "Y"
          : selectedCabin === "priceClassC"
          ? "C"
          : "F",
      bookingTime: bookingTime,
      price: price,
    };

    try {
      await api.post(`/booking/create`, bookingData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("bookingNo", bookingNo);
      onClose();
    } catch (err) {
      console.error("Add failed:", err);
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Select Passenger</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {passengers.map((p) => (
            <label
              key={p.passengerId}
              className="flex items-center space-x-2 p-2 border rounded cursor-pointer"
            >
              <input
                type="radio"
                name="passenger"
                value={p.passengerId}
                checked={selectedId === p.passengerId}
                onChange={() => setSelectedId(p.passengerId)}
              />
              <span>
                {p.lastName} {p.firstName}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Cabin Class</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedCabin}
            onChange={(e) => setSelectedCabin(e.target.value)}
          >
            {cabinOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-right font-bold text-gray-800">
          Price: ¥{price}
        </div>

        <p className="text-sm text-center mt-4">
          Please go to the Passenger screen to add a new passenger.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!selectedId}
            onClick={() => {
              onAdd({
                ...selectedPassenger,
                cabin: selectedCabin,
                price,
              });
              handleAddBookInfo();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerPopup;
