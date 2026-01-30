import { useState, useEffect, useMemo } from 'react';
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaPlusCircle,
  FaListUl,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AdminOverview = () => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  console.log(import.meta.env.VITE_API_URL);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  const COMMON_CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [issuesRes, usersRes] = await Promise.all([
          axios.get(`${BACKEND}/api/issues`, { headers }),
          axios.get(`${BACKEND}/api/admin/users`, { headers }),
        ]);

        setIssues(issuesRes.data.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load admin analytics');
      }
    };

    fetchAll();
  }, []);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'received').length,
      ongoing: issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    };
  }, [issues]);

  const userPieData = useMemo(() => {
    const counts = {
      User: users.filter(u => u.role === 'User').length,
      Volunteer: users.filter(u => u.role === 'Volunteer').length,
      Admin: users.filter(u => u.role === 'Admin').length,
    };

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#60a5fa', '#34d399', '#f87171'],
        },
      ],
    };
  }, [users]);

  const STAT_COLORS = {
    total: 'bg-blue-200',
    pending: 'bg-yellow-200',
    ongoing: 'bg-cyan-200',
    resolved: 'bg-green-200',
  };

  const statusPieData = useMemo(
    () => ({
      labels: ['Pending', 'In Progress', 'Resolved'],
      datasets: [
        {
          data: [stats.pending, stats.ongoing, stats.resolved],
          backgroundColor: ['#fde047', '#38bdf8', '#4ade80'],
        },
      ],
    }),
    [stats]
  );

  const ISSUE_TYPES = ['Garbage', 'Road Damage', 'Water Leakage', 'Street Light', 'Other'];
  const issueTypeBarData = useMemo(() => {
    const counts = ISSUE_TYPES.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    issues.forEach(issue => {
      if (counts.hasOwnProperty(issue.issueType)) {
        counts[issue.issueType]++;
      }
    });

    return {
      labels: ISSUE_TYPES,
      datasets: [
        {
          label: 'Number of Issues',
          data: ISSUE_TYPES.map(type => counts[type]),
          backgroundColor: ['#22c55e', '#64748b', '#38bdf8', '#facc15', '#f87171'],
          borderRadius: 6,
        },
      ],
    };
  }, [issues]);

  const volunteerLoadData = useMemo(() => {
    const volunteerMap = {};
    issues.forEach(i => {
      if (i.assignedTo?.name) {
        volunteerMap[i.assignedTo.name] = (volunteerMap[i.assignedTo.name] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(volunteerMap),
      datasets: [
        {
          label: 'Assigned Issues',
          data: Object.values(volunteerMap),
          backgroundColor: '#fb923c',
        },
      ],
    };
  }, [issues]);

  const issuesOverTime = useMemo(() => {
    const dateMap = {};
    issues.forEach(i => {
      const date = new Date(i.createdAt).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return {
      labels: Object.keys(dateMap),
      datasets: [
        {
          label: 'Issues Created',
          data: Object.values(dateMap),
          borderColor: '#6366f1',
          backgroundColor: '#c7d2fe',
          tension: 0.4,
        },
      ],
    };
  }, [issues]);

  const downloadReport = () => {
    window.open(`${BACKEND}/api/admin/reports/download-report`, '_blank');
  };

  return (
    <div>
      <div className="space-y-10 px-6">
        <div>
          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-end"
          >
            Download Report
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className={`p-4 rounded-xl shadow ${STAT_COLORS[key]}`}>
              <p className="text-sm text-gray-700 uppercase font-semibold">{key}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold mb-2 text-center">User Distribution</h3>
            <div className="h-[320px]">
              <Pie data={userPieData} options={COMMON_CHART_OPTIONS} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold mb-2 text-center">Issue Status</h3>
            <div className="h-[320px]">
              <Pie data={statusPieData} options={COMMON_CHART_OPTIONS} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold mb-2 text-center">Issues by Type</h3>
            <div className="h-[360px]">
              <Bar data={issueTypeBarData} options={COMMON_CHART_OPTIONS} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold mb-2 text-center">Volunteer Workload</h3>
            <div className="h-[360px]">
              <Bar data={volunteerLoadData} options={COMMON_CHART_OPTIONS} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-3 text-center">Issues Created Over Time</h3>
          <div className="h-[400px]">
            <Line data={issuesOverTime} options={COMMON_CHART_OPTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
