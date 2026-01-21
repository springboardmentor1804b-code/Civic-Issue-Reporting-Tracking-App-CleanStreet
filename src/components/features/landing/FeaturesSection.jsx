import {
  Camera,
  MapPin,
  Bell,
  Vote,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Users,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    { icon: Camera, title: "Photo Reports", description: "Capture and upload issue photos", color: "from-blue-500 to-indigo-600" },
    { icon: MapPin, title: "Location Tracking", description: "Precise GPS location tagging", color: "from-red-500 to-rose-600" },
    { icon: Bell, title: "Real-time Updates", description: "Instant status notifications", color: "from-amber-500 to-orange-600" },
    { icon: Vote, title: "Community Voting", description: "Prioritize important issues", color: "from-purple-500 to-violet-600" },
    { icon: AlertTriangle, title: "Emergency Issues", description: "Flag urgent problems", color: "from-red-600 to-pink-600" },
    { icon: TrendingUp, title: "Progress Tracking", description: "Monitor resolution status", color: "from-green-500 to-emerald-600" },
    { icon: ShieldCheck, title: "Verified Updates", description: "Official confirmations", color: "from-teal-500 to-cyan-600" },
    { icon: Users, title: "Community Action", description: "Collaborate with neighbors", color: "from-indigo-500 to-blue-600" },
  ];

  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Better Communities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve issues efficiently
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all card-hover border border-gray-200/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
