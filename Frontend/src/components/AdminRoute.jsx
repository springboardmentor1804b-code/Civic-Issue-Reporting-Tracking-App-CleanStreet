import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin"
    ? children
    : <Navigate to="/dashboard" replace />;
}
