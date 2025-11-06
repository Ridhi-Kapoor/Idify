import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
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
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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

export default function DiscountMap({ places=[], defaultCenter = [28.5453, 77.1926] }) {
  const [center, setCenter] = useState(defaultCenter);

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
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UseMyLocation setCenter={setCenter} />
      {places.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]}>
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
