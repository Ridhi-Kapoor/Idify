import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";

// Firebase (backend)
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// --- Marker icon fix for Leaflet + Vite ---
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// --- Helper: fly map to coords ---
function FlyTo({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

// --- Geolocation Hook ---
function useGeolocation() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);
  const locate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (res) => {
        setPos([res.coords.latitude, res.coords.longitude]);
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  return { pos, error, locate };
}

// --- Nominatim search (free) ---
async function searchPlaces(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// --- OSRM route (no key, public demo; light usage) ---
async function getRoute(from, to, profile = "driving") {
  // from/to: [lat, lng]
  const [fl, fo] = from;
  const [tl, toLng] = to;
  const url = `https://router.project-osrm.org/route/v1/${profile}/${fo},${fl};${toLng},${tl}?overview=full&geometries=polyline&steps=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing failed");
  const data = await res.json();
  if (!data.routes?.length) throw new Error("No route found");
  const r = data.routes[0];
  return {
    distanceMeters: r.distance,
    durationSeconds: r.duration,
    lineLatLngs: polyline.decode(r.geometry).map(([lat, lng]) => [lat, lng]),
  };
}

function formatKm(m) {
  if (m < 1000) return `${m.toFixed(0)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}
function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function MapApp() {
  const defaultCenter = useMemo(() => [28.6139, 77.2090], []); // New Delhi
  const { pos: myPos, locate, error: geoErr } = useGeolocation();

  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(defaultCenter);

  // Routing state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromLL, setFromLL] = useState(null);
  const [toLL, setToLL] = useState(null);
  const [route, setRoute] = useState(null);
  const [routing, setRouting] = useState(false);
  const [routeErr, setRouteErr] = useState(null);

  const searchRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setLoadingSearch(true);
    try {
      const data = await searchPlaces(searchQ.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const pickResult = (r) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const ll = [lat, lon];
    setCenter(ll);
    setMarker(ll);
    setResults([]);
    setSearchQ(r.display_name);
  };

  const useMyLocation = async (forField) => {
    if (!myPos) {
      locate();
      return;
    }
    const [lat, lon] = myPos;
    // reverse geocode label (optional, lightweight)
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lon);
      url.searchParams.set("format", "json");
      const j = await fetch(url).then((r) => r.json());
      const label = j.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      if (forField === "from") {
        setFrom(label);
        setFromLL([lat, lon]);
      } else {
        setTo(label);
        setToLL([lat, lon]);
      }
    } catch (_) {
      const label = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      if (forField === "from") {
        setFrom(label);
        setFromLL([lat, lon]);
      } else {
        setTo(label);
        setToLL([lat, lon]);
      }
    }
  };

  const geocode = async (text, setterLL) => {
    if (!text?.trim()) return;
    const data = await searchPlaces(text.trim());
    if (data?.length) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setterLL([lat, lon]);
    }
  };

  const makeRoute = async () => {
    if (!fromLL || !toLL) return;
    setRouting(true);
    setRouteErr(null);
    try {
      const r = await getRoute(fromLL, toLL);
      setRoute(r);
      setCenter(r.lineLatLngs[Math.floor(r.lineLatLngs.length / 2)]);
    } catch (err) {
      setRouteErr(err.message);
      setRoute(null);
    } finally {
      setRouting(false);
    }
  };

  // === Firebase Save / Load (no UI change) ===
  async function saveCurrentPlace() {
    const u = auth.currentUser;
    if (!u || !marker) return;
    await addDoc(collection(db, "users", u.uid, "places"), {
      name: searchQ || "Pinned location",
      lat: marker[0],
      lng: marker[1],
      savedAt: Date.now(),
    });
    console.log("Saved!", { lat: marker[0], lng: marker[1], name: searchQ || "Pinned location" });
  }

  async function loadMyPlaces() {
    const u = auth.currentUser;
    if (!u) return [];
    const snap = await getDocs(collection(db, "users", u.uid, "places"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Jump to newest saved, if any
    if (list.length) {
      list.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
      const p = list[0];
      setCenter([p.lat, p.lng]);
      setMarker([p.lat, p.lng]);
      setSearchQ(p.name || "");
      console.log("Loaded latest place:", p);
    } else {
      console.log("No saved places yet.");
    }
    return list;
  }
  // Expose for console usage (optional)
  useEffect(() => {
    window.mapApi = { saveCurrentPlace, loadMyPlaces };
    return () => { if (window.mapApi) delete window.mapApi; };
  }, []);
  // Keyboard shortcuts: S = save, L = load
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "s") saveCurrentPlace();
      if (e.key.toLowerCase() === "l") loadMyPlaces();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [marker, searchQ]);
  // === END Firebase helpers ===

  // Simple styles
  const pill = "rounded-xl border px-3 py-2 text-sm";
  const btn = "rounded-xl border px-3 py-2 text-sm hover:opacity-80 active:opacity-60";
  const card = "backdrop-blur bg-white/80 border rounded-2xl p-3 shadow-lg";
// expose helpers to the browser console
useEffect(() => {
  window.mapApi = { saveCurrentPlace, loadMyPlaces };
  return () => { delete window.mapApi; };
}, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Controls */}
      <div className="absolute z-[1000] left-4 top-4 w-[min(520px,calc(100vw-2rem))] space-y-3">
        <div className={card}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              ref={searchRef}
              className={`${pill} flex-1`}
              placeholder="Search a place or address (free)"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
            <button className={btn} type="submit">Search</button>
            <button className={btn} type="button" onClick={() => locate()}>Locate me</button>
          </form>
          {loadingSearch && <div className="mt-2 text-sm">Searching…</div>}
          {!!results.length && (
            <div className="mt-2 max-h-60 overflow-auto divide-y rounded-xl border bg-white">
              {results.map((r) => (
                <button
                  key={r.place_id}
                  className="w-full text-left p-2 hover:bg-gray-50"
                  onClick={() => pickResult(r)}
                >
                  <div className="text-sm font-medium">{r.display_name}</div>
                  {r.address && (
                    <div className="text-xs opacity-70">
                      {[r.address.road, r.address.city || r.address.town || r.address.village, r.address.state, r.address.country]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          {geoErr && <div className="mt-2 text-xs text-red-600">{geoErr}</div>}
        </div>

        {/* Directions */}
        <div className={card}>
          <div className="text-sm font-semibold mb-2">Directions (free OSRM)</div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                className={`${pill} flex-1`}
                placeholder="From: address/place"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onBlur={() => geocode(from, setFromLL)}
              />
              <button className={btn} type="button" onClick={() => useMyLocation("from")}>Use my location</button>
            </div>
            <div className="flex gap-2">
              <input
                className={`${pill} flex-1`}
                placeholder="To: address/place"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onBlur={() => geocode(to, setToLL)}
              />
              <button className={btn} type="button" onClick={() => useMyLocation("to")}>Use my location</button>
            </div>
            <div className="flex gap-2 items-center">
              <button className={btn} type="button" onClick={makeRoute} disabled={routing || !fromLL || !toLL}>
                {routing ? "Routing…" : "Get route"}
              </button>
              <button className={btn} type="button" onClick={() => setRoute(null)}>Clear</button>
              {route && (
                <div className="text-sm ml-auto">
                  <span className="font-medium">{formatKm(route.distanceMeters)}</span>
                  <span className="opacity-70"> • {formatTime(route.durationSeconds)}</span>
                </div>
              )}
            </div>
            {routeErr && <div className="text-xs text-red-600">{routeErr}</div>}
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FlyTo center={center} />
        {marker && (
          <Marker position={marker} icon={icon}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
        {myPos && (
          <Marker position={myPos} icon={icon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {route?.lineLatLngs && (
          <Polyline positions={route.lineLatLngs} />
        )}
      </MapContainer>

      {/* Footer */}
      <div className="absolute bottom-3 right-3 z-[1000] text-xs opacity-70 bg-white/80 rounded-full px-3 py-1 border">
        Free maps by OpenStreetMap + Nominatim + OSRM
      </div>
    </div>
  );
}
