import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);


  // IMPORTANT — FINAL BASE URL
  const API = "http://localhost:5000/api";

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API}/report`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setComplaints(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReports();
  }, []);
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const loggedUserId =
    loggedUser?._id || loggedUser?.id || loggedUser?.userId || "";

  /* ================= OPEN MODAL ================= */
  const openModal = async (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
    fetchComments(issue._id);
  };

  /* ================= COMMENTS ================= */
  const fetchComments = async (id) => {
    try {
      const res = await axios.get(`${API}/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post(
        `${API}/comments`,
        {
          complaintId: selectedIssue._id,
          user:
            JSON.parse(localStorage.getItem("loggedInUser"))?.username ||
            "User",
          comment: commentInput,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCommentInput("");
      fetchComments(selectedIssue._id);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LIKE / DISLIKE ================= */
  const react = async (id, type) => {
    try {
      const res = await axios.put(
        `${API}/report/react/${id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );

      setSelectedIssue(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE REPORT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`${API}/report/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setComplaints((prev) => prev.filter((c) => c._id !== id));

      if (selectedIssue && selectedIssue._id === id) {
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6ede2]">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow sticky top-0 z-50">
        <div className="w-full h-14 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/street-light-icon.svg" className="h-8 w-8" alt="logo" />
            <h1 className="text-xl font-bold text-[#7e5511]">CleanStreet</h1>
          </div>

          <button className="md:hidden text-2xl" onClick={() => setOpen(p => !p)}>
            ☰
          </button>

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
                  `relative group transition ${isActive
                    ? "text-[#7e5511] font-semibold"
                    : "text-black hover:text-[#7e5511]"
                  }`
                }
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 h-[2px] bg-[#7e5511] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </div>

          {/* USER AREA */}
          <div className="flex items-center gap-3">
            {(() => {
              const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
              return (
                <>
                  <span className="hidden md:block text-[15px] font-semibold text-[#7e5511] whitespace-nowrap">
                    {user?.username ? `Welcome, ${user.username}` : "Welcome, User"}
                  </span>

                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="h-9 w-9 rounded-full overflow-hidden border-[2px] border-[#7e5511]"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center bg-[#d09347] text-white font-semibold">
                        {(user?.username?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </button>
                </>
              );
            })()}

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="px-5 py-1 border border-black rounded-full hover:bg-[#7e5511] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white shadow flex flex-col px-6 py-3 gap-3">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/report", label: "Report Issue" },
              { to: "/view-complaints", label: "View Complaints" },
              { to: "/profile", label: "Profile" },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="text-black hover:text-[#7e5511]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* ================= REPORT CARDS ================= */}
      <div className="py-10 flex flex-col items-center px-3">
        <h2 className="text-2xl font-bold">Community Reports</h2>
        <p className="text-gray-600 mb-8">Browse issues reported by the community</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 justify-items-center">
          {complaints.map((c) => {
            const reportOwnerId = c?.userId?._id || c?.userId || "";
            const isOwner = loggedUserId.toString() === reportOwnerId.toString();

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl shadow-xl border border-[#ead9c2] p-4 w-full max-w-[360px] hover:-translate-y-1 transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold
    ${c.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : c.status === "In Progress"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                  >
                    {c.status || "Pending"}
                  </span>


                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden border">
                      {c?.userId?.avatar ? (
                        <img src={c.userId.avatar} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#d4b68a] text-white font-bold">
                          {(c?.userId?.username?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                    </div>

                    <span className="text-sm font-semibold">
                      {c?.userId?.username || "User"}
                    </span>
                  </div>
                </div>

                {/* IMAGE */}
                {c.images?.length > 0 && (
                  <img src={c.images[0]} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                )}

                {/* DETAILS */}
                <h3 className="mt-3 text-lg font-bold text-[#4b2e07]">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
                <div className="mt-3 text-sm flex items-center">📍 {c.location}</div>

                {/* FOOTER */}
                <div className="flex justify-between mt-4 text-gray-700 items-center">
                  <div className="flex gap-5">
                    <button
                      disabled={c.likedBy?.includes(loggedUserId)}
                      className={`${c.likedBy?.includes(loggedUserId)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                      onClick={() => react(c._id, "like")}
                    >
                      👍 {c.likes || 0}
                    </button>

                    <button
                      disabled={c.dislikedBy?.includes(loggedUserId)}
                      className={`${c.dislikedBy?.includes(loggedUserId)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                      onClick={() => react(c._id, "dislike")}
                    >
                      👎 {c.dislikes || 0}
                    </button>

                  </div>

                  <div className="flex gap-4 items-center">
                    {(loggedUser?.role === "admin" || isOwner) && (
                      <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    )}

                    <button
                      className="text-[#b8793b] font-semibold hover:underline"
                      onClick={() => openModal(c)}
                    >
                      View Details
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
          <div className="bg-white w-full max-w-[1000px] rounded-xl p-4 md:p-6 shadow-2xl max-h-[95vh] overflow-y-auto relative">

            {/* CLOSE */}
            <button className="absolute top-3 right-4 text-2xl" onClick={() => setShowModal(false)}>
              ✖
            </button>

            {/* HEADER AREA */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{selectedIssue.title}</h2>

                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full overflow-hidden border">
                    {selectedIssue?.userId?.avatar ? (
                      <img src={selectedIssue.userId.avatar} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-400 text-white">
                        {(selectedIssue?.userId?.username?.[0] || "U").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <span className="font-semibold">
                    {selectedIssue?.userId?.username || "User"}
                  </span>
                </div>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-white font-semibold
                  ${selectedIssue.status === "Completed"
                    ? "bg-green-600"
                    : selectedIssue.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
              >
                {selectedIssue.status}
              </span>
            </div>

            {/* IMAGE */}
            {selectedIssue.images?.length > 0 && (
              <img src={selectedIssue.images[0]} className="w-full h-56 object-cover rounded-lg mb-4" />
            )}

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* LEFT PANEL */}
              <div>
                <div className="border rounded-lg p-3 shadow-sm mb-4">
                  <h3 className="font-bold mb-2">Details</h3>
                  <p><b>Severity:</b> {selectedIssue.securityLevel}</p>
                  <p><b>Date:</b> {new Date(selectedIssue.createdAt).toDateString()}</p>
                  <p><b>Location:</b> {selectedIssue.location}</p>
                </div>

                <div className="border rounded-lg p-3 shadow-sm">
                  <h3 className="font-bold mb-1">Description</h3>
                  <p className="text-gray-700">{selectedIssue.description}</p>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    disabled={selectedIssue.likedBy?.includes(loggedUserId)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
                    onClick={() => react(selectedIssue._id, "like")}
                  >
                    👍 {selectedIssue.likes || 0}
                  </button>

                  <button
                    disabled={selectedIssue.dislikedBy?.includes(loggedUserId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                    onClick={() => react(selectedIssue._id, "dislike")}
                  >
                    👎 {selectedIssue.dislikes || 0}
                  </button>

                </div>

                {/* Volunteer Status */}
                {(() => {
                  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
                  if (user?.role === "volunteer") {
                    return (
                      <div className="mt-4">
                        <label className="font-semibold">Update Status:</label>

                        <select
                          className="border p-2 rounded ml-2"
                          value={selectedIssue.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;

                            try {
                              const res = await axios.put(
                                `${API}/report/update-status/${selectedIssue._id}`,
                                { status: newStatus },
                                {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                }
                              );

                              // ✅ 1. Update modal
                              setSelectedIssue((p) => ({ ...p, status: newStatus }));

                              setComplaints((prev) =>
                                prev.map((r) =>
                                  r._id === selectedIssue._id
                                    ? { ...r, status: newStatus }
                                    : r
                                )
                              );

                            } catch (err) {
                              console.log(err);
                              alert("Failed to update status");
                            }
                          }}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>

                      </div>
                    );
                  }
                })()}
              </div>

              {/* RIGHT PANEL */}
              <div className="border rounded-lg p-3 shadow-sm">
                <h3 className="font-bold mb-2">Discussion</h3>

                <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                  {comments.map((c) => (
                    <div key={c._id} className="p-2 bg-gray-100 rounded">
                      <b>{c.user}</b>
                      <p>{c.comment}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 border px-3 py-2 rounded"
                    placeholder="Add your comment..."
                  />
                  <button onClick={addComment} className="bg-purple-600 text-white px-4 rounded">
                    Post
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold mb-2">Map</h3>

                  <MapContainer
                    center={[selectedIssue.latitude, selectedIssue.longitude]}
                    zoom={15}
                    className="h-56 md:h-64 rounded-lg w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[selectedIssue.latitude, selectedIssue.longitude]}>
                      <Popup>Reported Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-[#7e5511] text-white rounded-lg"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
