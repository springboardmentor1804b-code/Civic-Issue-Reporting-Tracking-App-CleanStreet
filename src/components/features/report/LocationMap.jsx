import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map Marker Component
const MapMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position}></Marker> : null;
};

const LocationMap = ({ position, setPosition, center = [20.5937, 78.9629], zoom = 5 }) => {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">Location on Map</h3>
      </div>

      <p className="text-sm text-gray-500 mb-3">Click on the map to mark the exact location of the issue</p>

      <div className="h-64 sm:h-72 md:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
        <MapContainer center={center} zoom={zoom} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {position && (
        <p className="text-sm text-green-600 mt-2 font-medium">
          Location selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </p>
      )}
    </section>
  );
};

export default LocationMap;
