import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, TrendingUp, CheckCircle, Users } from "lucide-react";

const HeroSection = ({ backgroundImage }) => {
  const stats = [
    { value: "15K+", label: "Issues Reported", icon: TrendingUp },
    { value: "8.2K+", label: "Issues Resolved", icon: CheckCircle },
    { value: "5K+", label: "Active Users", icon: Users },
  ];

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="City" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-24 lg:pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Making communities cleaner together</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Making Our Cities{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              Cleaner
            </span>
            , One Report at a Time
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Report local issues like garbage dumps, potholes, water leakage, and broken streetlights.
            Track progress and make a real difference in your neighborhood.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/signup"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 btn-press"
            >
              Start Reporting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <stat.icon className="w-6 h-6 text-green-300 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
