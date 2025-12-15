import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f6ede2]">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center  font-bold text-xl text-[#7e5511]">
          <img src="/street-light-icon.svg" alt="logo" className="w-7" />
          CleanStreet
        </div>

        <div className="hidden md:flex gap-6 font-medium">
          <Link to="/dashboard" className="text-black font-semibold">
            Dashboard
          </Link>
          <Link to="/report" className="hover:text-[#d09347]">
            Report Issue
          </Link>
          <Link to="/complaints" className="hover:text-[#d09347]">
            View Complaints
          </Link>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold">
            Login
          </button>
          <button className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold">
            Register
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="px-8 py-8 max-w-7xl mx-auto">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total reports" value="0" icon="📊" />
          <StatCard title="Pending" value="0" icon="⏳" />
          <StatCard title="In Progress" value="0" icon="📈" />
          <StatCard title="Resolved" value="0" icon="💡" />
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">

          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              Recent Activity
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-medium">
                  Pothole on Main Street resolved
                </p>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div>
                <p className="font-medium">
                  New streetlight issue reported
                </p>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>

              <div>
                <p className="font-medium">
                  Garbage dump complaint updated
                </p>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">
            <Link
              to="/report"
              className="flex items-center justify-center gap-2 bg-[#7e5511] text-white py-3 rounded-lg font-semibold shadow"
            >
              ➕ Report Issue
            </Link>

            <Link
              to="/complaints"
              className="flex items-center gap-2 bg-white py-3 px-4 rounded-lg shadow text-gray-700"
            >
              📋 View all complaints
            </Link>

            <Link
              to="/map"
              className="flex items-center gap-2 bg-white py-3 px-4 rounded-lg shadow text-gray-700"
            >
              📍 Issue map
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE STAT CARD ---------- */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  );
}
