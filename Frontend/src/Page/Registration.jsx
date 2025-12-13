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
    { label: "User Name", name: "username", required: true, placeholder: "John Doe" },
    { label: "Email", name: "email", required: true, placeholder: "example@gmail.com" },
    { label: "Password", name: "password", type: "password", required: true, placeholder: "Minimum 6 characters" },
    { label: "Confirm Password", name: "confirmPassword", type: "password", required: true, placeholder: "Re-enter password" },
    { label: "Location", name: "location", placeholder: "City, State" },
    { label: "Gender", name: "gender" },
    { label: "Role (User/Volunteer/Admin)", name: "role" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password) return "All fields are required!";
    if (!email.includes("@")) return "Enter a valid email!";
    if (password.length < 6) return "Password must be at least 6 characters!";
    if (password !== confirmPassword) return "Passwords do not match!";
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
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        gender: formData.gender,
        role: formData.role ? formData.role.toLowerCase() : "user",
      };

      await axios.post("http://localhost:5000/api/auth/register", payload);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          role: payload.role,
        })
      );

      localStorage.setItem("isLoggedIn", "true");
      alert("Registration Successful!");
      window.location.href = "/";
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.36fr_0.64fr] h-screen w-full bg-white">

      {/* LEFT PANEL */}
      <div className="relative h-full bg-[#9B6A3A] overflow-hidden">

        {/* LOGO */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex flex-col items-center">
            <img
              src="/street-light-icon.svg"
              alt="CleanStreet Logo"
              className="w-10 h-10"
            />
            <span
              className="text-[10px] font-medium uppercase text-black"
              style={{ letterSpacing: "0.08em" }}
            >
              Clean Street
            </span>
          </div>
        </div>

        {/* TEXT */}
        <div className="absolute top-[90px] left-4 z-20 max-w-[340px]">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
            Join CleanStreet
          </h1>
          <p className="text-sm sm:text-base font-medium text-black mt-1 whitespace-nowrap">
  Be a part of making your city cleaner and smarter...
</p>

        </div>

        {/* IMAGE */}
        <div className="absolute left-0 right-0 bottom-0 top-[200px]">
          <img
            src="/street.jpg"
            alt="Street"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-start h-full px-6 sm:px-10 py-6 bg-[#FAFAF8]">

        <div className="mx-auto w-full max-w-[420px]">

          <h2 className="text-center text-3xl font-extrabold text-black sm:text-4xl mb-4">
            Sign Up
          </h2>

          <form onSubmit={handleRegister} className="space-y-3">
            {fields.map(({ label, name, type, required, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-black">
                  {label}
                  {required && <span className="text-red-600 ml-1">*</span>}
                </label>

                {name === "gender" ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent
                               px-0 py-1 text-sm font-medium text-black
                               focus:border-black focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : name === "role" ? (
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
                    placeholder={placeholder}
                    className="w-full border-0 border-b border-gray-400 bg-transparent
                               px-0 py-1 text-sm font-medium text-black
                               placeholder-gray-400
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
                className="w-[200px] rounded-full bg-[#9B6A3A] px-6 py-2.5
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
