import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // 🔥 AXIOS LOGIN API
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      // Save session
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", JSON.stringify({ username: user.username }));
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login Successful!");
      navigate("/");

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Invalid credentials.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: "url(/Backgroundlanding.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* HEADER */}
      {/* HEADER */}
<div className="flex justify-left px-6 py-4 bg-white shadow-sm">
  <div className="flex flex-col items-center leading-none cursor-pointer hover:scale-105 transition">
    <img src="/street-light-icon.svg" alt="logo" className="w-9" />
    <span className="mt-1 text-[9px] font-medium tracking-widest uppercase">
      Clean Street
    </span>
  </div>
</div>


      {/* FORM */}
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#FAFAF8] w-full max-w-[400px] rounded-xl shadow-xl px-6 py-8 border border-black/10">


          <h2 className="text-center text-2xl font-extrabold underline mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-md font-semibold">Email</label>
                <FaUser className="text-xl" />
              </div>

              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-black bg-transparent py-2 text-md focus:outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-md font-semibold">Password</label>
                <FaLock className="text-xl" />
              </div>

              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-black bg-transparent py-2 text-md focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-sm font-medium">
              <a href="/register" className="hover:underline">New user? Register</a>
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>

            <div className="flex justify-center pt-2">
              <button
  type="submit"
  disabled={loading}
  className="bg-[#9B6A3A] text-white rounded-lg px-10 py-2 text-md font-semibold 
             hover:brightness-95 shadow-md disabled:opacity-50"
>

                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
