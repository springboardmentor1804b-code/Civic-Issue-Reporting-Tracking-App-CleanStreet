import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaPlusCircle,
  FaListUl,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuroraBackground from '../components/AuroraBackground';
import VolunteerLocationModal from '../components/volunteerLocationModal';

dayjs.extend(relativeTime);

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function extractIssueTitle(action) {
  if (!action || typeof action !== 'string') return null;
  const match = action.match(/issue\s+"([^"]+)"/i);
  return match ? match[1] : null;
}

function getActivityText(log, userRole, currentUserId) {
  const action = log.action || '';
  const lower = action.toLowerCase();
  const issueTitle = extractIssueTitle(action);
  const isOwnAction = log.user_id && currentUserId && String(log.user_id) === String(currentUserId);

  const isOwn = log.user_id && currentUserId && String(log.user_id) === String(currentUserId);

  const issueRef = isOwn ? 'your issue' : 'the issue';

  if (userRole === 'User') {
    if (lower.includes('created issue') && issueTitle) {
      return isOwnAction
        ? `You reported "${issueTitle}"`
        : `A new issue "${issueTitle}" was reported`;
    }

    if (lower.includes('deleted issue') && issueTitle) {
      return isOwnAction
        ? `Your Issue "${issueTitle}" was deleted`
        : `Issue "${issueTitle}" was deleted`;
    }

    if (lower.includes('changed status') && issueTitle) {
      return isOwnAction
        ? `Status updated for your issue "${issueTitle}"`
        : `Status updated for "${issueTitle}"`;
    }
    return null;
  }

  if (userRole === 'Volunteer') {
    if (lower.includes('assigned issue') && issueTitle) {
      return isOwnAction ? `You were assigned "${issueTitle}"` : null;
    }

    if (lower.includes('declined issue') && issueTitle && isOwnAction) {
      return `You declined "${issueTitle}"`;
    }

    if (lower.includes('changed status') && issueTitle) {
      return `Status updated for "${issueTitle}"`;
    }

    return null;
  }

  return action;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    resolved: 0,
  });
  const [showVolunteerLocationModal, setShowVolunteerLocationModal] = useState(false);

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/auth/me`, { headers });
        const user = res.data.user;

        setUserRole(user.role);
        setUserId(user._id);

        if (user.role === 'Volunteer' && (!user.coordinates || !user.coordinates.lat)) {
          setShowVolunteerLocationModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/issues`, { headers });
        const json = await res.json();
        const issues = Array.isArray(json.data) ? json.data : [];

        setStats({
          total: issues.length,
          pending: issues.filter(i => i.status === 'received').length,
          ongoing: issues.filter(i => i.status === 'in-progress').length,
          resolved: issues.filter(i => i.status === 'resolved').length,
        });
      } catch {
        toast.error('Failed to load issues');
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    if (!userRole) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/admin-logs`, { headers });
        const logs = await res.json();
        console.log('Raw logs:', logs);

        if (Array.isArray(logs)) {
          const validLogs = logs.filter(log => {
            return (
              log &&
              log._id &&
              log.action &&
              typeof log.action === 'string' &&
              !log.action.includes('ArrayBinary')
            );
          });
          console.log('Valid logs:', validLogs);
          setActivities(validLogs);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error('Failed to load activity logs', err);
        setActivities([]);
      }
    };

    fetchLogs();
  }, [userRole]);

  const handleSaveLocation = async coords => {
    try {
      await axios.put(`${BACKEND}/api/auth/update`, { coordinates: coords }, { headers });
      toast.success('Location updated');
      setShowVolunteerLocationModal(false);
    } catch {
      toast.error('Failed to save location');
    }
  };

  return (
    <>
      <AuroraBackground />
      <div className="min-h-screen relative">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-8">Track and manage civic issues</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Reports', value: stats.total, icon: FaExclamationCircle },
              { label: 'Pending', value: stats.pending, icon: FaClock },
              { label: 'In Progress', value: stats.ongoing, icon: FaClock },
              { label: 'Resolved', value: stats.resolved, icon: FaCheckCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-xl p-6 shadow">
                <p className="text-sm font-semibold">{label}</p>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold">{value}</p>
                  <Icon />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {activities.map(log => {
                  const text = getActivityText(log, userRole, userId);
                  if (!text) return null;
                  return (
                    <div
                      key={log._id}
                      className="bg-white rounded-xl px-6 py-4 shadow border-2 border-gray-400/50"
                    >
                      <p className="font-medium leading-snug">
                        {getActivityText(log, userRole, userId)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {dayjs(log.timestamp || log.createdAt).fromNow()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/report-issue')}
                  className="w-full py-3 bg-green-400 rounded-xl font-semibold flex justify-center gap-2"
                >
                  <FaPlusCircle /> Report Issue
                </button>

                <button
                  onClick={() => navigate('/community-report')}
                  className="w-full py-3 bg-blue-300 rounded-xl font-semibold flex justify-center gap-2"
                >
                  <FaListUl /> View Issues
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {showVolunteerLocationModal && (
        <VolunteerLocationModal
          onClose={() => setShowVolunteerLocationModal(false)}
          onSave={handleSaveLocation}
        />
      )}
    </>
  );
}
