import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  User,
  Shield,
  Lock,
  Pencil,
  Calendar,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";

/* ================= NAVBAR ================= */

/* ================= NAVBAR ================= */

function Navbar() {
  const base = "px-3 py-2 text-sm font-medium transition-all duration-200";
  const active = "text-[#7e5511] border-b-2 border-[#7e5511]";
  const inactive = "text-gray-600 hover:text-[#7e5511]";

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-50">
      <div className="w-full h-14 px-4 md:px-6 flex items-center justify-between">

        {/* LEFT LOGO */}
        <div className="flex items-center">
          <img src="/street-light-icon.svg" className="h-8 w-8" alt="logo" />
          <h1 className="text-xl font-bold text-[#7e5511] ml-1">
            CleanStreet
          </h1>
        </div>

        {/* CENTER MENU */}
        <div className="hidden md:flex gap-10 text-[15px] font-medium">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/report", label: "Report Issue" },
                { to: "/view-complaints", label: "View Complaints" },
                { to: "/profile", label: "Profile" },
              ].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `relative group transition ${
                      isActive
                        ? "text-[#7e5511] font-semibold"
                        : "text-black hover:text-[#7e5511]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-[#7e5511] transition-all duration-300
                         ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      ></span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
        

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="px-4 py-1 bg-[#7e5511] text-white rounded-md text-sm hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ================= PROFILE ================= */
export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileRef = useRef(null);

  /* 🔐 Password States */
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setFormData(res.data.user);
        setAvatar(res.data.user.avatar || null);

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(res.data.user)
        );
      } catch (err) {
        console.log("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= UPDATE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile/update",
        {
          userId: user._id,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));

      alert("Profile Updated Successfully");
      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert("Profile Update Failed");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return alert("All fields are required");

    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    if (newPassword.length < 6)
      return alert("Password must be at least 6 characters");

    const token = localStorage.getItem("token");
    if (!token) return alert("Login expired, please login again");

    try {
      setPwdLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) return alert(res.data.message);

      alert("Password Updated Successfully");

      setOpenPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      alert("Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">No User Found</div>;

  return (
    <>
      <Navbar />

      {/* ================= PASSWORD MODAL ================= */}
      {openPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">

            <h2 className="text-xl font-semibold mb-4 text-[#7e5511]">
              Change Password
            </h2>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full border p-2 rounded mb-3"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border p-2 rounded mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-1 border rounded"
                onClick={() => setOpenPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-1 bg-[#7e5511] text-white rounded disabled:opacity-60"
                disabled={pwdLoading}
                onClick={handleChangePassword}
              >
                {pwdLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAGE ================= */}
      <div className="bg-[#F6EDE3] px-4 md:px-10 pt-4 pb-8 min-h-screen">

        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-black">Profile</h1>
          <p className="text-sm text-gray-700">
            Manage your account information and preferences
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">

          {/* LEFT CARD */}
          <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-[#e7d3b1] flex items-center justify-center text-2xl font-bold text-[#7e5511] overflow-hidden">
                {avatar ? (
                  <img src={avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  user.username?.slice(0, 2).toUpperCase()
                )}
              </div>

              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-[#7e5511] p-2 rounded-full text-white shadow hover:scale-105"
              >
                <Camera size={14} />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const form = new FormData();
                  form.append("userId", user._id);
                  form.append("avatar", file);

                  try {
                    const res = await axios.post(
                      "http://localhost:5000/api/auth/profile/avatar",
                      form,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    setAvatar(res.data.avatar);
                    const updatedUser = { ...user, avatar: res.data.avatar };
                    setUser(updatedUser);
                    localStorage.setItem(
                      "loggedInUser",
                      JSON.stringify(updatedUser)
                    );

                    alert("Profile Picture Updated");
                  } catch (err) {
                    console.log(err);
                    alert("Upload Failed");
                  }
                }}
              />
            </div>

            <h3 className="text-lg font-semibold">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>

            <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#f1e3cc] text-[#7e5511]">
              {user.role || "Citizen"}
            </span>

            <div className="text-sm text-gray-600 space-y-2 pt-3">
              <Info icon={<ClipboardList size={16} />} label="Total Reports" value="0" />
              <Info icon={<AlertCircle size={16} />} label="Pending Issues" value="0" />
              <Info icon={<CheckCircle size={16} />} label="Resolved Issues" value="0" />
              <Info icon={<Calendar size={16} />} label="Member Since" value="2025" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User size={18} /> Account Information
                </h2>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-1 text-[#7e5511]"
                >
                  <Pencil size={16} />
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Username" name="username" value={formData.username} edit={editMode} onChange={handleChange} />
                <Field label="Full Name" name="fullName" value={formData.fullName} edit={editMode} onChange={handleChange} />
                <Field label="Email" name="email" value={formData.email} edit={editMode} onChange={handleChange} />
                <Field label="Phone" name="phone" value={formData.phone} edit={editMode} onChange={handleChange} />
                <Field label="Location" name="location" value={formData.location} edit={editMode} onChange={handleChange} />
              </div>

              <label className="text-sm font-medium mt-4 block">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                readOnly={!editMode}
                placeholder="Tell us about yourself"
                className="w-full mt-1 p-2 border rounded-md h-24"
              />

              {editMode && (
                <button
                  onClick={saveProfile}
                  className="mt-4 px-6 py-2 bg-[#c89b57] text-white rounded-md"
                >
                  Save Changes
                </button>
              )}
            </div>

            {/* SECURITY */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Shield size={18} /> Security Settings
              </h2>

              <div className="flex gap-3 mt-2">
  <button
    className="flex items-center gap-2 px-5 py-2 border border-[#c89b57] rounded-md hover:bg-[#c89b57]/10 transition"
    onClick={() => setOpenPasswordModal(true)}
  >
    <Lock size={16} /> Change Password
  </button>

  <button
    className="flex items-center gap-2 px-5 py-2 border border-[#c89b57] rounded-md hover:bg-[#c89b57]/10 transition"
  >
    ⚙️ Privacy Settings
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
/* ================= SMALL COMPONENTS ================= */
function Field({ label, name, value, edit, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        name={name}
        value={value || ""}
        placeholder={`Enter ${label}`}
        onChange={onChange}
        readOnly={!edit}
        className="w-full mt-1 p-2 border rounded-md focus:ring-1 focus:ring-[#c89b57]"
      />
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
