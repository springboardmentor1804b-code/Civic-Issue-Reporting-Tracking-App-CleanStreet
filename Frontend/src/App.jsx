import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./Landingpage";
import Login from "./Login";
import Signup from "./Signup";
import Admin from "./Admin";
import Profile from "./Profile"; // ✅ ADD THIS

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Landing Page */}
          <Route
            path="/"
            element={
              <LandingPage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Signup */}
          <Route path="/signup" element={<Signup />} />

          {/* Profile (Protected) */}
          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/login" />
            }
          />

          {/* Admin (Protected) */}
          <Route
            path="/admin"
            element={
              isLoggedIn ? <Admin /> : <Navigate to="/login" />
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;


