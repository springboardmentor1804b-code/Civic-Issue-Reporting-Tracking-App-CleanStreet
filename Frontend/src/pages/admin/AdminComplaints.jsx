import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function AdminComplaints() {
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [reportsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setReports(reportsRes.data || []);
      setVolunteers(usersRes.data.filter((u) => u.role === "volunteer"));
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= ASSIGN VOLUNTEER ================= */
  const assignVolunteer = async (reportId, volunteerId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/admin/reports/${reportId}/assign`,
        { volunteerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
    } catch {
      alert("Failed to assign volunteer");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/admin/reports/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= FILTER ================= */
  const filteredReports = reports.filter((r) => {
    const locMatch =
      locationFilter === "all" || r.location === locationFilter;
    const statusMatch =
      statusFilter === "all" || r.status === statusFilter;
    return locMatch && statusMatch;
  });

  const locations = [
    ...new Set(reports.map((r) => r.location).filter(Boolean)),
  ];

  if (loading) {
    return <div className="p-10 text-center">Loading complaints…</div>;
  }

  return (
    <div className="space-y-6">

      {/* FILTER BAR */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-sm text-gray-500">
          Showing {filteredReports.length} complaints
        </p>

        <div className="flex gap-3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#ead9c2] rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f3e8d6] text-[#4b2e07]">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned Volunteer</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((r) => {
              const availableVolunteers = volunteers.filter(
                (v) => v.location === r.location
              );

              return (
                <tr key={r._id} className="border-t">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.userId?.username || "User"}</td>
                  <td className="p-3">{r.location}</td>
                  <td className="p-3">{r.category}</td>

                  {/* STATUS BADGE */}
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${r.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        r.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        r.status === "Completed" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"}`}>
                      {r.status}
                    </span>
                  </td>

                  {/* ASSIGNED VOLUNTEER */}
                  <td className="p-3">
                    {r.assignedTo ? (
                      <span className="font-semibold text-green-700">
                        {r.assignedTo.username}
                      </span>
                    ) : availableVolunteers.length === 0 ? (
                      <span className="text-gray-400 text-sm">
                        No volunteers
                      </span>
                    ) : (
                      <select
                        onChange={(e) =>
                          assignVolunteer(r._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Assign Volunteer
                        </option>
                        {availableVolunteers.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.username}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* STATUS ACTION */}
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateStatus(r._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                      disabled={!r.assignedTo && r.status !== "Rejected"}
                    >
                      {!r.assignedTo && (
                        <>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </>
                      )}
                      {r.assignedTo && (
                        <>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </>
                      )}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION PLACEHOLDER */}
      <div className="flex justify-center">
        <button className="bg-[#7e5511] text-white px-4 py-1.5 rounded-md">
          1
        </button>
      </div>
    </div>
  );
}
