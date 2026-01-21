import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight } from "lucide-react";

const CommunitySection = ({ image }) => {
  const benefits = [
    "Engage with local authorities",
    "Support community initiatives",
    "Volunteer and make impact",
  ];

  return (
    <section className="relative py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
          <img src={image} className="w-full object-cover max-h-[500px]" alt="Community" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center p-8 md:p-16">
            <div className="max-w-lg">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join a Growing Community of Active Citizens
              </h3>
              <ul className="space-y-3 mb-6">
                {benefits.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all btn-press"
              >
                Join the Community
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
