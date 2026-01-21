import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl animate-fade-in-up">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
              <span className="text-sm font-medium">Join 5,000+ active citizens</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/90 mb-8 text-lg max-w-xl mx-auto">
              Join thousands of citizens working together to create cleaner, safer communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all btn-press"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
