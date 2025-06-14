import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import api from "../services/http";
import dayjs from "dayjs";

function MyBookingsPage() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [expired, setExpired] = useState([]);

  useEffect(() => {
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchBookings(parsedUser.userId);
    }
  }, [token, userData]);

  const fetchBookings = async (userId) => {
    try {
      const res = await api.get("/booking/getHistory", {
        params: { userId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const now = dayjs();
      const upcomingList = [];
      const expiredList = [];

      res.data.data.forEach((item) => {
        const outbound = dayjs(`${item.outboundDate} ${item.outboundDepTime}`);
        const returnDate =
          item.returnDate && item.returnDepTime
            ? dayjs(`${item.returnDate} ${item.returnDepTime}`)
            : null;

        const latestDate = returnDate || outbound;

        const bookingItem = {
          bookingId: item.bookingId,
          passenger: `${item.firstName} ${item.lastName}`,
          fromCity: returnDate
            ? [item.outboundDepCity, item.returnDepCity]
            : [item.outboundDepCity],
          toCity: returnDate
            ? [item.outboundArrCity, item.returnArrCity]
            : [item.outboundArrCity],
          depTime: returnDate
            ? [
                `${item.outboundDate} ${item.outboundDepTime}`,
                `${item.returnDate} ${item.returnDepTime}`,
              ]
            : [`${item.outboundDate} ${item.outboundDepTime}`],
          bookingTime: item.bookingTime,
          price: item.price,
        };

        if (latestDate.isAfter(now)) {
          upcomingList.push(bookingItem);
        } else {
          expiredList.push(bookingItem);
        }
      });

      setUpcoming(upcomingList);
      setExpired(expiredList);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 删除后刷新列表
      if (user) {
        fetchBookings(user.userId);
      }
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  };

  const renderList = (list) => (
    <div className="space-y-4 mt-4">
      {list.map((item, index) => (
        <div key={index} className="bg-white rounded shadow p-4 flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">{item.passenger}</div>
            <div className="text-sm text-gray-700">
              From: {item.fromCity.join(", ")}
            </div>
            <div className="text-sm text-gray-700">
              To: {item.toCity.join(", ")}
            </div>
            <div className="text-sm text-gray-700">
              Departure: {item.depTime.join(", ")}
            </div>
            <div className="text-sm text-gray-700">
              Booked at: {item.bookingTime}
            </div>
            <div className="text-sm text-gray-700">Price: ¥{item.price}</div>
          </div>
          <button
            onClick={() => deleteBooking(item.bookingId)}
            className="ml-4 text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen pt-8 px-4 bg-gray-50">
      <Header />
      <h2 className="text-2xl font-bold text-green-700 mt-6">Upcoming</h2>
      {upcoming.length > 0 ? (
        renderList(upcoming)
      ) : (
        <p className="text-gray-500 mt-2">No upcoming bookings.</p>
      )}

      <h2 className="text-2xl font-bold text-gray-700 mt-10">Expired</h2>
      {expired.length > 0 ? (
        renderList(expired)
      ) : (
        <p className="text-gray-500 mt-2">No expired bookings.</p>
      )}
    </div>
  );
}

export default MyBookingsPage;
