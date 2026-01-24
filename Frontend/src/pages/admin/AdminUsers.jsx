import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROLE_COLORS } from "../../constants/roleColors";

const API = "http://localhost:5000/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= UPDATE ROLE ================= */
  const updateUserRole = async (id, newRole, currentRole) => {
    if (newRole === currentRole) return;

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers(); // refresh table
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = users.filter((u) => {
    const roleMatch =
      roleFilter === "all" || u.role === roleFilter;

    const locationMatch =
      locationFilter === "all" || u.location === locationFilter;

    return roleMatch && locationMatch;
  });

  const locations = [
    ...new Set(users.map((u) => u.location).filter(Boolean)),
  ];

  if (loading) {
    return <div className="p-10 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-4">

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} users
        </p>

        <div className="flex gap-3">
          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
          </select>

          <button
            onClick={() => {
              setRoleFilter("all");
              setLocationFilter("all");
            }}
            className="text-sm text-[#7e5511] underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-[#ead9c2] rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f3e8d6] text-[#4b2e07]">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.location || "—"}</td>

                  {/* ROLE BADGE */}
                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
                      style={{
                        backgroundColor:
                          ROLE_COLORS[u.role] || "#9CA3AF",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <select
                      value={u.role}
                      disabled={u.role === "admin"}
                      onChange={(e) =>
                        updateUserRole(
                          u._id,
                          e.target.value,
                          u.role
                        )
                      }
                      className="border px-2 py-1 text-xs rounded
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="volunteer">Volunteer</option>
                    </select>

                    {u.role === "admin" && (
                      <p className="text-xs text-gray-400 mt-1">
                        Admin role locked
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
