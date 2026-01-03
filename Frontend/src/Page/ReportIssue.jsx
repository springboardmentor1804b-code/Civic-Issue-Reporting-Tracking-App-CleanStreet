import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [security, setSecurity] = useState("");

  const [issueType, setIssueType] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
const [previewImages, setPreviewImages] = useState([]);

const [open, setOpen] = useState(false);

  const notifyRef = useRef();

  // ================= MAP =================
  useEffect(() => {
    const map = L.map("map", { attributionControl: false }).setView(
      [20.5937, 78.9629],
      5
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLat(lat.toFixed(6));
      setLng(lng.toFixed(6));

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
    });

    return () => map.remove();
  }, []);

  // ================== SUBMIT ==================
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!security) return alert("Please select a Security Level");
  if (!lat || !lng) return alert("Please select a location on map");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login required");
    navigate("/");
    return;
  }

  const formData = new FormData();
  formData.append("title", issueType);
  formData.append("description", description);
  formData.append("category", issueType);
  formData.append("location", locationName);
  formData.append("latitude", lat);
  formData.append("longitude", lng);
  formData.append("userId", JSON.parse(localStorage.getItem("loggedInUser"))._id);
  formData.append("securityLevel", security);

  images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch("http://localhost:5000/api/report/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
    const text = await res.text();
    console.log("SERVER ERROR:", text);
    throw new Error("Request failed");
  }
    const result = await res.json();
    if (!result.success) throw new Error();

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);

    setIssueType("");
    setLocationName("");
    setDescription("");
    setSecurity("");
    setLat("");
    setLng("");
    setImages([]);
    setPreviewImages([]);

  } catch (err) {
    console.log(err);
    setError("Failed to submit report. Try again.");
  }
};


  return (
    <>

{/* NAVBAR */}
<nav className="w-full bg-white shadow sticky top-0 z-50">
  <div className="w-full h-14 px-4 md:px-6 flex items-center justify-between">

    {/* LEFT: LOGO */}
    <div className="flex items-center">
      <img src="/street-light-icon.svg" className="h-8 w-8" alt="logo" />
      <h1 className="text-xl font-bold text-[#7e5511]">CleanStreet</h1>
    </div>

    {/* MOBILE MENU BUTTON */}
    <button
      className="md:hidden text-2xl"
      onClick={() => setOpen((p) => !p)}
    >
      ☰
    </button>

    {/* CENTER MENU (Desktop Only) */}
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

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3">
      {/* Welcome (Hidden in small screens) */}
      <span className="hidden md:block text-[15px] font-semibold text-[#7e5511] whitespace-nowrap">
        {(() => {
          const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
          return user?.username ? `Welcome, ${user.username}` : "Welcome, User";
        })()}
      </span>

      {/* Avatar Button */}
      {(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        return (
          <button
            onClick={() => (window.location.href = "/profile")}
            className="h-9 w-9 rounded-full overflow-hidden border-[2px] border-[#7e5511] hover:scale-105 transition flex items-center justify-center"
          >
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center bg-[#d09347] text-white font-semibold">
                {(user?.username?.[0] || "U").toUpperCase()}
              </span>
            )}
          </button>
        );
      })()}

      {/* Logout */}
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

  {/* MOBILE DROPDOWN MENU */}
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


      {/* PAGE */}
      <div style={{ background: "#faf2e6", minHeight: "100vh", padding: "30px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <h1 style={{ textAlign: "center" }}>⚠️ Report an Issue</h1>
          <p style={{ textAlign: "center", color: "gray" }}>
            Help us keep your community clean by reporting issues
          </p>

          {success && (
            <div
              style={{
                background: "#c7f5c4",
                padding: 12,
                borderRadius: 10,
                textAlign: "center",
                color: "green",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              ✔ Issue Successfully Submitted!
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#ffdddd",
                padding: 12,
                borderRadius: 10,
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Issue Type</label>
            <input
              className="box"
              placeholder="Select Issue Type"
              required
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            />

            <label>Location</label>
            <input
              className="box"
              placeholder="Enter location or select from map"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />

            <label>Security Level</label>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Low", "Medium", "High"].map((level) => (
                <div
                  key={level}
                  className={`secBtn ${security === level ? "active" : ""}`}
                  onClick={() => setSecurity(level)}
                >
                  {level}
                </div>
              ))}
            </div>

            <label>Description</label>
            <textarea
              className="box"
              rows={4}
              placeholder="Provide details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Pick Location On Map</label>
            <div id="map" style={{ height: "300px", borderRadius: 12 }} />

            <label>Latitude</label>
            <input className="box" value={lat} readOnly />

            <label>Longitude</label>
            <input className="box" value={lng} readOnly />

<label>Upload Photos (Optional)</label>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
  const files = Array.from(e.target.files);

  setImages(prev => [...prev, ...files]);

  const previews = files.map(file => URL.createObjectURL(file));
  setPreviewImages(prev => [...prev, ...previews]);

  e.target.value = null;   // allow selecting again
}}

/>

{/* Preview */}
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
  {previewImages.map((src, index) => (
    <img
      key={index}
      src={src}
      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }}
      alt="preview"
    />
  ))}
</div>


            <button className="submitBtn" type="submit">
              Submit Report
            </button>
          </form>
        </div>

        {/* STYLES */}
        <style>{`
          .box { width:100%; padding:12px; border-radius:10px; background:#f0d7b4; margin:8px 0 15px; border:none; }
          label { font-weight:bold; display:block; margin-top:15px; }
          .secBtn { flex:1; text-align:center; background:#f0d7b4; padding:12px; border-radius:12px; cursor:pointer; font-weight:bold; transition:.2s; }
          .secBtn:hover { background:#d9b385; }
          .secBtn.active { background:#a15600 !important; color:white; border:2px solid #5a2c00; }
          .submitBtn{ background:#a15600; color:white; border:none; padding:12px 30px; border-radius:20px; display:block; margin:25px auto; cursor:pointer; font-size:18px; transition:.2s;}
          .submitBtn:hover{ transform:scale(1.02); }
        `}</style>
      </div>
    </>
  );
}
