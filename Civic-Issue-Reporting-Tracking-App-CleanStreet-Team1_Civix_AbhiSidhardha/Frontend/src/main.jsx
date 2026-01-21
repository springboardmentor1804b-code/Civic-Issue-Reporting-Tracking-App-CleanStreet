import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from './pages/Dashboard.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import CommunityReports from './pages/CommunityReport.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import AdminOverview from './components/AdminOverview';
import AdminViewComplaints from './components/AdminViewComplaints';
import RecentActivities from './components/RecentActivities';
import UserManagement from './components/UserManagement';
import { Toaster } from "react-hot-toast";

import "./index.css";
import "leaflet/dist/leaflet.css"

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/community-report" element={<CommunityReports />} />
        <Route path="/admin-panel" element={<AdminPanel />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="view-complaints" element={<AdminViewComplaints />} />
          <Route path="activities" element={<RecentActivities />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
