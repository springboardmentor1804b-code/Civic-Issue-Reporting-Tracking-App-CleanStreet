import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  Hourglass,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

/* ===================== Navbar ===================== */
const Navbar = () => {
  return (
    <header className="w-full">
      {/* BIG HEADER */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-wide">
            User Dashboard
          </h1>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="bg-yellow-100 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          {/* LEFT LOGO */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shadow">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold tracking-wide text-gray-900">
              CleanStreet
            </span>
          </div>

          {/* CENTER MENU */}
          <nav className="flex gap-10 text-sm md:text-base font-medium text-gray-700 mx-auto">
            <Link
              to="/dashboard"
              className="hover:text-red-600 transition no-underline"
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              className="hover:text-red-600 transition no-underline"
            >
              Report Issue
            </Link>
            <Link
              to="/complaints"
              className="hover:text-red-600 transition no-underline"
            >
              View Complaints
            </Link>
          </nav>

          {/* RIGHT AUTH */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="border px-4 py-2 rounded bg-white text-sm hover:bg-gray-50 no-underline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm shadow no-underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

/* ===================== Footer ===================== */
const Footer = () => (
  <footer className="bg-gray-100 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
      <div className="flex justify-center space-x-6 mb-3">
        <a
          href="#"
          className="text-gray-600 hover:text-red-600 transition duration-150"
        >
          <Facebook className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-red-600 transition duration-150"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-red-600 transition duration-150"
        >
          <Twitter className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-red-600 transition duration-150"
        >
          <Linkedin className="w-6 h-6" />
        </a>
      </div>

      <div className="text-sm text-gray-600 space-x-4 mb-2">
        <Link
          to="/dashboard"
          className="hover:text-red-600 transition duration-150 no-underline"
        >
          Dashboard
        </Link>
        <span>•</span>
        <Link
          to="/report"
          className="hover:text-red-600 transition duration-150 no-underline"
        >
          Report Issue
        </Link>
        <span>•</span>
        <Link
          to="/complaints"
          className="hover:text-red-600 transition duration-150 no-underline"
        >
          View Complaints
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        &copy; {new Date().getFullYear()} CleanStreet | All Rights Reserved
      </p>
    </div>
  </footer>
);

/* ===================== Reusable UI ===================== */
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
    <div className="flex flex-col items-center">
      <Icon className="w-8 h-8 text-gray-700 mb-2" />
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  </div>
);

const ActivityItem = ({ description, time }) => (
  <div className="flex items-start py-3 border-b last:border-b-0">
    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3">
      +
    </div>
    <div>
      <p className="text-sm font-medium text-gray-800">{description}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

const QuickActionButton = ({ label, primary, to }) => (
  <Link
    to={to}
    className={`block w-full py-2 rounded-md font-semibold text-white text-center no-underline ${
      primary ? "bg-blue-600" : "bg-blue-500"
    } hover:opacity-90`}
  >
    {label}
  </Link>
);

/* ===================== Main User Component ===================== */
const User = () => {
  // Mock Data
  const stats = [
    { title: "Total Issues", value: 4, icon: ShieldAlert },
    { title: "Pending", value: 4, icon: Clock },
    { title: "Resolved", value: 0, icon: CheckCircle },
    { title: "In Progress", value: 0, icon: Hourglass },
  ];

  const recentActivity = [
    { description: "Rajam on Main Street Resolved", time: "2 hours ago" },
    { description: "New Streetlight issue reported", time: "4 hours ago" },
    { description: "Garbage dump complaint updated", time: "8 hours ago" },
    { description: "Initial complaint filed for pothole", time: "1 day ago" },
    { description: "Street cleaning confirmed for Sector 5", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md px-6 py-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-[2fr_1fr] gap-8 items-stretch">
            {/* Recent Activity */}
            <div className="bg-white border border-gray-300 rounded-lg p-5 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Recent Activity
              </h3>

              {/* ✅ Scrollable Area */}
              <div className="h-[220px] md:h-[260px] lg:h-[300px] overflow-y-auto pr-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-300 rounded-lg p-5 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Quick Actions
              </h3>

              <div className="space-y-4 mt-2">
                <QuickActionButton
                  label="+ Report New Issues"
                  primary
                  to="/report"
                />
                <QuickActionButton label="View All Complaints" to="/complaints" />
              </div>

              {/* Optional: Push buttons up if height grows */}
              <div className="flex-grow" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default User;
