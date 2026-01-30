
import { useState,React } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin" ? true : false ;

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';

  return (
    <header className="w-full bg-white/50 backdrop-blur-3xl shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
            Clean Street
          </h1>

          <nav className="hidden md:flex gap-6 text-gray-700">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin-panel" className={navLinkClass}>
                Admin Panel
              </NavLink>
            )}
            <NavLink to="/report-issue" className={navLinkClass}>
              Report Issue
            </NavLink>
            <NavLink to="/community-report" className={navLinkClass}>
              View Complaints
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-gray-700">
            Welcome {user?.name?.split(' ')[0] || 'User'}
          </span>

          <div
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full cursor-pointer overflow-hidden flex items-center justify-center bg-gray-100"
            title="Profile"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '';
                }}
              />
            ) : (
              <FaUserCircle className="text-gray-500 text-3xl" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
