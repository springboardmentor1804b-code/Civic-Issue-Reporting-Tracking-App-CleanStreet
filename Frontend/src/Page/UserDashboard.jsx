import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = user?.role;

  // 🔹 Volunteer nearby complaints
  const [nearbyComplaints, setNearbyComplaints] = useState([]);

  // 🔹 Volunteer's location for distance calculation
  const [volunteerLocation, setVolunteerLocation] = useState(null);

  // 🔹 Distance calculation function
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Return distance in km, rounded to 1 decimal
  };

  // 🔹 Get volunteer's location
  useEffect(() => {
    if (role === "volunteer") {
      // Try to get location from localStorage first
      const savedLocation = localStorage.getItem("volunteerLocation");
      if (savedLocation) {
        setVolunteerLocation(JSON.parse(savedLocation));
      } else {
        // Get current location if not saved
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setVolunteerLocation(location);
            localStorage.setItem("volunteerLocation", JSON.stringify(location));
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to default location or show error
          }
        );
      }
    }
  }, [role]);

  // 🔹 Fetch nearby complaints ONLY for volunteer
  useEffect(() => {
    if (role === "volunteer" && volunteerLocation) {
      fetch("http://localhost:5000/api/report/volunteer/nearby", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => setNearbyComplaints(data))
        .catch((err) => console.error(err));
    }
  }, [role, volunteerLocation]);

  // 🔹 Accept complaint
  const acceptComplaint = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/report/volunteer/accept/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Already assigned");
      }

      // ✅ Update UI in real-time - remove from nearby complaints
      setNearbyComplaints((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      alert("This complaint is already assigned to another volunteer");
    }
  };

  // 🔹 Reject complaint
  const rejectComplaint = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/report/volunteer/reject/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to reject complaint");
      }

      // ✅ Update UI in real-time - remove from nearby complaints
      setNearbyComplaints((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      alert("Failed to reject complaint");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6ede2]">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center font-bold text-xl text-[#7e5511]">
          <img src="/street-light-icon.svg" alt="logo" className="w-7" />
          CleanStreet
        </div>

        <div className="hidden md:flex gap-6 font-medium">
          <Link to="/dashboard" className="text-black font-semibold">
            Dashboard
          </Link>
          <Link to="/report" className="hover:text-[#d09347]">
            Report Issue
          </Link>
          <Link to="/complaints" className="hover:text-[#d09347]">
            View Complaints
          </Link>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold">
            Login
          </button>
          <button className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold">
            Register
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="px-8 py-8 max-w-7xl mx-auto">

        {/* 🔹 VOLUNTEER ONLY SECTION */}
        {role === "volunteer" && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Nearby Complaints
            </h2>

            {nearbyComplaints.length === 0 ? (
              <p className="text-gray-500">
                No nearby complaints available
              </p>
            ) : (
              <div className="space-y-4">
                {nearbyComplaints.map((c) => {
                  // Calculate distance if volunteer location is available
                  const distance = volunteerLocation && c.locationGeo?.coordinates
                    ? getDistance(
                        volunteerLocation.latitude,
                        volunteerLocation.longitude,
                        c.locationGeo.coordinates[1], // latitude
                        c.locationGeo.coordinates[0]  // longitude
                      )
                    : null;

                  return (
                    <div
                      key={c._id}
                      className="border p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{c.description}</p>
                        {distance && (
                          <span className="text-sm text-blue-600 font-medium">
                            📍 {distance} km away
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        Location: {c.location}
                      </p>

                      <p className="text-sm text-gray-500 mb-3">
                        Category: {c.category} | Status: {c.status}
                      </p>

                      {/* Show Accept/Reject buttons only for pending complaints */}
                      {c.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => acceptComplaint(c._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => rejectComplaint(c._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Show status message for non-pending complaints */}
                      {c.status !== "pending" && (
                        <p className="text-sm text-gray-600 italic">
                          Status: {c.status}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total reports" value="0" icon="📊" />
          <StatCard title="Pending" value="0" icon="⏳" />
          <StatCard title="In Progress" value="0" icon="📈" />
          <StatCard title="Resolved" value="0" icon="💡" />
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">

          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              Recent Activity
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-medium">
                  Pothole on Main Street resolved
                </p>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div>
                <p className="font-medium">
                  New streetlight issue reported
                </p>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>

              <div>
                <p className="font-medium">
                  Garbage dump complaint updated
                </p>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">
            <Link
              to="/report"
              className="flex items-center justify-center gap-2 bg-[#7e5511] text-white py-3 rounded-lg font-semibold shadow"
            >
              ➕ Report Issue
            </Link>

            <Link
              to="/complaints"
              className="flex items-center gap-2 bg-white py-3 px-4 rounded-lg shadow text-gray-700"
            >
              📋 View all complaints
            </Link>

            <Link
              to="/map"
              className="flex items-center gap-2 bg-white py-3 px-4 rounded-lg shadow text-gray-700"
            >
              📍 Issue map
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE STAT CARD ---------- */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  );
}
