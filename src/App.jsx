
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ViewComplaintsPage from "./pages/ViewComplaintsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportCivicIssue from  "./pages/ReportCivicIssue";
import AdminPage from "./pages/AdminPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import AdminComplaintsPage from "./pages/AdminComplaintsPage";
import AdminReportsPage from "./pages/AdminReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Show Landing Page first */}
        <Route path="/" element={<LandingPage />} />  

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} /> 
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/report-issue" element={<ReportCivicIssue/>}></Route>
        <Route path="/complaints" element={<ViewComplaintsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <ManageUsersPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/complaints"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminComplaintsPage />
    </ProtectedRoute>
  }
/>
<Route path="/reports" element={<AdminReportsPage />} />


      </Routes>
    </Router>
  );
}

export default App;
