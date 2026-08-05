import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../services/adminComplaintService";
import StatusBadge from "../components/common/StatusBadge";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
  status: "",
  category: "",
});


  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
  try {
    setLoading(true);
    const data = await getAllComplaints(filters);
    setComplaints(data);
  } catch (err) {
    console.error("Failed to fetch complaints", err);
  } finally {
    setLoading(false);
  }
};


  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading complaints...</div>;
  }

  if (!complaints.length) {
    return <div className="p-6">No complaints found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>
      <div className="flex gap-4 mb-4">
  <select
    value={filters.status}
    onChange={(e) =>
      setFilters({ ...filters, status: e.target.value })
    }
    className="border px-3 py-2 rounded text-sm"
  >
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>

  <select
    value={filters.category}
    onChange={(e) =>
      setFilters({ ...filters, category: e.target.value })
    }
    className="border px-3 py-2 rounded text-sm"
  >
    <option value="">All Types</option>
    <option value="Garbage">Garbage</option>
    <option value="Road">Road</option>
    <option value="Water">Water</option>
  </select>

  <button
    onClick={fetchComplaints}
    className="px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
  >
    Apply Filters
  </button>
</div>


      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr
                key={c._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Title */}
                <td className="px-4 py-3 font-medium">
                  {c.description || "—"}
                </td>

                {/* Reported By */}
                <td className="px-4 py-3">
                  {c.reportedBy?.name || "—"}
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  {c.address || "—"}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  {c.issueType || "—"}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                {/* Assigned To */}
                <td className="px-4 py-3">
                  {c.assignedTo?.name || "Unassigned"}
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  {new Date(c.createdAt).toLocaleString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 space-x-2">
                  {c.status !== "Resolved" && (
                    <button
                      onClick={() =>
                        handleStatusChange(c._id, "Resolved")
                      }
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}

                  {c.status === "Resolved" && (
                    <button
                      onClick={() =>
                        handleStatusChange(c._id, "In Progress")
                      }
                      className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                    >
                      Reopen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaintsPage;



