import { Target, Users } from "lucide-react";

const CommunityImpact = ({ stats = {}, progressWidths = {} }) => {
  const impactItems = [
    { label: "Issues Reported", value: stats.issuesReported || 0, width: progressWidths.reported, color: "bg-white" },
    { label: "Resolved", value: stats.resolved || 0, width: progressWidths.resolved, color: "bg-emerald-300" },
    { label: "Active Users", value: stats.activeUsers || 0, width: progressWidths.users, color: "bg-teal-300" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl shadow-xl p-6 text-white animate-fade-in-up delay-400">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

      <div className="relative">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          Community Impact
        </h2>

        <div className="space-y-5">
          {impactItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80 font-medium">{item.label}</span>
                <span className="font-bold">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${item.width}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white/70" />
              <span className="text-sm text-white/70">Join the movement</span>
            </div>
            <span className="text-2xl font-bold">#CleanStreet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityImpact;
