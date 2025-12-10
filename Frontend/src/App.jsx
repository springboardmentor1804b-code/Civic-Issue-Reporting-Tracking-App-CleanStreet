import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./Landing";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile";

export default function App() {
  const [user, setUser] = useState(null);

  // 🔥 IMPORTANT: Load username from localStorage when app loads
  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      setUser(JSON.parse(stored));  // { username: "yashaswini_15" }
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Registration setUser={setUser} />} />

        {/* Profile is protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
