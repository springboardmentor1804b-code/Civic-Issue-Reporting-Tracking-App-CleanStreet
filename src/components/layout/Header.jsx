import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, BarChart3, Plus, Eye, Camera, User, Menu, X } from "lucide-react";
import logo from "../../assets/logo-leaf.png";
import Avatar from "../common/Avatar";

const Header = ({
  activeNav = "",
  showNotifications = false,
  onNotificationClick,
  notifications = [],
  showNotificationDropdown = false,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/report-issue", label: "Report Issue", icon: Plus },
    { to: "/complaints", label: "View Complaints", icon: Eye },
  ];

  // Add Profile to nav for profile page
  const navItemsWithProfile = [
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/report-issue", label: "Report Issue", icon: Camera },
    { to: "/complaints", label: "Complaints", icon: Eye },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const currentNavItems = activeNav === "/profile" ? navItemsWithProfile : navItems;

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass border-b border-white/20 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logo} className="w-9 md:w-11 transition-transform group-hover:scale-110" alt="logo" />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h1 className="text-lg md:text-2xl font-bold gradient-text">CleanStreet</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 rounded-full p-1 shadow-sm">
            {currentNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  activeNav === item.to
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200"
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* Notification Bell - Desktop only */}
                {showNotifications && (
                  <div className="relative hidden md:block">
                    <button
                      onClick={onNotificationClick}
                      className="relative p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {showNotificationDropdown && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down z-50">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${notif.unread ? 'bg-green-50/50' : ''}`}
                            >
                              <p className="text-sm text-gray-800">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          ))}
                        </div>
                        <Link to="/notifications" className="block p-3 text-center text-sm text-green-600 hover:bg-gray-50 font-medium">
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Link - Desktop */}
                <Link to="/profile" className="hidden md:flex items-center gap-2 bg-white/80 hover:bg-white rounded-full pl-1 pr-3 py-1 shadow-sm hover:shadow-md transition-all">
                  <Avatar name={user?.name} size="md" />
                  <span className="text-sm font-semibold text-gray-700">{user?.name || "User"}</span>
                </Link>

                {/* Logout Button - Desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-full shadow-md hover:shadow-lg shadow-red-200 transition-all btn-press"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-xl bg-white/80 hover:bg-white shadow-sm transition-all"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 md:px-5 md:py-2.5 border-2 border-green-500 text-green-600 font-semibold rounded-full hover:bg-green-50 transition-all text-sm md:text-base"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:block px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-green-200 transition-all btn-press"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-in-right">
            {/* Menu Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name} size="lg" />
                  <div className="text-white">
                    <p className="font-semibold">{user?.name || "User"}</p>
                    <p className="text-sm text-green-100">{user?.email || ""}</p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2">
              {currentNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeNav === item.to
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-3 rounded-xl font-medium shadow-md transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for slide animation */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
