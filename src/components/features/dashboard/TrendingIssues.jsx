import { Flame, MapPin, ThumbsUp } from "lucide-react";
import Card from "../../common/Card";

const TrendingIssues = ({ issues = [] }) => {
  return (
    <Card delay="delay-400">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Trending Issues</h2>
        <span className="ml-auto text-xs font-semibold text-orange-500 bg-orange-100 px-2 py-1 rounded-full animate-pulse">LIVE</span>
      </div>

      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div
            key={issue.id}
            className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all cursor-pointer group"
          >
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg ${
              index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
              index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
              index === 2 ? "bg-gradient-to-br from-amber-500 to-orange-600" :
              "bg-gray-300"
            }`}>
              #{index + 1}
              {issue.hot && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors truncate">{issue.title}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{issue.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <ThumbsUp className="w-4 h-4" />
                {issue.votes}
              </div>
              <span className="text-xs text-emerald-500 font-semibold">{issue.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TrendingIssues;
