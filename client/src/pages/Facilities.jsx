import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon path broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom pin colours
const makeIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowSize:  [41, 41],
  });

const greenIcon = makeIcon("green");
const blueIcon  = makeIcon("blue");

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Component to fly to user location
function UserLocator({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 13, { duration: 1.2 });
  }, [pos, map]);
  return null;
}

export default function Facilities() {
  const [sites, setSites]       = useState([]);
  const [posts, setPosts]       = useState([]);
  const [userPos, setUserPos]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Default centre: Bengaluru
  const DEFAULT_CENTER = [12.9716, 77.5946];

  useEffect(() => {
    // 1. Fetch official sites from Flask
    fetch(`${API}/api/sites`)
      .then((r) => r.json())
      .then(setSites)
      .catch(() => setError("Could not load disposal sites."))
      .finally(() => setLoading(false));

    // 2. Fetch community posts from Firebase
    const fbUrl = import.meta.env.VITE_FIREBASE_URL;
    if (fbUrl) {
      fetch(`${fbUrl}/community_posts.json`)
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
            setPosts(arr);
          }
        })
        .catch(() => {}); // silent — Firebase optional
    }

    // 3. Get browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {} // denied — stay on default
      );
    }
  }, []);

  const googleMapsUrl = (site) =>
    `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;

  return (
    <div className="map-page">
      {/* Toolbar */}
      <div className="map-toolbar">
        <span className="map-title">
          Disposal &amp; Reuse Map — Bengaluru
          {loading && <span style={{ fontSize: 12, color: "var(--gray-400)", marginLeft: 10 }}>Loading…</span>}
          {error   && <span style={{ fontSize: 12, color: "#c00", marginLeft: 10 }}>{error}</span>}
        </span>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot green" />
            Official centre
          </div>
          <div className="legend-item">
            <div className="legend-dot blue" />
            Community offer
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-container-wrap">
        <MapContainer
          center={userPos || DEFAULT_CENTER}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userPos && <UserLocator pos={userPos} />}

          {/* Green pins — official sites */}
          {sites.map((site) => (
            <Marker key={site.id} position={[site.lat, site.lng]} icon={greenIcon}>
              <Popup>
                <div className="popup-name">{site.name}</div>
                <div className="popup-addr">{site.address}</div>
                <div className="popup-hours">⏱ {site.hours}</div>
                <div style={{ fontSize: 11, marginBottom: 8, color: "#555" }}>
                  Accepts: {site.accepts.join(", ")}
                </div>
                <a
                  href={googleMapsUrl(site)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  Get directions →
                </a>
              </Popup>
            </Marker>
          ))}

          {/* Blue pins — community posts */}
          {posts.map((post) => (
            <Marker
              key={post.id}
              position={[
                // Posts don't have lat/lng — geocode in production. Scatter near centre for now.
                12.9716 + (Math.random() - 0.5) * 0.12,
                77.5946 + (Math.random() - 0.5) * 0.12,
              ]}
              icon={blueIcon}
            >
              <Popup>
                <div className="popup-name">{post.name}</div>
                <div className="popup-addr">{post.location}</div>
                <div className="popup-hours">
                  {post.quantity} {post.unit} of {post.wasteType}
                  {post.note ? ` — ${post.note}` : ""}
                </div>
                <a
                  href={
                    post.contact?.startsWith("+")
                      ? `https://wa.me/${post.contact.replace(/\D/g, "")}`
                      : `mailto:${post.contact}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  Contact →
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}