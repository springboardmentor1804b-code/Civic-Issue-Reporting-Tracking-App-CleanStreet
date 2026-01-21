import { Link } from "react-router-dom";
import { Activity, CheckCircle, FileText, RefreshCw, Clock, ChevronRight } from "lucide-react";
import Card from "../../common/Card";

const ActivityList = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      resolved: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      reported: <FileText className="w-5 h-5 text-blue-500" />,
      updated: <RefreshCw className="w-5 h-5 text-amber-500" />,
      progress: <Clock className="w-5 h-5 text-purple-500" />,
    };
    return icons[type] || <Activity className="w-5 h-5 text-gray-500" />;
  };

  return (
    <Card delay="delay-200">
      <Card.Header
        icon={Activity}
        iconGradient="from-green-400 to-emerald-500"
        action={
          <Link to="/activity" className="flex items-center gap-1 text-emerald-600 text-sm font-semibold hover:text-emerald-700 group">
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        }
      >
        Recent Activity
      </Card.Header>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50/50 transition-all cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityList;
