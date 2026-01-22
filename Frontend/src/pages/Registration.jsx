import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return { label: "", width: "0%", color: "" };
    if (p.length < 6)
      return { label: "Weak", width: "33%", color: "bg-red-500" };
    if (/[A-Z]/.test(p) && /\d/.test(p))
      return { label: "Strong", width: "100%", color: "bg-green-600" };
    return { label: "Medium", width: "66%", color: "bg-yellow-500" };
  };

  const strength = passwordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, role } = formData;

    if (!username || !email || !password || !confirmPassword || !role) {
      alert("Please fill all required fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Registration Successful 🎉");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));

      window.location.href = "/login";

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6f3ee] px-4 overflow-hidden">
      <div className="w-full max-w-6xl h-[94vh] grid grid-cols-1 md:grid-cols-2 rounded-[44px] overflow-hidden shadow-2xl bg-white">

        {/* LEFT */}
        <div className="bg-[#C2873B] flex flex-col h-full">
          <div className="flex flex-col items-center text-center pt-8 pb-5 px-8">
            <img src="/street-light-icon.svg" className="w-12 mb-2" alt="" />
            <h1 className="text-3xl font-extrabold">Join CleanStreet</h1>
            <p className="text-sm max-w-sm">
              Be a part of making your city cleaner and smarter.
            </p>
          </div>
          <div className="flex-1">
            <img src="/street.jpg" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-7">
          <div className="w-full max-w-md">

            <form onSubmit={handleRegister} className="space-y-2.5">

              <Input label="Username" name="username" required value={formData.username} onChange={handleChange} />
              <Input label="Email" name="email" required value={formData.email} onChange={handleChange} />

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold">Password *</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border px-4 py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {strength.label && (
                  <div className="mt-1">
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div className={`h-1 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-[11px]">Strength: <b>{strength.label}</b></p>
                  </div>
                )}
              </div>

              <Input label="Confirm Password" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
              <Input label="Location" name="location" value={formData.location} onChange={handleChange} />

              {/* ROLE */}
              <div>
                <label className="text-sm font-semibold">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C2873B] text-white py-2.5 rounded-full font-semibold"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-xs">
                Already have an account?
                <Link to="/login" className="text-blue-600 font-semibold"> Login</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, required, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border px-4 py-2.5"
      />
    </div>
  );
}
