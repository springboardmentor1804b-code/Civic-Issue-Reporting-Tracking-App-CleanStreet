import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Hourglass,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const isAdmin = user?.role === "admin";
  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);
  const [activities, setActivities] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!token || !user?._id) return;

    /* ---- USER REPORTS (used by both admin & user stats) ---- */
    const fetchUserReports = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/report/my-reports",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        setReports(list);

        setStats({
          total: list.length,
          pending: list.filter(r => r.status === "Pending").length,
          inProgress: list.filter(r => r.status === "In Progress").length,
          resolved: list.filter(r => r.status === "Completed").length,
        });
      } catch (err) {
        console.error("Failed to fetch user reports", err);
      }
    };

    /* ---- RECENT ACTIVITY (ADMIN SOURCE, USER FILTERED) ---- */
    const fetchRecentActivity = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/dashboard/recent-activity",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        const allActivities = data?.activities || [];

        // 👇 USERS SEE ONLY THEIR RELATED ACTIVITIES
        if (!isAdmin) {
          const userActivities = allActivities.filter(
            a => a.userId === user._id || a.reportUserId === user._id
          );
          setActivities(userActivities);
        } else {
          setActivities(allActivities);
        }
      } catch (err) {
        console.error("Failed to fetch recent activity", err);
      }
    };

    fetchUserReports();
    fetchRecentActivity();
  }, [user?._id, isAdmin, token]);

  return (
    <div className="min-h-screen bg-[#f6ede2]">
      <div className="px-8 py-8 max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hi 👋 Welcome,&nbsp;
              <span className="font-extrabold text-[#7e5511]">
                {user?.username || "User"}
              </span>
              !
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your reports.
            </p>
          </div>

          <Link
            to="/report"
            className="bg-[#7e5511] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#6b480e]"
          >
            ➕ Report Issue
          </Link>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Reports"
            value={stats.total}
            icon={<BarChart3 size={20} className="text-white" />}
            bg="bg-[#7e5511]"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Hourglass size={20} className="text-white" />}
            bg="bg-yellow-500"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<TrendingUp size={20} className="text-white" />}
            bg="bg-blue-500"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle size={20} className="text-white" />}
            bg="bg-green-600"
          />
        </div>

        {/* ================= USER REPORTED ISSUES ================= */}
        {!isAdmin && (
          <>
            <h2 className="text-xl font-bold mb-4">Reported Issues</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              {reports.length === 0 ? (
                <p className="text-gray-500">
                  You haven’t reported any issues yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {reports.slice(0, 5).map(r => (
                    <li
                      key={r._id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="font-medium text-gray-800">
                        {r.title}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          r.status === "Completed"
                            ? "text-green-600"
                            : r.status === "In Progress"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* ================= RECENT ACTIVITY (SAME FOR ALL) ================= */}
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {activities.length === 0 ? (
            <p className="text-gray-500">No recent activity</p>
          ) : (
            activities.slice(0, 6).map(item => (
              <Record
                key={item._id}
                text={item.description}
                time={new Date(item.createdAt).toLocaleString()}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
}

function Record({ text, time }) {
  return (
    <div className="mb-4">
      <p className="font-medium">{text}</p>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}
