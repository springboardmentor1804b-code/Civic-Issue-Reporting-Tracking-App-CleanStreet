import React, { useState ,useMemo } from 'react';

// --- Icons (Lucide React) ---
import {
  Menu, LayoutDashboard, Settings, User, ClipboardEdit, Map,
  AlertTriangle, Clock, CheckCircle, Users, Bell,
  ArrowLeft, Calendar, MapPin, FileText, Image, MessageSquare, PlusCircle,  Activity,Search,Pencil,Trash2, UserCog
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import L from "leaflet";
const statusIcon = (status) =>
  new L.Icon({
    iconUrl:
      status === "Pending"
        ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        : status === "In Progress"
        ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
        : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  });

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


// --- Static Data (Updated with full details for all issues) ---
const reportedIssues = [
  {
    id: "A1",
    type: "Broken Street Light",
    location: "Main Street & 5th Ave",
    reporter: "John Doe",
    reporterEmail: "john.doe@gmail.com",
    date: "2025-12-01",
    timeElapsed: "2 days",
    priority: "High",
    status: "Pending",
    lat: 28.6139,
    lng: 77.2090,
    description: "Street light not working for weeks.",
  },
  {
    id: "B2",
    type: "Pothole",
    location: "Elm Street, Sector 7",
    reporter: "Jane Smith",
    reporterEmail: "jane.smith@mail.com",
    date: "2025-12-02",
    timeElapsed: "10 hours",
    priority: "Medium",
    status: "In Progress",
    lat: 28.7041,
    lng: 77.1025,
    description: "Large pothole causing traffic issues.",
  },
  {
    id: "C3",
    type: "Garbage Overflow",
    location: "Ring Road",
    reporter: "Amit Kumar",
    reporterEmail: "amit@gmail.com",
    date: "2025-12-03",
    timeElapsed: "1 day",
    priority: "High",
    status: "Pending",
    lat: 28.4595,
    lng: 77.0266,
    description: "Garbage bins overflowing.",
  },
  {
    id: "D4",
    type: "Water Leakage",
    location: "MG Road",
    reporter: "Neha Sharma",
    reporterEmail: "neha@gmail.com",
    date: "2025-12-04",
    timeElapsed: "5 hours",
    priority: "Medium",
    status: "In Progress",
    lat: 28.5355,
    lng: 77.3910,
    description: "Water pipe leakage on road.",
  },
  {
    id: "E5",
    type: "Graffiti",
    location: "North End",
    reporter: "Rahul Verma",
    reporterEmail: "rahul@gmail.com",
    date: "2025-12-05",
    timeElapsed: "3 weeks",
    priority: "Low",
    status: "Resolved",
    lat: 28.4089,
    lng: 77.3178,
    description: "Graffiti cleaned.",
  },
  {
    id: "F6",
    type: "Illegal Parking",
    location: "City Mall",
    reporter: "Sonia Gupta",
    reporterEmail: "sonia@gmail.com",
    date: "2025-12-06",
    timeElapsed: "6 hours",
    priority: "Low",
    status: "Resolved",
    lat: 28.6298,
    lng: 77.0689,
    description: "Vehicles parked illegally.",
  },
];

// --- Users List (Worker / Volunteer / Admin) ---
const usersList = [
  // --- Workers ---
  { id: "U1", name: "Rohit Kumar", role: "Worker", email: "rohit@gmail.com", city: "Delhi" },
  { id: "U4", name: "Vikas Sharma", role: "Worker", email: "vikas.worker@gmail.com", city: "Ghaziabad" },
  { id: "U5", name: "Ankit Yadav", role: "Worker", email: "ankit.worker@gmail.com", city: "Noida" },
  { id: "U6", name: "Suresh Singh", role: "Worker", email: "suresh.worker@gmail.com", city: "Delhi" },
  { id: "U7", name: "Pooja Verma", role: "Worker", email: "pooja.worker@gmail.com", city: "Greater Noida" },

  // --- Volunteers ---
  { id: "U2", name: "Neha Singh", role: "Volunteer", email: "neha@gmail.com", city: "Noida" },
  { id: "U8", name: "Aman Gupta", role: "Volunteer", email: "aman.volunteer@gmail.com", city: "Delhi" },
  { id: "U9", name: "Simran Kaur", role: "Volunteer", email: "simran.volunteer@gmail.com", city: "Ghaziabad" },

  // --- Admins ---
  { id: "U3", name: "Amit Verma", role: "Admin", email: "amit@gmail.com", city: "Ghaziabad" },
  { id: "U10", name: "Priya Mehta", role: "Admin", email: "priya.admin@gmail.com", city: "Delhi" },
];



// --- Recent Activity Logs ---
const recentActivityData = [
  {
    id: 1,
    title: "Issue Assigned",
    description: "Issue A1 assigned to Rohit Kumar (Worker)",
    time: "2 minutes ago",
    type: "assign",
  },
  {
    id: 2,
    title: "Issue Status Updated",
    description: "Issue B2 marked as In Progress",
    time: "1 hour ago",
    type: "status",
  },
  {
    id: 3,
    title: "New Issue Reported",
    description: "New issue reported: Garbage Overflow at Ring Road",
    time: "3 hours ago",
    type: "new",
  },
  {
    id: 4,
    title: "Issue Resolved",
    description: "Issue E5 resolved successfully",
    time: "1 day ago",
    type: "resolved",
  },
];


// --- Map Data (used for Dashboard Map View placeholders) ---


// --- Mock Data for Detail View ---
const mockActivityTimeline = [
  { time: '2025-12-01 09:30 AM', event: 'Complaint submitted by John Doe' },
  { time: '2025-12-01 10:15 AM', event: 'Complaint verified by system' },
  { time: '2025-12-01 02:30 PM', event: 'Reviewed by admin by Admin User' },
];

const mockComments = [
  { user: 'Admin User', comment: 'Issue has been verified. Forwarding to the electrical maintenance team.', date: '2025-12-01 02:35 PM' }
];


// --- Helper Functions (for color/priority) ---
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500/10 text-red-700';
    case 'Medium':
      return 'bg-orange-500/10 text-orange-700';
    case 'Low':
      return 'bg-green-500/10 text-green-700';
    default:
      return 'bg-gray-500/10 text-gray-700';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-red-500';
    case 'In Progress':
      return 'bg-orange-500';
    case 'Resolved':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusPill = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-red-100 text-red-700';
    case 'In Progress':
      return 'bg-orange-100 text-orange-700';
    case 'Resolved':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Renders the Issue Detail View, as requested by the user's image mockup.
 * @param {Object} props - The component props.
 * @param {Object} props.issue - The data of the selected issue.
 * @param {Function} props.onBack - Function to switch back to the dashboard view.
 */
const IssueDetailView = ({ issue, onBack }) => {
  if (!issue) return <div className="p-6 text-gray-600">No issue selected.</div>;

  return (
    <main className="p-4 sm:p-6 space-y-6 flex-1">
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Reported Issues
      </button>

      {/* Main Detail Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#B77A4D]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xl font-bold text-gray-800">{issue.type}</span>
            {/* Priority pill uses helper function for dynamic color based on data */}
            <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
              {issue.priority} Priority
            </span>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusPill(issue.status)}`}>
            {issue.status}
          </span>
        </div>
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-6 text-sm text-gray-600 border-t pt-4 mt-4">
          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Location</p>
              <p>{issue.location}</p>
              <p className="text-xs italic">{issue.coords || 'Coordinates N/A'}</p>
            </div>
          </div>
          
          {/* Date Reported */}
          <div className="flex items-start space-x-2">
            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Date Reported</p>
              <p>{issue.date}</p>
            </div>
          </div>
          
          {/* Reporter */}
          <div className="flex items-start space-x-2">
            <User className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Reporter</p>
              <p>{issue.reporter}</p>
              <p className="text-xs text-blue-500">{issue.reporterEmail || 'Email N/A'}</p>
            </div>
          </div>

          {/* Time Elapsed */}
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Time Elapsed</p>
              <p>{issue.timeElapsed || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Grid: Description, Images, Comments (Left) & Timeline, Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Description, Images, Comments) - Span 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="flex items-center font-bold text-lg text-gray-700 mb-3"><FileText className="w-5 h-5 mr-2 text-[#B77A4D]" /> Description</h4>
            <p className="text-gray-700 leading-relaxed text-sm">{issue.description || 'No description provided for this issue.'}</p>
          </div>
          
          {/* Attached Images */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="flex items-center font-bold text-lg text-gray-700 mb-3"><Image className="w-5 h-5 mr-2 text-[#B77A4D]" /> Attached Images</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Image Placeholder 1</div>
              <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Image Placeholder 2</div>
            </div>
          </div>

          {/* Comments & Notes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="flex items-center font-bold text-lg text-gray-700 mb-4"><MessageSquare className="w-5 h-5 mr-2 text-[#B77A4D]" /> Comments & Notes</h4>
            
            {/* Existing Comments */}
            {mockComments.map((comment, index) => (
              <div key={index} className="border-l-4 border-gray-200 pl-4 py-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{comment.user}</span>
                  <span>{comment.date}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
              </div>
            ))}

            {/* Add Comment Form (Placeholder) */}
            <div className="mt-4 pt-4 border-t">
              <textarea 
                placeholder="Add a comment or note..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B77A4D] focus:border-transparent resize-none text-sm"
                rows="3"
              ></textarea>
              <button className="mt-2 bg-[#B77A4D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#A36C40] transition shadow-md">
                Add Comment
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Activity Timeline, Location Map) - Span 1/3 */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Activity Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg text-gray-700 mb-4">Activity Timeline</h4>
            <div className="space-y-4">
              {mockActivityTimeline.map((item, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#B77A4D] rounded-full ring-4 ring-white"></div>
                  <p className="text-sm text-gray-700 font-medium">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location Map */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg text-gray-700 mb-4">Location Map</h4>
            <div className="w-full h-48 bg-gray-200 rounded-lg relative flex items-center justify-center">
              <MapPin className="w-8 h-8 text-red-500" />
              <div className="absolute inset-0 opacity-10 bg-[size:20px_20px] bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.1)_20%)]"></div>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition shadow-md flex items-center justify-center">
              <Map className="w-4 h-4 mr-2" /> View Full Map
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};


/**
 * Renders the Main Dashboard View.
 * @param {Function} onIssueClick - Callback when an issue row is clicked.
 */

const DashboardView = ({
  onIssueClick,
  selectedIssue,
  setSelectedIssue,
  setView,
  issues,
}) => {
  // ================== STATISTICAL DATA (Auto from issues) ==================
  const statusCount = issues.reduce(
    (acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, "In Progress": 0, Resolved: 0 }
  );

  const priorityCount = issues.reduce(
    (acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const typeCount = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  const statusPieData = [
    { name: "Pending", value: statusCount["Pending"] },
    { name: "In Progress", value: statusCount["In Progress"] },
    { name: "Resolved", value: statusCount["Resolved"] },
  ];

  const priorityBarData = [
    { name: "High", value: priorityCount["High"] },
    { name: "Medium", value: priorityCount["Medium"] },
    { name: "Low", value: priorityCount["Low"] },
  ];

  const complaintTypesData = Object.keys(typeCount).map((key) => ({
    name: key.length > 12 ? key.slice(0, 12) + "..." : key,
    value: typeCount[key],
  }));

  // (Demo) weekly trend
  const weeklyTrend = [
    { day: "Mon", complaints: 3 },
    { day: "Tue", complaints: 6 },
    { day: "Wed", complaints: 4 },
    { day: "Thu", complaints: 8 },
    { day: "Fri", complaints: 5 },
    { day: "Sat", complaints: 2 },
    { day: "Sun", complaints: 7 },
  ];

  // (Demo) avg response time
  const avgResponseTimeData = [
    { name: "Pending", hrs: 48 },
    { name: "In Progress", hrs: 18 },
    { name: "Resolved", hrs: 10 },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

  // ================== UI ==================
  return (
    <main className="p-4 sm:p-6 space-y-6 flex-1">
      {/* Main Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">CleanStreet Admin</h2>
        <p className="text-gray-500">
          Monitor and resolve civic issues in real-time
        </p>
      </div>

      {/* KPI Cards */} 
      <div className="grid grid-cols-1 md:grid-cols-2 grid-cols-4 xl:grid-cols-4 gap-6">

      {/* Pending */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Pending Issues</p>
            <p className="text-2xl font-bold text-gray-800">
              {statusCount["Pending"]}
            </p>
            <p className="text-xs text-red-500">Live</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">In Progress</p>
            <p className="text-2xl font-bold text-gray-800">
              {statusCount["In Progress"]}
            </p>
            <p className="text-xs text-orange-500">Live</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Resolved</p>
            <p className="text-2xl font-bold text-gray-800">
              {statusCount["Resolved"]}
            </p>
            <p className="text-xs text-green-500">Live</p>
          </div>
        </div>

        {/* Active Citizens (Static) */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Active Citizens</p>
            <p className="text-2xl font-bold text-gray-800">1234</p>
            <p className="text-xs text-blue-500">+45 this month</p>
          </div>
        </div>
      </div>

      {/* Reports and Map Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Reported Issues Table */}
        <div className="col-span-7 bg-white p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Latest Reported Issues
            </h3>
            <button
              onClick={() => setView("reported")}
              className="text-sm bg-[#B77A4D] text-white px-3 py-1 rounded-full hover:bg-[#A36C40] transition"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                  <th className="py-3 px-2 font-medium">ID</th>
                  <th className="py-3 px-2 font-medium">Issue Type</th>
                  <th className="py-3 px-2 font-medium">Location</th>
                  <th className="py-3 px-2 font-medium">Reporter</th>
                  <th className="py-3 px-2 font-medium">Date</th>
                  <th className="py-3 px-2 font-medium">Priority</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-150"
                    onClick={() => onIssueClick(issue)}
                  >
                    <td className="py-3 px-2 font-semibold">{issue.id}</td>
                    <td className="py-3 px-2">{issue.type}</td>
                    <td className="py-3 px-2 text-xs">{issue.location}</td>
                    <td className="py-3 px-2">{issue.reporter}</td>
                    <td className="py-3 px-2">{issue.date}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-inner ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Map View */}
        <div className="col-span-5 bg-white p-5 rounded-xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Real-Time Issue Map
            </h3>
            <div className="bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200 transition duration-300 transform hover:rotate-45">
              <span role="img" aria-label="refresh">
                🔄
              </span>
            </div>
          </div>

          <div className="relative flex-1 min-h-[360px]">
            <MapContainer
              center={
                selectedIssue
                  ? [selectedIssue.lat, selectedIssue.lng]
                  : [28.6139, 77.2090]
              }
              zoom={selectedIssue ? 14 : 11}
              className="w-full h-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />

              {issues.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[issue.lat, issue.lng]}
                  icon={statusIcon(issue.status)}
                  eventHandlers={{
                    click: () => onIssueClick(issue),
                  }}
                >
                  <Popup>
                    <b>{issue.type}</b>
                    <br />
                    {issue.location}
                    <br />
                    Priority: {issue.priority}
                    <br />
                    Status: {issue.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow text-sm z-[1000]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" /> Pending
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full" /> In
                Progress
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" /> Resolved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================== STATISTICAL ANALYTICS (6 CHARTS) ================== */}
      <div className="bg-white p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Statistical Analytics
          </h3>
          <span className="text-xs text-gray-400">
            Auto calculated from issues
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* 1) Status Pie */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Complaint Status
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                  >
                    {statusPieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2) Priority Bar */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Priority Distribution
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B77A4D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3) Complaint Types Pie */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Complaint Types
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintTypesData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                  >
                    {complaintTypesData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[(idx + 1) % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4) Weekly Trend Line */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Weekly Complaints Trend
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                  type="monotone"
                   dataKey="complaints"
                  stroke="#B77A4D"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5) Avg Response Time Bar */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Avg Response Time (hrs)
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgResponseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="hrs" fill="#A36C40" radius={[8, 8, 0, 0]} />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6) Quick Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Quick Summary
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-bold text-gray-800">{issues.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">High Priority</span>
                <span className="font-bold text-gray-800">
                  {priorityCount["High"]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Resolved Rate</span>
                <span className="font-bold text-gray-800">
                  {issues.length === 0
                    ? "0%"
                    : Math.round((statusCount["Resolved"] / issues.length) * 100) +
                      "%"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Pending Rate</span>
                <span className="font-bold text-gray-800">
                  {issues.length === 0
                    ? "0%"
                    : Math.round((statusCount["Pending"] / issues.length) * 100) +
                      "%"}
                </span>
              </div>

              <div className="pt-3 border-t text-xs text-gray-500">
                * Summary auto calculated from current issues list
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================== END ANALYTICS ================== */}
    </main>
  );
};

const AllReportedIssuesView = ({ onIssueClick, issues, users, setIssues, addActivity }) => {

  // sirf Worker dropdown me show honge
  const workers = users.filter((u) => u.role === "Worker");

  // ===================== SEARCH + FILTER STATES =====================
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | Pending | In Progress | Resolved

  // ===================== ASSIGN / RESOLVE / REOPEN =====================
  const handleAssign = (issueId, workerName) => {
  setIssues((prev) =>
    prev.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            assignedTo: workerName,
            status:
              workerName && issue.status === "Pending"
                ? "In Progress"
                : issue.status,
          }
        : issue
    )
  );

  if (workerName) {
    addActivity(
      "Worker Assigned",
      `Issue ${issueId} assigned to ${workerName}`,
      "assign"
    );
  }
};


  const handleResolve = (issueId) => {
  setIssues((prev) =>
    prev.map((issue) =>
      issue.id === issueId ? { ...issue, status: "Resolved" } : issue
    )
  );

  addActivity("Issue Resolved", `Issue ${issueId} marked as Resolved`, "resolved");
};


 const handleReopen = (issueId) => {
  setIssues((prev) =>
    prev.map((issue) =>
      issue.id === issueId ? { ...issue, status: "Pending" } : issue
    )
  );

  addActivity("Issue Reopened", `Issue ${issueId} reopened by admin`, "status");
};


  // ===================== FILTER DATA =====================
  const filteredIssues = useMemo(() => {
    let data = [...issues];

    // Search
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      data = data.filter((issue) => {
        return (
          (issue.id || "").toLowerCase().includes(q) ||
          (issue.type || "").toLowerCase().includes(q) ||
          (issue.location || "").toLowerCase().includes(q) ||
          (issue.reporter || "").toLowerCase().includes(q)
        );
      });
    }

    // Status Filter
    if (statusFilter !== "ALL") {
      data = data.filter((issue) => issue.status === statusFilter);
    }

    return data;
  }, [issues, searchTerm, statusFilter]);

  // ===================== UI =====================
  return (
    <main className="p-4 sm:p-6 space-y-6 flex-1">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Reported Issues</h2>
        <p className="text-gray-500">View and manage all complaints</p>
      </div>

    {/* ✅ SEARCH + STATUS FILTER (ONE LINE FIXED) */}
<div className="bg-white p-5 rounded-xl shadow-lg">
  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
    
    {/* Search */}
    <div className="sm:col-span-9">
      <p className="text-xs font-semibold text-gray-600 mb-2">Search</p>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by ID, type, location, reporter..."
        className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-50"
      />

      <p className="text-xs text-gray-400 mt-2">
        Showing {filteredIssues.length} of {issues.length} issues
      </p>
    </div>

    {/* Status */}
    <div className="sm:col-span-3">
      <p className="text-xs font-semibold text-gray-600 mb-2">Status</p>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-50"
      >
        <option value="ALL">ALL</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>

  </div>
</div>


      {/* ✅ TABLE */}
      <div className="bg-white p-5 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                <th className="py-3 px-2 font-medium">ID</th>
                <th className="py-3 px-2 font-medium">Issue Type</th>
                <th className="py-3 px-2 font-medium">Location</th>
                <th className="py-3 px-2 font-medium">Reporter</th>
                <th className="py-3 px-2 font-medium">Date</th>
                <th className="py-3 px-2 font-medium">Status</th>
                <th className="py-3 px-2 font-medium">Assign To</th>
                <th className="py-3 px-2 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b last:border-b-0 text-gray-700 hover:bg-gray-50 transition"
                >
                  <td
                    className="py-3 px-2 font-semibold cursor-pointer"
                    onClick={() => onIssueClick(issue)}
                  >
                    {issue.id}
                  </td>

                  <td
                    className="py-3 px-2 cursor-pointer"
                    onClick={() => onIssueClick(issue)}
                  >
                    {issue.type}
                  </td>

                  <td
                    className="py-3 px-2 text-xs cursor-pointer"
                    onClick={() => onIssueClick(issue)}
                  >
                    {issue.location}
                  </td>

                  <td
                    className="py-3 px-2 cursor-pointer"
                    onClick={() => onIssueClick(issue)}
                  >
                    {issue.reporter}
                  </td>

                  <td className="py-3 px-2">{issue.date}</td>

                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </td>

                  {/* Assign To */}
                  <td className="py-3 px-2">
                    <select
                      value={issue.assignedTo || ""}
                      onChange={(e) => handleAssign(issue.id, e.target.value)}
                      className="border px-3 py-2 rounded-lg text-sm bg-white w-44"
                      disabled={issue.status === "Resolved"}
                    >
                      <option value="">Select Worker</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-2 text-right">
                    {issue.status !== "Resolved" ? (
                      <button
                        onClick={() => handleResolve(issue.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-green-600 text-white hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(issue.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No issues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};


const RecentActivityView = ({ activities }) => {
  const getBadge = (type) => {
    switch (type) {
      case "assign":
        return "bg-blue-100 text-blue-700";
      case "status":
        return "bg-orange-100 text-orange-700";
      case "new":
        return "bg-purple-100 text-purple-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "user":
      return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 flex-1 w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
        <p className="text-gray-500">Latest updates and actions in the system</p>
      </div>

      {/* Full width Card */}
      <div className="bg-white p-5 rounded-xl shadow-lg w-full">
        <div className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border-b last:border-b-0 pb-4 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadge(
                  item.type
                )}`}
              >
                {item.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
// --- Manage Users View (Assign issue from here) ---
const ManageUsersView = ({
  users,
  onDeleteUser,
  onEditUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [openActionUserId, setOpenActionUserId] = useState(null);

  // Cities dropdown from users
  const cities = Array.from(new Set(users.map((u) => u.city).filter(Boolean)));

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const city = (user.city || "").toLowerCase();

    const searchOk =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      city.includes(searchTerm.toLowerCase());

    const roleOk = roleFilter === "ALL" ? true : user.role === roleFilter;
    const cityOk = cityFilter === "ALL" ? true : user.city === cityFilter;

    return searchOk && roleOk && cityOk;
  });

  // Role pill color
  const getRoleBadge = (role) => {
    if (role === "Admin") return "bg-purple-100 text-purple-700";
    if (role === "Volunteer") return "bg-blue-100 text-blue-700";
    if (role === "Worker") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  // Role update (cycle)
  const getNextRole = (currentRole) => {
    const roles = ["User", "Volunteer", "Admin", "Worker"];
    const idx = roles.indexOf(currentRole);
    return roles[(idx + 1) % roles.length];
  };

  const handleRoleChange = (user) => {
    const updatedUser = { ...user, role: getNextRole(user.role) };
    onEditUser(updatedUser); // parent will handle update
    setOpenActionUserId(null);
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 flex-1">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-700" />
          User Management
        </h2>
        <p className="text-gray-500 text-sm">
          Manage and filter user accounts
        </p>
      </div>

      {/* Filters (ONE LINE) */}
      <div className="bg-white p-5 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Search Users
            </p>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or location..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          {/* Role Filter */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Filter by Role
            </p>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-50"
            >
              <option value="ALL">ALL</option>
              <option value="User">User</option>
              <option value="Worker">Worker</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Filter by City
            </p>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-50"
            >
              <option value="ALL">ALL</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-5 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                <th className="py-3 px-3 font-medium">Name</th>
                <th className="py-3 px-3 font-medium">Email</th>
                <th className="py-3 px-3 font-medium">City</th>
                <th className="py-3 px-3 font-medium">Role</th>
                <th className="py-3 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-b-0 text-gray-700 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-3 font-semibold">{user.name}</td>

                  <td className="py-3 px-3 text-blue-600">{user.email}</td>

                  <td className="py-3 px-3">{user.city || "N/A"}</td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Actions last */}
                  <td className="py-3 px-3 text-right relative">
                    <button
                      onClick={() =>
                        setOpenActionUserId(
                          openActionUserId === user.id ? null : user.id
                        )
                      }
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      title="Actions"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Dropdown */}
                    {openActionUserId === user.id && (
                      <div className="absolute right-3 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => handleRoleChange(user)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 text-left"
                        >
                          <UserCog className="w-4 h-4 text-gray-600" />
                          Change Role
                        </button>

                        <button
                          onClick={() => {
                            onDeleteUser(user.id);
                            setOpenActionUserId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 text-left text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-500 text-sm"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};


// --- Main Component (Handles State and Navigation) ---
const Admin = () => {
  // State for view: 'dashboard' or 'detail'
  const [view, setView] = useState('dashboard');
  // State to hold the data of the currently selected issue
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [users, setUsers] = useState(usersList);
  const [activities, setActivities] = useState(recentActivityData);


  // ✅ Issues state (so assignment updates show)
const [issues, setIssues] = useState(
  reportedIssues.map((i) => ({
    ...i,
    assignedTo: "",
    assignedRole: "",
  }))
);


  /**
   * Switches to the detail view and sets the selected issue data.
   * @param {Object} issue - The issue object to display.
   */
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setView('detail');
  };

  /**
   * Switches back to the dashboard view.
   */
  const handleBack = () => {
    setSelectedIssue(null);
    setView('dashboard');
  };

  const addActivity = (title, description, type = "new") => {
  const newLog = {
    id: Date.now(),
    title,
    description,
    time: "Just now",
    type, // assign | status | new | resolved | user
  };

  setActivities((prev) => [newLog, ...prev]);
};

  // ✅ Assign issue to user
const assignIssueToUser = (issueId, user) => {
  setIssues((prev) =>
    prev.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            assignedTo: user.name,
            assignedRole: user.role,
            status: "In Progress",
          }
        : issue
    )
  );

  addActivity(
    "Issue Assigned",
    `Issue ${issueId} assigned to ${user.name} (${user.role})`,
    "assign"
  );
};


const unassignIssue = (issueId) => {
  setIssues((prev) =>
    prev.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            assignedTo: "",
            assignedRole: "",
            status: "Pending",
          }
        : issue
    )
  );
};

return (
  <div className="flex h-screen bg-gray-50 font-sans">
    
    {/* Sidebar */}
    <div className="w-64 bg-[#B77A4D] text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold bg-[#A36C40] tracking-wider">
        CleanStreet
      </div>

      <nav className="flex-grow p-4 space-y-2">
  <div
    onClick={() => setView("dashboard")}
    className={`flex items-center p-3 text-lg space-x-3 cursor-pointer rounded-lg transition duration-150 ease-in-out transform hover:scale-[1.02]
    ${view === "dashboard" ? "bg-[#A36C40]" : "hover:bg-[#A36C40]"}`}
  >
    <LayoutDashboard className="text-xl" />
    <span>Dashboard</span>
  </div>

  <div
    onClick={() => setView("users")}
    className={`flex items-center p-3 text-lg space-x-3 cursor-pointer rounded-lg transition
    ${view === "users" ? "bg-[#A36C40]" : "hover:bg-[#A36C40]"}`}
  >
    <Users className="text-xl" />
    <span>Manage Users</span>
  </div>

  <div
    onClick={() => setView("reported")}
    className={`flex items-center p-3 text-lg space-x-3 cursor-pointer rounded-lg transition duration-150 ease-in-out transform hover:scale-[1.02]
    ${view === "reported" ? "bg-[#A36C40]" : "hover:bg-[#A36C40]"}`}
  >
    <ClipboardEdit className="text-xl" />
    <span>Reported Issues</span>
  </div>

  {/* ✅ Recent Activity (NOW INSIDE NAV) */}
  <div
    onClick={() => setView("activity")}
    className={`flex items-center p-3 text-lg space-x-3 cursor-pointer rounded-lg transition duration-150 ease-in-out transform hover:scale-[1.02]
    ${view === "activity" ? "bg-[#A36C40]" : "hover:bg-[#A36C40]"}`}
  >
    <Activity className="text-xl" />
    <span>Recent Activity</span>
  </div>
</nav>


      <div className="p-4 border-t border-white/20 text-sm">
        Admin Profile Settings
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-auto">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm sticky top-0 z-10">
        <h1 className="text-base sm:text-lg font-semibold text-gray-700">
          CleanStreet Admin Panel
        </h1>
      </header>

      {/* CONDITIONAL CONTENT */}
      {view === "dashboard" && (
        <DashboardView
          onIssueClick={handleIssueClick}
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
          setView={setView}
          issues={issues}
        />
      )}

      {view === "reported" && (
  <AllReportedIssuesView
    onIssueClick={handleIssueClick}
    issues={issues}
    users={users}
    setIssues={setIssues}
    addActivity={addActivity}
  />
)}



      {view === "users" && (
  <ManageUsersView
    users={users}
    onDeleteUser={(userId) => {
  const user = users.find((u) => u.id === userId);

  setUsers((prev) => prev.filter((u) => u.id !== userId));

  addActivity(
    "User Deleted",
    `User ${user?.name || userId} removed from system`,
    "user"
  );
}}

    onEditUser={(updatedUser) =>
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      )
    }
  />
)}


{view === "activity" && (
  <RecentActivityView activities={activities} />
)}

      {view === "detail" && (
        <IssueDetailView
          issue={selectedIssue}
          onBack={() => setView("reported")}
        />
      )}
    </div>
  </div>
);
};
export default Admin;
