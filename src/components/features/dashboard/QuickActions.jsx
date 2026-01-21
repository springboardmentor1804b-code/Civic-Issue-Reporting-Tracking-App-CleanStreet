import { Link } from "react-router-dom";
import { Plus, Eye, MapPin, ArrowUpRight, Zap } from "lucide-react";
import Card from "../../common/Card";

const QuickActions = () => {
  return (
    <Card delay="delay-300">
      <Card.Header icon={Zap} iconGradient="from-violet-400 to-purple-500">
        Quick Actions
      </Card.Header>

      <div className="space-y-3">
        <Link
          to="/report-issue"
          className="flex items-center gap-4 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4 rounded-2xl hover:shadow-lg hover:shadow-green-200 transition-all group btn-press"
        >
          <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-base">Report New Issue</span>
            <p className="text-white/70 text-xs">Help improve your community</p>
          </div>
          <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link to="/complaints" className="flex items-center gap-4 w-full bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl hover:shadow-md transition-all group border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-800">View All Complaints</span>
            <p className="text-gray-500 text-xs">Browse community issues</p>
          </div>
        </Link>

        <Link to="/map" className="flex items-center gap-4 w-full bg-gradient-to-r from-gray-50 to-red-50 p-4 rounded-2xl hover:shadow-md transition-all group border border-gray-100">
          <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
            <MapPin className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-800">Issue Map</span>
            <p className="text-gray-500 text-xs">Explore nearby reports</p>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default QuickActions;
