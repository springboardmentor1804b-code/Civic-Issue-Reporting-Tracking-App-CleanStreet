import { TrendingUp } from "lucide-react";

const StatsCard = ({
  label,
  value,
  icon: Icon,
  gradient = "from-blue-500 to-indigo-600",
  bgColor = "bg-blue-50",
  trend = "+12%",
  delay = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden ${bgColor} rounded-3xl p-5 md:p-6 card-hover border border-gray-200/80 shadow-sm animate-fade-in-up ${delay}`}
    >
      {/* Decorative gradient blur */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-20 blur-2xl`}></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-100 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        </div>
        <p className="text-4xl md:text-5xl font-bold text-gray-800 mb-1">{value}</p>
        <p className="text-gray-500 font-medium text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
