import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/LoginPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NewBooking from './pages/NewBookingPage'
import Passenger from './pages/PassengerPage'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
   <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/newbooking" element={<NewBooking />} />
      <Route path="/passenger" element={<Passenger />} />
    </Routes>
  )
}

export default App
