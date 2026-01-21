import { MapPin, Camera } from "lucide-react";

const MapGallerySection = ({ mapImage, galleryImages = [] }) => {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Community Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            See What's Happening in Your Area
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track reported issues on our interactive map and see how communities are coming together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Card */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden border border-gray-200/80 card-hover animate-fade-in-left">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Reported Issues Map</h3>
                  <p className="text-sm text-gray-500">Live tracking of community reports</p>
                </div>
              </div>
            </div>
            <div className="h-[400px] md:h-[500px]">
              <img src={mapImage} className="w-full h-full object-cover" alt="Issues Map" />
            </div>
          </div>

          {/* Gallery Card */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden border border-gray-200/80 card-hover animate-fade-in-right">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Community Gallery</h3>
                  <p className="text-sm text-gray-500">Before & after transformations</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className="rounded-2xl shadow-md w-full h-[200px] object-cover hover:scale-[1.02] transition-transform"
                  alt={`Community ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapGallerySection;
