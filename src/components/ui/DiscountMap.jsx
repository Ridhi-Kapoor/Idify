import { useEffect, useState, useMemo, useRef } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Utility: directions link
const goToDirections = (lat, lng) => {
  // --- FIX for directions link ---
  // Was: https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  // --- END FIX ---
  window.open(url, "_blank");
};

// Center map on user location once
function UseMyLocation({ setCenter }) {
  const map = useMap();
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = [pos.coords.latitude, pos.coords.longitude];
        setCenter(next);
        map.setView(next, 15);
      },
      () => {}, // ignore errors, keep default center
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [map, setCenter]);
  return null;
}

// --- NEW ---
// 2. New component to handle flying to and opening popups
function HandleSelectedPlace({ selectedPlace, markerRefs, places }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      // Find the marker ref by its unique name
      const markerRef = markerRefs.current[selectedPlace.name];
      
      // Find the place data to get its lat/lng
      const placeData = places.find(p => p.name === selectedPlace.name);

      if (markerRef && placeData) {
        // Fly map to the new coordinates
        map.flyTo([placeData.lat, placeData.lng], 16); // Zoom in a bit closer
        
        // Open the popup
        // Use a small timeout to ensure the popup opens after the "fly" animation
        setTimeout(() => {
          markerRef.openPopup();
        }, 300);
      }
    }
  }, [selectedPlace, map, markerRefs, places]);

  return null; // This component does not render anything
}
// --- END NEW ---

// 3. Accept 'selectedPlace' prop
export default function DiscountMap({ places=[], defaultCenter = [28.5453, 77.1926], selectedPlace = null }) {
  const [center, setCenter] = useState(defaultCenter);
  
  // --- NEW ---
  // 4. Create a ref to hold refs for all markers
  const markerRefs = useRef({});
  // --- END NEW ---

  // Fit bounds to all markers (after render)
  const bounds = useMemo(() => {
    if (!places?.length) return null;
    const b = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    return b;
  }, [places]);

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: 380, width: "100%", borderRadius: 16 }}
      whenCreated={(map) => {
        if (bounds) map.fitBounds(bounds, { padding: [40, 40] });
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UseMyLocation setCenter={setCenter} />
      
      {/* --- NEW --- */}
      {/* 5. Add the component to handle map interactions */}
      <HandleSelectedPlace 
        selectedPlace={selectedPlace} 
        markerRefs={markerRefs} 
        places={places}
      />
      {/* --- END NEW --- */}
      
      {places.map((p, i) => (
        <Marker 
          key={i} 
          position={[p.lat, p.lng]}
          // --- NEW ---
          // 6. Assign the ref for this specific marker
          ref={(el) => {
            if (el) {
              markerRefs.current[p.name] = el;
            }
          }}
          // --- END NEW ---
        >
          <Popup>
            <div className="space-y-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs opacity-80">{p.offer} • {p.tag}</div>
              <button
                onClick={() => goToDirections(p.lat, p.lng)}
                className="mt-2 inline-flex items-center rounded-md border px-2 py-1 text-xs hover:bg-muted"
              >
                Get Directions
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
