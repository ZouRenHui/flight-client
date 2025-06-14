import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import api from "../services/http";

function Passenger() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [passengerList, setPassengerList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
  });

  useEffect(() => {
    if (token && localStorage.getItem("user")) {
      const parsedUser = JSON.parse(localStorage.getItem("user"));
      setUser(parsedUser);
      fetchPassengers(parsedUser.userId);
      setNewPassenger({
        firstName: "",
        lastName: "",
        email: "",
        userId: parsedUser.userId,
      });
    }
  }, [token]);

  const fetchPassengers = async (userId) => {
    try {
      console.log("userId: " + userId);
      const res = await api.get(`/passenger`, {
        params: { userId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res: " + res);
      setPassengerList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch passengers:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/passenger/delete/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },});
      setPassengerList(passengerList.filter((p) => p.passengerId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAdd = async () => {
    if (
      !newPassenger.firstName ||
      !newPassenger.lastName ||
      !newPassenger.email
    )
      return;

    try {
      const res = await api.post(`/passenger/create`, {
        ...newPassenger,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPassengerList([...passengerList, res.data.data]);
      setShowAddForm(false);
      setNewPassenger({ firstName: "", lastName: "", email: "", userId: user.userId });
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  return (
    <div className="w-full min-h-screen pt-8 px-4 bg-gray-50">
      <Header />
      <div className="w-full mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Passenger List</h2>

        <table className="w-full table-auto border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium">
              <th className="p-2">Last Name</th>
              <th className="p-2">First Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {passengerList.map((p) => (
              <tr key={p.passengerId} className="border-t text-sm">
                <td className="p-2">{p.lastName}</td>
                <td className="p-2">{p.firstName}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(p.passengerId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {showAddForm && (
              <tr className="border-t text-sm bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value={newPassenger.lastName}
                    onChange={(e) =>
                      setNewPassenger({
                        ...newPassenger,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="Last Name"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={newPassenger.firstName}
                    onChange={(e) =>
                      setNewPassenger({
                        ...newPassenger,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="First Name"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="email"
                    value={newPassenger.email}
                    onChange={(e) =>
                      setNewPassenger({
                        ...newPassenger,
                        email: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="Email"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
        >
          ➕ Add Passenger
        </button>
      </div>
    </div>
  );
}

export default Passenger;
