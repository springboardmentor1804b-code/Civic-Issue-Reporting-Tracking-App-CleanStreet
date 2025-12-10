import React, { useState } from "react";
import axios from "axios";

export default function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    gender: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const fields = [
    { label: "User Name", name: "username" },
    { label: "Email", name: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirmPassword", type: "password" },
    { label: "Location", name: "location" },
    { label: "Gender (He/She)", name: "gender" },
    { label: "Role (User/Volunteer/Admin)", name: "role" },
  ];

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // BASIC CLIENT VALIDATION
  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password)
      return "All fields are required!";
    if (!email.includes("@"))
      return "Enter a valid email!";
    if (password.length < 6)
      return "Password must be at least 6 characters!";
    if (password !== confirmPassword)
      return "Passwords do not match!";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);

    try {
      // SEND ONLY VALID FIELDS (NO CONFIRM PASSWORD)
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        gender: formData.gender,
        role: formData.role.toLowerCase(), // Convert to lowercase for backend
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      // SAVE ONLY NON-SENSITIVE DATA
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          role: formData.role,
        })
      );

      localStorage.setItem("isLoggedIn", "true");

      alert("Registration Successful!");
      window.location.href = "/"; // redirect to home

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.36fr_0.64fr] h-screen w-full bg-white">

      {/* LEFT PANEL */}
      <div className="flex flex-col h-full bg-[#C2873B]">
        <div className="mt-6">
          <img src="/street-light-icon.svg" alt="Logo" className="w-12 sm:w-14" />
          <div className="mt-4 ml-2">
            <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
              Join CleanStreet
            </h1>
            <p className="text-sm font-medium text-black sm:text-base mt-1">
              Be a part of making your city cleaner and smarter...
            </p>
          </div>
        </div>

        <div className="flex-grow flex justify-center items-center">
          <img
            src="/street.jpg"
            alt="Street"
            className="w-full max-h-[50vh] object-cover rounded-md mt-4"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-start h-full px-6 sm:px-10 py-6">
        <div className="mx-auto w-full max-w-[420px]">

          <h2 className="text-center text-3xl font-extrabold text-black sm:text-4xl mb-4">
            Sign Up
          </h2>

          <form onSubmit={handleRegister} className="space-y-3">
            {fields.map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-black">
                  {label}
                </label>

                {name === "role" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent 
                              px-0 py-1 text-sm font-medium text-black 
                              focus:border-black focus:outline-none"
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type || "text"}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent 
                              px-0 py-1 text-sm font-medium text-black 
                              focus:border-black focus:outline-none"
                  />
                )}
              </div>
            ))}

            <a
              href="/login"
              className="text-sm font-semibold text-[#3F81EA] hover:underline"
            >
              Already have an account? Login
            </a>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-[200px] rounded-full bg-[#C2873B] px-6 py-2.5 
                          text-base font-semibold text-white shadow-sm 
                          transition hover:brightness-95 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}
