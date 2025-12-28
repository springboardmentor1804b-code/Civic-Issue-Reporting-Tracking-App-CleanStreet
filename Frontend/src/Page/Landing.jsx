import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";


export default function Landing() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

 const navigate = useNavigate();
const location = useLocation();

const handleProtectedNav = (path) => {
  if (!isLoggedIn) {
    alert("Please login first!");
    return;
  }
  navigate(path);
};


  return (
    <div className="w-full min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b sticky top-0 z-50">

        {/* LOGO */}
        <div className="flex items-center">
          <img
            src="/street-light-icon.svg"
            alt="logo"
            className="h-8 w-8"
          />
          <h1 className="text-2xl font-bold text-[#7e5511] tracking-wide">
            CleanStreet
          </h1>
        </div>

        {/* LINKS */}
    <div className="hidden md:flex gap-6 font-medium">

  {[
    { to: "/dashboard", label: "Dashboard" },
    { to: "/report", label: "Report Issue" },
    { to: "/view-complaints", label: "View Complaints" },
  ].map((l) => (
    <NavLink
      key={l.to}
      to={l.to}
      onClick={(e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          handleProtectedNav(l.to);
        }
      }}
      className={({ isActive }) =>
        `relative group transition ${
          isActive
            ? "text-[#d09347] font-semibold"
            : "text-black hover:text-[#d09347]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {l.label}

          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-[#d09347] transition-all duration-300 ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          ></span>
        </>
      )}
    </NavLink>
  ))}

</div>
      {/* AUTH */}
        <div className="flex gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-4 py-1 rounded-full bg-[#7e5511] text-white font-semibold hover:bg-[#b98238] transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-1 rounded-full bg-[#7e5511] text-white font-semibold hover:bg-[#b98238] transition">
                Register
              </Link>
            </>
          ) : (
            <>
            {loggedInUser?.username && (
  <span className="hidden md:flex items-center font-semibold text-[#7e5511]">
    Welcome,&nbsp;{loggedInUser.username}
  </span>
)}
    <button
  onClick={() => (window.location.href = "/profile")}
  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7e5511] hover:scale-105 transition"
>
  {loggedInUser?.avatar ? (
    <img
      src={loggedInUser.avatar}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="w-full h-full flex items-center justify-center bg-[#d09347] text-white font-semibold">
      {loggedInUser?.username?.slice(0, 2).toUpperCase()}
    </span>
  )}
</button>

<button
  onClick={() => {
    localStorage.clear();
    window.location.href = "/";
  }}
  className="px-5 py-1.5 border border-black rounded-full hover:bg-[#7e5511] hover:text-white transition"
>
  Logout
</button>

            </>
          )}
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header
        className="relative h-screen flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url(/Backgroundlanding.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Let’s Make Cities Cleaner and Smarter, Together
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Report civic issues, track progress, and build a better community.
          </p>

          <button
            onClick={() =>
              document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 bg-[#d09347] px-8 py-3 text-lg rounded-md font-semibold shadow-lg hover:bg-[#b98238] transition"
          >
            How CleanStreet Works
          </button>
        </div>

        <img
          src="/hero.jpg"
          alt="Clean Worker"
          className="absolute right-8 bottom-10 w-52 md:w-64 rounded-full border-4 border-white shadow-xl"
        />
      </header>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            { title: "Report Issues", desc: "Submit issues with photos and location details." },
            { title: "Track Progress", desc: "Real-time updates as authorities respond." },
            { title: "Community Impact", desc: "Support issues that matter locally." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          How CleanStreet Works
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {["Report", "Review", "Resolve", "Track"].map((step, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-lg">{i + 1}. {step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-[#f8f4ee] text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join the CleanStreet Community
        </h2>
        <p className="max-w-xl mx-auto mb-6 text-gray-700">
          Help us transform your city—one report at a time.
        </p>

        <Link
          to="/register"
          className="bg-[#d09347] px-8 py-3 rounded-lg text-lg font-semibold text-white hover:bg-[#b98238] transition"
        >
          Get Started
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center bg-white border-t">
        <p className="text-sm text-gray-600">
          © 2025 CleanStreet | All Rights Reserved
        </p>
      </footer>

    </div>
  );
}
