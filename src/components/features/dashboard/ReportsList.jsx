import { Link } from "react-router-dom";
import { FileText, MapPin, ChevronRight } from "lucide-react";
import Card from "../../common/Card";

const ReportsList = ({
  reports = [],
  activeTab = "all",
  onTabChange,
  getTimeAgo,
}) => {
  const tabs = ["all", "pending", "progress", "resolved"];

  const getIssueEmoji = (type) => {
    const emojis = {
      "Garbage": "🗑️",
      "Road Damage": "🕳️",
      "Water Leakage": "💧",
      "Streetlight Issue": "💡",
      "Drainage Problem": "🚰",
      "Other": "📋",
    };
    return emojis[type] || "📋";
  };

  const getStatusStyles = (status) => {
    const styles = {
      "Resolved": "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200",
      "In Progress": "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-200",
      "Pending": "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-orange-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityIndicator = (priority) => {
    const indicators = {
      high: "border-l-4 border-l-red-500 bg-red-50/50",
      medium: "border-l-4 border-l-amber-500 bg-amber-50/50",
      low: "border-l-4 border-l-green-500 bg-green-50/50",
    };
    return indicators[priority?.toLowerCase()] || "";
  };

  return (
    <Card delay="delay-300">
      <Card.Header
        icon={FileText}
        iconGradient="from-blue-400 to-indigo-500"
        action={
          <Link to="/my-reports" className="flex items-center gap-1 text-emerald-600 text-sm font-semibold hover:text-emerald-700 group">
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        }
      >
        My Reports
      </Card.Header>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No reports found</p>
            <p className="text-sm">Start by reporting an issue in your community</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report._id}
              className={`p-4 rounded-2xl transition-all cursor-pointer hover:shadow-md ${getPriorityIndicator(report.priorityLevel)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIssueEmoji(report.issueType)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{report.issueTitle}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${getStatusStyles(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{report.address || "Location not specified"}</span>
                    <span className="text-gray-300">•</span>
                    <span>{getTimeAgo(report.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="font-semibold">{report.issueType}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <span className="font-semibold">{report.priorityLevel}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ReportsList;
