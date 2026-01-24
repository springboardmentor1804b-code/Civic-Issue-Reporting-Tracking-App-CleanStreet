import { useEffect, useState, useRef } from "react";
import {
  fetchAdminDashboard,
  exportAdminPDF,
  exportAdminExcel
} from "../../services/admin.service";

import AdminUsers from "./AdminUsers";
import AdminComplaints from "./AdminComplaints";
import AdminActivity from "./AdminActivity";

import PieBox from "../../components/charts/PieBox";
import LineBox from "../../components/charts/LineBox";
import BarBox from "../../components/charts/BarBox";
import HorizontalBarBox from "../../components/charts/HorizontalBarBox";

import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle
} from "lucide-react";

export default function AdminDashboard() {
  /* ================= STATE ================= */
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pending: 0,
    resolved: 0
  });

const [charts, setCharts] = useState({
  statusChart: [],
  typeChart: [],
  roleChart: [],
  last7DaysComplaints: [],
  last30DaysUsers: [],
  monthlyComplaints: [],
  topComplaintTypes: []
});

  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDownload, setShowDownload] = useState(false);
  const dropdownRef = useRef(null);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetchAdminDashboard();
        const { cards, charts } = res.data;

setStats({
  totalUsers: cards.totalUsers,
  totalComplaints: cards.totalReports,
  pending: cards.pending,
  resolved: cards.resolved
});

setCharts({
  statusChart: charts.complaintStatus,
  typeChart: charts.complaintTypes,
  roleChart: charts.userRoles,
  last7DaysComplaints: charts.complaintsLast7Days,
  last30DaysUsers: charts.usersLast30Days,
  monthlyComplaints: charts.monthlyComplaints,
  topComplaintTypes: charts.top5ComplaintTypes
});

      } catch (err) {
        console.error(err);
        setError("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  /* ================= CLOSE DOWNLOAD DROPDOWN ================= */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDownload(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= EXPORT =====*/
  const downloadFile = (data, filename) => {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const res = await exportAdminPDF();
    downloadFile(res.data, "admin-report.pdf");
  };

  const handleExportExcel = async () => {
    const res = await exportAdminExcel();
    downloadFile(res.data, "admin-report.xlsx");
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading admin dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* ================= HERO + SUB NAVBAR ================= */}
      <div className="bg-[#f6ede3] rounded-xl px-6 py-6 space-y-6">

        {/* TITLE + DOWNLOAD */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              System overview & analytics
            </p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDownload(!showDownload)}
              className="bg-[#7e5511] hover:bg-[#6b480e] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Download Report ▼
            </button>

            {showDownload && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e0c9a6] rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    handleExportPDF();
                    setShowDownload(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#f6ede3]"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    handleExportExcel();
                    setShowDownload(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#f6ede3]"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUB NAVBAR */}
        <div className="border-b border-[#e0c9a6]">
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            {["Overview", "Users", "Complaints", "Activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition ${
                  activeTab === tab
                    ? "text-[#7e5511] border-b-2 border-[#7e5511]"
                    : "hover:text-[#7e5511]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <>
          <SectionHeader
            title="Overview"
            subtitle="Quick summary of users and complaints"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <OverviewCard
  title="Total Users"
  value={stats.totalUsers}
  icon={<Users size={22} />}
  bgColor="bg-purple-100"
  iconColor="text-purple-600"
/>

<OverviewCard
  title="Total Complaints"
  value={stats.totalComplaints}
  icon={<ClipboardList size={22} />}
  bgColor="bg-blue-100"
  iconColor="text-blue-600"
/>

<OverviewCard
  title="Pending Complaints"
  value={stats.pending}
  icon={<Clock size={22} />}
  bgColor="bg-yellow-100"
  iconColor="text-yellow-600"
/>

<OverviewCard
  title="Resolved Complaints"
  value={stats.resolved}
  icon={<CheckCircle size={22} />}
  bgColor="bg-green-100"
  iconColor="text-green-600"
/>

          </div>

          <SectionHeader
            title="Statistics & Analytics"
            subtitle="Visual insights into complaints and users"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <PieBox title="Complaint Status Distribution" data={charts.statusChart} />
            <PieBox title="Complaint Types" data={charts.typeChart} />
            <PieBox title="User Roles" data={charts.roleChart} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LineBox title="Complaints (Last 7 Days)" data={charts.last7DaysComplaints} />
            <LineBox title="User Registrations (Last 30 Days)" data={charts.last30DaysUsers} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BarBox title="Monthly Complaint Trends (6 Months)" data={charts.monthlyComplaints} />
            <HorizontalBarBox title="Top 5 Complaint Types" data={charts.topComplaintTypes} />
          </div>
        </>
      )}

      {/* USERS */}
      {activeTab === "Users" && (
        <>
          <SectionHeader title="Users" subtitle="Manage registered users" />
          <AdminUsers />
        </>
      )}

      {/* COMPLAINTS */}
      {activeTab === "Complaints" && (
        <>
          <SectionHeader title="Complaints" subtitle="View and manage complaints" />
          <AdminComplaints />
        </>
      )}

      {/* ACTIVITY */}
      {activeTab === "Activity" && (
        <>
          <SectionHeader title="Activity" subtitle="Recent admin actions" />
          <AdminActivity />
        </>
      )}
    </div>
  );
}

/* ================= SECTION HEADER ================= */
function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#7e5511] text-lg">📊</span>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ================= OVERVIEW CARD ================= */
function OverviewCard({ title, value, icon, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          {value ?? 0}
        </p>
      </div>

      {/* ICON BADGE */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}
      >
        <span className={iconColor}>
          {icon}
        </span>
      </div>
    </div>
  );
}

