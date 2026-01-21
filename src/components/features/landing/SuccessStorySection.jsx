import { CheckCircle } from "lucide-react";

const SuccessStorySection = ({ image }) => {
  return (
    <section className="relative py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
          <img src={image} className="w-full object-cover" alt="Issue Fixed" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <CheckCircle className="w-4 h-4" />
              Success Story
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Community-Driven Change in Action
            </h3>
            <p className="text-white/80 max-w-xl">
              See how citizen reports led to real improvements in neighborhoods across the city
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStorySection;
