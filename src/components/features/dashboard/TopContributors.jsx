import { Link } from "react-router-dom";
import { Award, ChevronRight } from "lucide-react";
import Card from "../../common/Card";

const TopContributors = ({ contributors = [] }) => {
  const getBadgeStyles = (badge) => {
    const styles = {
      gold: "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-lg shadow-yellow-200",
      silver: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-lg shadow-gray-200",
      bronze: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg shadow-amber-200",
    };
    return styles[badge] || "bg-gray-400";
  };

  return (
    <Card delay="delay-500">
      <Card.Header icon={Award} iconGradient="from-yellow-400 to-amber-500">
        Top Contributors
      </Card.Header>

      <div className="space-y-3">
        {contributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all cursor-pointer group"
          >
            <div className="relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${getBadgeStyles(contributor.badge)}`}>
                {contributor.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-sm">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors">{contributor.name}</p>
              <p className="text-xs text-gray-500">{contributor.reports} reports • {contributor.level}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600">{contributor.points}</p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link to="/leaderboard" className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
          View Full Leaderboard
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
};

export default TopContributors;
