import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Users, TrendingUp } from "lucide-react";

// Components
import Toast from "../components/Toast";
import { AuthLayout, AuthFormCard, SocialLogin } from "../components/features/auth";

// Assets
import bgImage from "../assets/bg-signin.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const loginData = { email, password };

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        showToast(data.error || "Login failed. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      // Store the token
      localStorage.setItem("token", data.token);

      // Fetch complete user data from database
      const profileRes = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      // if (profileRes.ok) {
      //   const userData = await profileRes.json();
      //   localStorage.setItem("user", JSON.stringify(userData));
      // } else {
      //   // Fallback to login response user data
      //   localStorage.setItem("user", JSON.stringify(data.user));
      // }

      let userData;

if (profileRes.ok) {
  userData = await profileRes.json();
  localStorage.setItem("user", JSON.stringify(userData));
} else {
  userData = data.user;
  localStorage.setItem("user", JSON.stringify(userData));
}


      // Show success toast before navigating
      showToast("Login successful! Redirecting to dashboard...", "success");

      // Navigate after a brief delay to show the toast
      // setTimeout(() => {
      //   navigate("/dashboard");
      // }, 1500);
      setTimeout(() => {
  if (userData.role === "Admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
}, 1500);

    } catch (error) {
      console.error(error);
      setError("Server error. Please try again later.");
      showToast("Server error. Please try again later.", "error");
      setIsLoading(false);
    }
  };

  const stats = [
    { value: "15K+", label: "Issues Reported", icon: TrendingUp },
    { value: "8.2K+", label: "Issues Resolved", icon: CheckCircle },
    { value: "5K+", label: "Active Users", icon: Users },
  ];

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <AuthLayout
        backgroundImage={bgImage}
        badge="Welcome back to your community"
        title={
          <>
            Continue Making Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Neighborhood
            </span>{" "}
            Better
          </>
        }
        subtitle="Track your reports, see the impact you are creating, and connect with fellow citizens working towards cleaner communities."
        stats={stats}
      >
        <AuthFormCard
          badge="Secure Civic Portal"
          badgeIcon={CheckCircle}
          title="Welcome Back!"
          subtitle="Sign in to continue reporting and tracking community issues"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in-down">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Remember me</span>
              </label>
              <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Social Login */}
          <SocialLogin action="Continue" />

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            New to CleanStreet?{" "}
            <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Create an account
            </Link>
          </p>
        </AuthFormCard>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
