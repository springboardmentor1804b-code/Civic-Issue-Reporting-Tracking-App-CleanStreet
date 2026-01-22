import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, UserCog, UserPlus } from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load admin activity", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ROLE_CHANGE":
      case "DELETE_USER":
        return <UserCog size={18} />;
      case "ASSIGN_VOLUNTEER":
        return <UserPlus size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading activities…</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#ead9c2]">
      <h2 className="px-6 py-4 text-lg font-semibold border-b">
        Recent Admin Activities
      </h2>

      {logs.length === 0 ? (
        <p className="p-6 text-gray-500">No admin activities found</p>
      ) : (
        <ul className="divide-y">
          {logs.map((log) => (
            <li key={log._id} className="flex gap-4 px-6 py-4">
              {/* ICON */}
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#f3e8d6] text-[#7e5511]">
                {getIcon(log.actionType)}
              </div>

              {/* CONTENT */}
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">
                    {log.performedBy?.username || "Admin"}
                  </span>{" "}
                  — {log.description}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
