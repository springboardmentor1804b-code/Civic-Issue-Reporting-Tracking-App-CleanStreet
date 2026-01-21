import { Link } from "react-router-dom";
import { Calendar, Plus, Sparkles } from "lucide-react";

const WelcomeSection = ({ userName = "User" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in-up">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
            {getGreeting()}, <span className="gradient-text">{userName}</span>!
          </h1>
          <span className="text-3xl animate-bounce-subtle">👋</span>
        </div>
        <p className="text-gray-500 flex items-center gap-2 text-sm md:text-base">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <Link
        to="/report-issue"
        className="group flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-green-200 transition-all transform hover:-translate-y-1 btn-press animate-gradient"
        style={{ backgroundSize: '200% 200%' }}
      >
        <div className="p-1.5 bg-white/20 rounded-lg">
          <Plus className="w-5 h-5" />
        </div>
        <span className="font-semibold">Report New Issue</span>
        <Sparkles className="w-4 h-4 opacity-70" />
      </Link>
    </div>
  );
};

export default WelcomeSection;
