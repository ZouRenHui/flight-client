import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const userData = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, [token, userData]);
  console.log("userData" + user);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container w-full max-w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-blue-600 text-2xl font-bold mr-2">✈️</div>
            <h1 className="text-2xl font-bold text-gray-800">SkyTravel</h1>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="font-medium text-gray-600 hover:text-blue-500 transition"
            activeclassname="text-blue-600 border-b-2 border-blue-600"
          >
            Flights
          </Link>
          <Link
            to="/bookings"
            className="font-medium text-gray-600 hover:text-blue-500 transition"
            activeclassname="text-blue-600 border-b-2 border-blue-600"
          >
            My Bookings
          </Link>
          <Link
            to="/passenger"
            className="font-medium text-gray-600 hover:text-blue-500 transition"
            activeclassname="text-blue-600 border-b-2 border-blue-600"
          >
            Passenger
          </Link>
        </nav>

        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                <span className="font-bold">{user.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div className="md:hidden border-t border-gray-200 py-2">
        <div className="container mx-auto px-4 flex justify-around">
          <Link to="/" className="flex flex-col items-center">
            <span className="text-xl">✈️</span>
            <span className="text-xs mt-1">Flights</span>
          </Link>
          <Link to="/bookings" className="flex flex-col items-center">
            <span className="text-xl">📋</span>
            <span className="text-xs mt-1">Bookings</span>
          </Link>
          <Link to="/passenger" className="flex flex-col items-center">
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">Passenger</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
