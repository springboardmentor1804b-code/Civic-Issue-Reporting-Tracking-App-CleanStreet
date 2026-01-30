import { NavLink,Navigate, Outlet } from 'react-router-dom';
import AuroraBackground from '../components/AuroraBackground';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AdminPanel = () => {


  return (
    <>
      <AuroraBackground />
      <div className="min-h-screen relative ">
        <Navbar />
        <div className="p-6 mx-auto px-4 sm:px-6 lg:px-20 pt-6 pb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Overview and Management</p>
            </div>

          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap gap-2 p-3">
                <NavLink
                  to="/admin-panel/overview"
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`
                  }
                >
                  Overview
                </NavLink>

                <NavLink
                  to="/admin-panel/view-complaints"
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-xl text-sm font-semibold
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`
                  }
                >
                  Complaints
                </NavLink>
                <NavLink
                  to="/admin-panel/user-management"
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-xl text-sm font-semibold
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`
                  }
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin-panel/activities"
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-xl text-sm font-semibold
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`
                  }
                >
                  Activity Logs
                </NavLink>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};



export default AdminPanel;
