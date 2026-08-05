import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-leaf.png";
import PieChart from "../components/common/PieChart";
import RecentActivities from "../components/admin/RecentActivities";
// import { exportComplaints } from "../services/adminComplaintService";
import { useEffect, useState } from "react";
import { getAllComplaints, exportComplaints } from "../services/adminComplaintService";


const AdminPage = () => {

  const [recentComplaints, setRecentComplaints] = useState([]);
const [showFilters, setShowFilters] = useState(false);

const [filters, setFilters] = useState({
  status: "",
  issueType: "",
});

const [showExport, setShowExport] = useState(false);


const fetchRecentComplaints = async () => {
    try {
      const data = await getAllComplaints(filters);
      setRecentComplaints(data.slice(0, 5)); // only recent 5
    } catch (err) {
      console.error("Failed to fetch recent complaints", err);
    }
  };

  useEffect(() => {
    fetchRecentComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Header */}
      <header className="bg-gradient-to-r from-teal-100 to-teal-50 border-b border-teal-200 px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" alt="logo" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">CleanStreet</span>
              <span className="text-xs bg-teal-700 text-white px-2 py-1 rounded font-medium">Admin</span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="flex gap-8 text-gray-700 font-medium text-sm">
            <Link to="/" className="hover:text-teal-700 transition">Dashboard</Link>
            <Link to="/complaints" className="hover:text-teal-700 transition">Complaints</Link>
            <Link to="/report-issue" className="hover:text-teal-700 transition">Report Issue</Link>
            <Link to="/admin" className="text-teal-700 font-semibold">Admin Panel</Link>
          </nav>

          {/* Right Icons and Profile */}
          <div className="flex gap-3 items-center">
            <button className="p-2 hover:bg-teal-200/50 rounded-full transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-teal-200/50 rounded-full transition relative">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-teal-200/50 rounded-full transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Admin Panel</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* System Overview Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">System Overview</h1>
          <p className="text-gray-600 text-sm font-bold">Monitor and manage all platform activities</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Admin Panel - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-teal-200/80 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Admin Panel</span>
              </h2>
              <nav className="space-y-1">
                <Link to="/admin" className="flex items-center gap-3 px-3 py-2 bg-teal-300/70 text-gray-800 rounded-lg font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="underline">Overview</span>
                </Link>
                <Link to="/admin/complaints" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-300/40 transition font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="underline">View Complaints</span>
                </Link>
                <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-300/40 transition font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="underline">Manage Users</span>
                </Link>
                <Link to="/reports" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-300/40 transition font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="underline">Recent Activities</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Stats Cards and Community Impact - Right Side */}
          <div className="lg:col-span-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Total Complaints Card */}
              <div className="bg-teal-200/80 rounded-2xl p-5 shadow-sm">
                <div className="bg-white/90 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">1847</h3>
                <p className="text-gray-700 text-xs font-medium">Total Complaints</p>
              </div>

              {/* Pending Review Card */}
              <div className="bg-purple-200/70 rounded-2xl p-5 shadow-sm">
                <div className="bg-white/90 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">4</h3>
                <p className="text-gray-700 text-xs font-medium">Pending Review</p>
              </div>

              {/* Active Users Card */}
              <div className="bg-teal-300/60 rounded-2xl p-5 shadow-sm">
                <div className="bg-white/90 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">1,234</h3>
                <p className="text-gray-700 text-xs font-medium">Active Users</p>
              </div>

              {/* Resolved Today Card */}
              <div className="bg-purple-300/60 rounded-2xl p-5 shadow-sm">
                <div className="bg-white/90 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">12</h3>
                <p className="text-gray-700 text-xs font-medium">Resolved Today</p>
              </div>
            </div>

            {/* Community Impact Banner */}
            <div className="bg-teal-200/60 rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Community Impact</span>
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">
                Thanks to citizen reports and community engagement, we've resolved{" "}
                <span className="font-bold text-teal-700">9 issues</span> this month, making our city cleaner and safer for everyone, everyone.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-sm font-bold text-gray-800 mb-4">
          Statistical Analytics
       </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          {/* Complaint Status */}
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <h3 className="text-xs font-bold text-gray-800 mb-2">
              Complaint Status
            </h3>
            <PieChart
              data={[
                { label: "Resolved", value: 2 },
                { label: "Pending", value: 1 },
              ]}
              colors={["#10B981", "#EF4444"]}
            />
          </div>

          {/* Complaint Types */}
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <h3 className="text-xs font-bold text-gray-800 mb-2">
              Complaint Types
            </h3>
            <PieChart
              data={[
                { label: "Road", value: 1 },
                { label: "Water", value: 1 },
                { label: "Garbage", value: 1 },
              ]}
              colors={["#A855F7", "#3B82F6", "#EC4899"]}
            />
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <h3 className="text-xs font-bold text-gray-800 mb-2">
              User Roles
            </h3>
            <PieChart
              data={[
                { label: "Admin", value: 1 },
                { label: "Volunteer", value: 3 },
                { label: "User", value: 6 },
              ]}
              colors={["#EF4444", "#10B981", "#6B7280"]}
            />
          </div>

        </div>
        {/* Bottom Row - Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Complaints - Left */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Recent Complaints</span>
              </h2>

            <div className="flex gap-2">

  {/* FILTER WRAPPER */}
  <div className="relative">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      Filter
    </button>

    {/* FILTER DROPDOWN */}
    {showFilters && (
      <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-md p-3 z-30 w-48">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
          className="w-full border px-2 py-1 text-xs rounded mb-2"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={filters.issueType}
          onChange={(e) =>
            setFilters({ ...filters, issueType: e.target.value })
          }
          className="w-full border px-2 py-1 text-xs rounded mb-2"
        >
          <option value="">All Categories</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Garbage">Garbage</option>
        </select>

        <button
          onClick={() => {
            fetchRecentComplaints();
            setShowFilters(false);
          }}
          className="w-full bg-teal-600 text-white text-xs py-1 rounded"
        >
          Apply Filters
        </button>
      </div>
    )}
  </div>

  {/* EXPORT WRAPPER */}
  <div className="relative">
    <button
      className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
      onClick={() => setShowExport(!showExport)}
    >
      Export
    </button>

    {showExport && (
      <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-md z-30">
        <button
          onClick={() => exportComplaints("pdf", filters)}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-sm"
        >
          Export as PDF
        </button>
        <button
          onClick={() => exportComplaints("word", filters)}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-sm"
        >
          Export as Word
        </button>
      </div>
    )}
  </div>

</div>
</div>

            <div className="space-y-3">
  {recentComplaints.map((c) => (
    <div
      key={c._id}
      className="bg-gray-50 rounded-xl p-3 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-xs">
            {c.issueTitle || "No Title"}
          </h3>
          <p className="text-[10px] text-gray-600">
            Reported by {c.reportedBy?.name || "Unknown"}
          </p>
        </div>

        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-900 text-[10px] rounded">
          {c.status}
        </span>
      </div>

      <p className="text-[10px] text-gray-600">
        📍 {c.address || "Not specified"}
      </p>
    </div>
  ))}
</div>
</div>

          {/* Quick Actions - Middle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h2>
            <div className="space-y-2 mb-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-xs font-medium">
                <span>+</span>
                <span>Add New Complaint</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Manage Users</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>View Analytics</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Recent Activity</span>
              </h2>
              <div className="space-y-1">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-purple-600">•</span>
                  <span className="text-gray-700">New complaint submitted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Trends - Right */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Complaint Trends (6 Months)</span>
            </h2>
            <div className="relative h-48 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <svg className="w-full h-full" viewBox="0 0 350 160">
                {/* Y-axis labels */}
                <text x="5" y="15" fill="#374151" fontSize="9">220</text>
                <text x="5" y="45" fill="#374151" fontSize="9">165</text>
                <text x="5" y="75" fill="#374151" fontSize="9">110</text>
                <text x="5" y="105" fill="#374151" fontSize="9">55</text>
                <text x="5" y="135" fill="#374151" fontSize="9">0</text>
                
                {/* X-axis labels */}
                <text x="50" y="155" fill="#374151" fontSize="9">Jan</text>
                <text x="90" y="155" fill="#374151" fontSize="9">Feb</text>
                <text x="130" y="155" fill="#374151" fontSize="9">Mar</text>
                <text x="170" y="155" fill="#374151" fontSize="9">Apr</text>
                <text x="210" y="155" fill="#374151" fontSize="9">May</text>
                <text x="250" y="155" fill="#374151" fontSize="9">Jun</text>
                
                {/* Grid lines */}
                <line x1="30" y1="135" x2="300" y2="135" stroke="#374151" strokeWidth="1.5" />
                <line x1="30" y1="10" x2="30" y2="135" stroke="#374151" strokeWidth="1.5" />
                
                {/* Teal/Green line */}
                <polyline
                  points="50,115 90,85 130,65 170,70 210,55 250,40 290,45"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />
                <circle cx="50" cy="115" r="4" fill="#10B981" />
                <circle cx="90" cy="85" r="4" fill="#10B981" />
                <circle cx="130" cy="65" r="4" fill="#10B981" />
                <circle cx="170" cy="70" r="4" fill="#10B981" />
                <circle cx="210" cy="55" r="4" fill="#10B981" />
                <circle cx="250" cy="40" r="4" fill="#10B981" />
                <circle cx="290" cy="45" r="4" fill="#10B981" />
                
                {/* Purple line */}
                <polyline
                  points="50,130 90,105 130,90 170,85 210,95 250,85 290,75"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                />
                <circle cx="50" cy="130" r="4" fill="#A855F7" />
                <circle cx="90" cy="105" r="4" fill="#A855F7" />
                <circle cx="130" cy="90" r="4" fill="#A855F7" />
                <circle cx="170" cy="85" r="4" fill="#A855F7" />
                <circle cx="210" cy="95" r="4" fill="#A855F7" />
                <circle cx="250" cy="85" r="4" fill="#A855F7" />
                <circle cx="290" cy="75" r="4" fill="#A855F7" />
              </svg>
            </div>
          </div>

          </div> 
      </div>
    </div>
  );
};

export default AdminPage;

