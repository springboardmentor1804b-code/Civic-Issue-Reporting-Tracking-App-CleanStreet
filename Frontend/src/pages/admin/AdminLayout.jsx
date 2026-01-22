import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f6ede2]">

      {/* 
        ❌ REMOVED SUB NAVBAR 
        Reason: Sub-navbar is now handled INSIDE AdminDashboard 
      */}

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </div>

    </div>
  );
}
