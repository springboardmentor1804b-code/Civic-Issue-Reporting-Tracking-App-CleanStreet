import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

dayjs.extend(relativeTime);

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PAGE_SIZE = 8;

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND}/api/admin-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to fetch activities', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(activities.length / PAGE_SIZE);

  const paginatedActivities = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return activities.slice(start, start + PAGE_SIZE);
  }, [activities, pageIndex]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiActivity className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Recent Activities</h1>
          </div>
          <p className="text-gray-600">Complete audit log of system activity</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading activity logs...</div>
          ) : paginatedActivities.length === 0 ? (
            <div className="py-16 text-center text-gray-500">No activity logs found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedActivities.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>

                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
                      {dayjs(log.timestamp).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <strong>{pageIndex + 1}</strong> of <strong>{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
                  disabled={pageIndex === 0}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>

                <button
                  onClick={() => setPageIndex(p => Math.min(p + 1, totalPages - 1))}
                  disabled={pageIndex === totalPages - 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
