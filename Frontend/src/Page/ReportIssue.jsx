import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [security, setSecurity] = useState("");

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [open, setOpen] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const notifyRef = useRef();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([17.3850, 78.4867], 10); // Default to Hyderabad area

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);

        // Remove existing marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(map);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);



  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!security) return alert("Please select a Security Level");
    if (!latitude || !longitude) return alert("Please select a location on the map");

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
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());
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

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Request failed");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

      setIssueType("");
      setDescription("");
      setSecurity("");
      setLatitude(null);
      setLongitude(null);
      setImages([]);
      setPreviewImages([]);

      // Remove marker from map
      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Try again.");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow sticky top-0 z-50">
        <div className="w-full h-14 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/street-light-icon.svg" className="h-8 w-8" alt="logo" />
            <h1 className="text-xl font-bold text-[#7e5511]">CleanStreet</h1>
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen((p) => !p)}
          >
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

          <div className="flex items-center gap-3">
            <span className="hidden md:block text-[15px] font-semibold text-[#7e5511] whitespace-nowrap">
              {(() => {
                const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
                return user?.username ? `Welcome, ${user.username}` : "Welcome, User";
              })()}
            </span>

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
      </nav>

      {/* PAGE */}
      <div style={{ background: "#faf2e6", minHeight: "100vh", padding: "30px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <h1 style={{ textAlign: "center" }}>⚠️ Report an Issue</h1>
          <p style={{ textAlign: "center", color: "gray" }}>
            Help us keep your community clean by reporting issues
          </p>

          {success && (
            <div style={{ background: "#c7f5c4", padding: 12, borderRadius: 10, textAlign: "center", color: "green", fontWeight: "bold", marginBottom: 15 }}>
              ✔ Issue Successfully Submitted!
            </div>
          )}

          {error && (
            <div style={{ background: "#ffdddd", padding: 12, borderRadius: 10, textAlign: "center", color: "red", fontWeight: "bold", marginBottom: 15 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Issue Type</label>
            <input className="box" required value={issueType} onChange={(e) => setIssueType(e.target.value)} />



            <label>Security Level</label>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Low", "Medium", "High"].map((level) => (
                <div key={level} className={`secBtn ${security === level ? "active" : ""}`} onClick={() => setSecurity(level)}>
                  {level}
                </div>
              ))}
            </div>

            <label>Description</label>
            <textarea className="box" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

            <label>Location</label>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Click on the map to select the location of the issue</p>
            <div id="map" style={{ height: "300px", width: "100%", borderRadius: "10px", marginBottom: "15px" }}></div>
            {latitude && longitude && (
              <p style={{ fontSize: "14px", color: "#7e5511", marginBottom: "10px" }}>
                Selected Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}

            <label>Upload Photos (Optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setImages((prev) => [...prev, ...files]);
                setPreviewImages((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
                e.target.value = null;
              }}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {previewImages.map((src, index) => (
                <img key={index} src={src} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }} alt="preview" />
              ))}
            </div>

            <button className="submitBtn" type="submit">
              Submit Report
            </button>
          </form>
        </div>

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
