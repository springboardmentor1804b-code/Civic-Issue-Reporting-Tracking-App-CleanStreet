import React from "react";
import { useNavigate } from "react-router-dom";
import streetLight from "/street-light-icon.svg";

export default function Profile() {
  const nav = useNavigate();

  // Load logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#ecdbc6] text-[#3f3f3f] font-inter">

      {/* NAVBAR */}
      <header className="bg-white flex justify-between items-center px-10 py-4 border-b">
        
        <div className="flex items-center space-x-3">
          <img src={streetLight} className="w-10" alt="logo" />
          <h2 className="font-semibold text-xl">clean street</h2>
        </div>

        <nav className="flex space-x-6 text-[15px]">
          <button onClick={() => nav("/dashboard")} className="hover:underline">Dashboard</button>
          <button onClick={() => nav("/report")} className="hover:underline">Report Issue</button>
          <button onClick={() => nav("/complaints")} className="hover:underline">View Complaints</button>
          <button onClick={() => nav("/admin")} className="hover:underline">Admin</button>
          <button onClick={() => nav("/profile")} className="hover:underline">profile</button>
        </nav>

        {/* USERNAME + LOGOUT */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => nav("/profile")}
            className="px-5 py-1.5 rounded-full bg-[#c89b57] text-white font-semibold"
          >
            {loggedInUser?.username}
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-1.5 rounded-full bg-black text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex px-10 py-10 space-x-10">

        {/* LEFT CARD */}
        <div className="w-1/3 bg-white rounded-xl p-8 text-center shadow">

          <div className="w-32 h-32 bg-[#d5c3b2] rounded-full mx-auto flex items-center justify-center text-3xl font-bold">
            {loggedInUser?.username?.slice(0, 2).toUpperCase()}
          </div>

          <h3 className="mt-6 text-xl font-medium">{loggedInUser?.username}</h3>
          <p className="text-gray-500">@{loggedInUser?.username}</p>

        </div>

        {/* RIGHT CARD */}
        <div className="w-2/3 bg-white rounded-xl p-8 shadow">

          <div className="flex items-center">
            <div>
              <h3 className="text-2xl font-semibold">Account Information</h3>
              <p className="text-gray-500 text-sm">update your personal details</p>
            </div>

            <button className="ml-auto text-lg">✏️ Edit</button>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-2 gap-6 mt-6">

            <div>
              <label className="text-sm">Username</label>
              <input
                type="text"
                defaultValue={loggedInUser?.username}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                defaultValue="demo@cleanstreet.com"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                defaultValue="Demo_User"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm">Phone Number</label>
              <input
                type="text"
                defaultValue="+91"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm">Location</label>
              <input
                type="text"
                defaultValue="Downtown District"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm">Bio</label>
              <textarea
                defaultValue="Active citizens helping to improve our community through CleanStreet Reporting"
                className="w-full mt-1 p-2 border rounded-md h-28"
              ></textarea>
            </div>

          </div>
        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-white w-11/12 mx-auto p-8 rounded-xl shadow">

        <h3 className="text-2xl font-semibold">Security Settings</h3>
        <p className="text-gray-500 text-sm">Manage your account security and privacy</p>

        <div className="flex space-x-6 mt-6">
          <button className="px-5 py-2 border border-[#c89b57] rounded-md">
            🔒 Change Password
          </button>

          <button className="px-5 py-2 border border-[#c89b57] rounded-md">
            ⚙️ Privacy Settings
          </button>
        </div>

      </div>
    </div>
  );
}
