import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("No user found. Please register first.");
      return;
    }

    if (email !== savedUser.email) {
      alert("Email not found");
      return;
    }

    if (password !== savedUser.password) {
      alert("Incorrect password");
      return;
    }

    // Save login state and username
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ username: savedUser.username })
    );

    alert("Login successful!");

    // ✅ REACT ROUTER REDIRECTION (correct)
    navigate("/");
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
      <div className="flex items-center gap-4 px-6 py-3 bg-white shadow-sm">
        <img src="/street-light-icon.svg" alt="logo" className="w-10 sm:w-12" />
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Clean Street</h1>
      </div>

      {/* FORM */}
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="bg-white w-full max-w-[400px] rounded-xl shadow-xl px-6 py-8 border border-black/10">
          
          <h2 className="text-center text-2xl font-extrabold underline mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-md font-semibold text-black">Email</label>
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
                <label className="text-md font-semibold text-black">Password</label>
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
                className="bg-[#d09347] text-white rounded-lg px-10 py-2 text-md font-semibold hover:bg-[#b98238] shadow-md"
              >
                Login
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
