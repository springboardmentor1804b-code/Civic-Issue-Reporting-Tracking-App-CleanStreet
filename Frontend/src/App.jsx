import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./Landing";
import Login from "./Login";
import Registration from "./Registration";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<Landing />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}
