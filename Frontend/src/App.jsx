import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./Page/Landing";
import Login from "./Page/Login";
import Registration from "./Page/Registration";
import Profile from "./Page/Profile";
import UserDashboard from "./Page/UserDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  // Load logged-in user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      setUser(JSON.parse(stored)); // { username, role }
    }
  }, []);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  // OPTIONAL: Admin-only protection
  const AdminRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    return isLoggedIn && loggedUser?.role === "admin"
      ? children
      : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <Routes>

        {/* 🌐 Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Registration setUser={setUser} />} />

        {/* 🔐 Protected User Pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
