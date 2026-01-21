// Issue Types
export const ISSUE_TYPES = [
  "Garbage",
  "Road Damage",
  "Water Leakage",
  "Streetlight Issue",
  "Drainage Problem",
  "Other",
];

// Priority Levels
export const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

// Issue Status
export const ISSUE_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

// Issue Type Emojis
export const ISSUE_EMOJIS = {
  Garbage: "🗑️",
  "Road Damage": "🕳️",
  "Water Leakage": "💧",
  "Streetlight Issue": "💡",
  "Drainage Problem": "🚰",
  Other: "📋",
};

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ImageKit Configuration
export const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
export const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

// Navigation Items
export const NAV_ITEMS = {
  main: [
    { to: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { to: "/report-issue", label: "Report Issue", icon: "Plus" },
    { to: "/complaints", label: "View Complaints", icon: "Eye" },
  ],
  landing: [
    { to: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { to: "/report-issue", label: "Report Issue", icon: "Camera" },
    { to: "/complaints", label: "Complaints", icon: "Eye" },
  ],
};

// Default Map Center (India)
export const DEFAULT_MAP_CENTER = [20.5937, 78.9629];
export const DEFAULT_MAP_ZOOM = 5;

// User Roles
export const USER_ROLES = ["User", "Volunteer", "Admin"];

// Status Styles
export const STATUS_STYLES = {
  Resolved: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200",
  "In Progress": "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-200",
  Pending: "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-orange-200",
};

// Priority Indicator Styles
export const PRIORITY_STYLES = {
  high: "border-l-4 border-l-red-500 bg-red-50/50",
  medium: "border-l-4 border-l-amber-500 bg-amber-50/50",
  low: "border-l-4 border-l-green-500 bg-green-50/50",
  critical: "border-l-4 border-l-purple-500 bg-purple-50/50",
};
