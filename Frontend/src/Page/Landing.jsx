import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleProtectedNav = (path) => {
    if (!isLoggedIn) {
      alert("Please login first!");
      return;
    }
    window.location.href = path;
  };

  return (
    <div className="w-full min-h-screen scroll-smooth bg-gradient-to-b from-[#f6efe8] via-[#f4ede6] to-[#efe6dd] text-[#1f2937]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* LOGO */}
          <div className="flex flex-col items-center leading-none cursor-pointer hover:scale-105 transition">
            <img src="/street-light-icon.svg" alt="logo" className="w-9" />
            <span className="mt-1 text-[9px] font-medium tracking-widest uppercase">
              Clean Street
            </span>
          </div>

          {/* LINKS */}
          <div className="hidden md:flex gap-8 text-[15px] font-medium">
            {["Dashboard", "Report Issue", "View Complaints"].map((label, i) => (
              <button
                key={label}
                onClick={() =>
                  handleProtectedNav(
                    i === 0 ? "/dashboard" : i === 1 ? "/report" : "/complaints"
                  )
                }
                className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#7b5a42] after:transition-all after:duration-300 hover:after:w-full hover:text-[#7b5a42]"
              >
                {label}
              </button>
            ))}
          </div>

          {/* AUTH */}
          <div className="flex gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full border border-[#7b5a42]/40 text-[#7b5a42]
                  hover:bg-[#7b5a42] hover:text-white hover:-translate-y-[1px]
                  transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full bg-[#7b5a42] text-white
                  hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <button className="px-4 py-1.5 rounded-full bg-[#7b5a42] text-white">
                  {loggedInUser?.username}
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="px-4 py-1.5 rounded-full border hover:bg-black/5 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header
        className="relative h-[88vh] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: "url(/Backgroundlanding.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center max-w-3xl px-6 animate-[fadeUp_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
            Let’s Make Cities Cleaner and Smarter, Together
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Report civic issues, track progress, and build a better community through collective action.
          </p>

          <button
            onClick={() =>
              document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })
            }
            className="mt-7 px-8 py-3 rounded-lg bg-[#7b5a42] text-white font-semibold
            shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300"
          >
            How CleanStreet Works
          </button>
        </div>

        <img
          src="/hero.jpg"
          alt="Community cleanup"
          className="hidden md:block absolute right-8 bottom-10 w-60 rounded-full
          border-4 border-white shadow-2xl hover:scale-105 transition duration-500"
        />
      </header>

      {/* FEATURES */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[
            ["Report Issues", "Submit civic problems with photos and precise location details."],
            ["Track Progress", "Stay updated with transparent, real-time status changes."],
            ["Community Impact", "Your reports directly contribute to cleaner neighborhoods."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="group backdrop-blur-xl bg-white/65 rounded-2xl p-8 text-center
              shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold group-hover:text-[#7b5a42] transition">
                {title}
              </h3>
              <p className="mt-3 text-sm text-gray-700">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-14">
        <h2 className="text-3xl font-bold text-center mb-8">
          How CleanStreet Works
        </h2>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            ["Report", "Share the issue with images and details"],
            ["Review", "Authorities verify and assess the problem"],
            ["Resolve", "Assigned teams fix the issue"],
            ["Track", "Follow progress until completion"],
          ].map(([title, desc], i) => (
            <div
              key={title}
              className="group backdrop-blur-xl bg-white/60 rounded-xl p-6 text-center
              shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="font-semibold mb-2 group-hover:text-[#7b5a42] transition">
                {i + 1}. {title}
              </h3>
              <p className="text-sm text-gray-700">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Join the CleanStreet Community
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6">
          Be part of a growing civic movement that improves neighborhoods
          through transparency, accountability, and collaboration.
        </p>

        <Link
          to="/register"
          className="inline-block px-10 py-4 rounded-xl bg-[#7b5a42] text-white text-lg
          font-semibold shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER (UNCHANGED) */}
      <footer className="w-full bg-[#2c2622]/95 backdrop-blur-lg text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-semibold text-lg mb-3">CleanStreet</h3>
            <p className="text-sm text-white/70">
              Helping communities report, track, and resolve civic issues efficiently.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="text-sm space-y-2 text-white/70">
              <li>Dashboard</li>
              <li>Report Issue</li>
              <li>View Complaints</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-white/70">
              support@cleanstreet.com <br />
              Building cleaner cities together.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-12">
          © 2025 Clean Street | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
