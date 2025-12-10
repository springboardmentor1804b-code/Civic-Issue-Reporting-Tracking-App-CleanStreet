import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  // Read login state
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Handle protected navigation
  const handleProtectedNav = (path) => {
    if (!isLoggedIn) {
      alert("Please login first!");
      return;
    }
    window.location.href = path;
  };

  return (
    <div className="w-full min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">

        {/* LOGO + TITLE */}
        <div className="flex items-center gap-3">
          <img src="/street-light-icon.svg" alt="logo" className="w-8 sm:w-10" />
          <h1 className="text-2xl font-bold">Clean Street</h1>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex gap-6 text-[16px] font-medium">
          <button onClick={() => handleProtectedNav("/dashboard")} className="hover:text-[#d09347]">
            Dashboard
          </button>
          <button onClick={() => handleProtectedNav("/report")} className="hover:text-[#d09347]">
            Report Issue
          </button>
          <button onClick={() => handleProtectedNav("/complaints")} className="hover:text-[#d09347]">
            View Complaints
          </button>
        </div>

        {/* AUTH SECTION */}
        <div className="flex gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold hover:bg-[#b98238] transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* CLICKABLE USERNAME BUTTON */}
              <button
                onClick={() => (window.location.href = "/profile")}
                className="px-4 py-1 rounded-full bg-[#d09347] text-white font-semibold"
              >
                {loggedInUser?.username}
              </button>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("loggedInUser");
                  window.location.href = "/";
                }}
                className="px-4 py-1 rounded-full bg-black text-white font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header
        className="relative w-full h-[90vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(/Backgroundlanding.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Let’s Make Cities Cleaner and Smarter, Together
          </h1>

          <p className="mt-3 text-lg">
            Report civic issues, track progress, and help build a better community together.
          </p>

          <button
            onClick={() =>
              document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 bg-[#d09347] px-8 py-3 text-lg rounded-md font-semibold shadow-lg hover:bg-[#b98238] transition"
          >
            How CleanStreet Works
          </button>
        </div>

        <img
          src="/hero.jpg"
          alt="Worker"
          className="absolute right-6 bottom-10 w-48 md:w-64 rounded-full border-4 border-white shadow-lg"
        />
      </header>

      {/* BACKGROUND WITH FEATURES */}
      <div
        className="w-full py-20"
        style={{
          backgroundImage: "url(/Backgroundlanding.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* FEATURES */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <svg className="w-12 h-12 text-[#d09347] mx-auto mb-4" fill="none" strokeWidth="2">
              <path d="M3 5h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7" stroke="currentColor" />
            </svg>
            <h3 className="text-xl font-semibold text-black">Report Issues</h3>
            <p className="text-gray-700 mt-2">Submit issues with photos and location details.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" strokeWidth="2">
              <path d="M3 3h7l2 3h9v13H3z" stroke="currentColor" />
            </svg>
            <h3 className="text-xl font-semibold text-black">Track Progress</h3>
            <p className="text-gray-700 mt-2">Real-time updates as authorities respond.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <svg className="w-12 h-12 text-black mx-auto mb-4" fill="none" strokeWidth="2">
              <path d="M16 11V7a4 4 0 10-8 0v4M5 11h14v10H5z" stroke="currentColor" />
            </svg>
            <h3 className="text-xl font-semibold text-black">Community Impact</h3>
            <p className="text-gray-700 mt-2">Support issues that matter locally.</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
            How CleanStreet Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold">1. Report</h3>
              <p className="text-gray-700">Submit issue with images</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold">2. Review</h3>
              <p className="text-gray-700">Authorities verify the issue</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold">3. Resolve</h3>
              <p className="text-gray-700">Team fixes the issue</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold">4. Track</h3>
              <p className="text-gray-700">Track live progress</p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA SECTION */}
      <section
        className="py-20 text-white text-center"
        style={{
          backgroundImage: "url(/Backgroundlanding.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Join the CleanStreet Community</h2>
        <p className="max-w-xl mx-auto mb-6">Help us transform your city—one report at a time.</p>

        <Link
          to="/register"
          className="bg-[#d09347] px-8 py-3 rounded-lg text-lg font-semibold text-white hover:bg-[#b98238] transition"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center bg-white border-t">
        <p className="text-sm text-gray-600">© 2025 Clean Street | All Rights Reserved</p>
      </footer>

    </div>
  );
}
