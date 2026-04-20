import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWaste } from "../context/WasteContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORIES = [
  { id: "plastic",   label: "Plastic",    icon: "🧴" },
  { id: "food",      label: "Food Waste", icon: "🍌" },
  { id: "ewaste",    label: "E-Waste",    icon: "💻" },
  { id: "paper",     label: "Paper",      icon: "📄" },
  { id: "metal",     label: "Metal",      icon: "🔩" },
  { id: "hazardous", label: "Hazardous",  icon: "☢️" },
  { id: "textile",   label: "Textiles",   icon: "👕" },
  { id: "other",     label: "Other",      icon: "🗑️" },
];

const WASTE_TYPES = CATEGORIES.map((c) => ({ value: c.id, label: c.label }));

/* ─────────────────────────────── PATH A ─────────────────────── */
function PathA({ onSelect, loading }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (id) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        Select the type of waste you need to handle.
      </p>
      <div className="waste-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`waste-card ${selected === cat.id ? "selected" : ""}`}
            onClick={() => handleClick(cat.id)}
            disabled={loading}
          >
            <span className="waste-icon">{cat.icon}</span>
            <span className="waste-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────── PATH B ─────────────────────── */
function PathB() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    wasteType: WASTE_TYPES[0].value,
    quantity: "",
    unit: "kg",
    location: "",
    contact: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Store in Firebase Realtime DB (direct client write)
    try {
      const fbUrl = import.meta.env.VITE_FIREBASE_URL;
      if (fbUrl) {
        await fetch(`${fbUrl}/community_posts.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, createdAt: Date.now() }),
        });
      }
    } catch (err) {
      console.warn("Firebase write failed — running without DB", err);
    }

    setSubmitting(false);
    setDone(true);
    setTimeout(() => navigate("/donations"), 1800);
  };

  if (done) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
        <p style={{ fontWeight: 600, fontSize: 16 }}>Offer posted to the community board.</p>
        <p style={{ color: "var(--gray-600)", fontSize: 14, marginTop: 6 }}>
          Redirecting…
        </p>
      </div>
    );
  }

  return (
    <form className="offer-form" onSubmit={handleSubmit}>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        Post waste you can't use — a farm, NGO, or neighbour may need it.
      </p>

      <div className="form-row">
        <label className="form-label">Your name or organisation</label>
        <input className="form-input" placeholder="e.g. Blue Tokai Café" value={form.name} onChange={set("name")} required />
      </div>

      <div className="form-row form-row-inline">
        <div>
          <label className="form-label">Waste type</label>
          <select className="form-select" value={form.wasteType} onChange={set("wasteType")}>
            {WASTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Quantity</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input className="form-input" type="number" min="0.1" step="0.1" placeholder="5" value={form.quantity} onChange={set("quantity")} required style={{ flex: 1 }} />
            <select className="form-select" value={form.unit} onChange={set("unit")} style={{ width: 72 }}>
              <option>kg</option>
              <option>L</option>
              <option>pcs</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label className="form-label">Location / area</label>
        <input className="form-input" placeholder="e.g. Indiranagar, Bengaluru" value={form.location} onChange={set("location")} required />
      </div>

      <div className="form-row">
        <label className="form-label">Contact (WhatsApp / email)</label>
        <input className="form-input" placeholder="+91 98765 00000 or email@example.com" value={form.contact} onChange={set("contact")} required />
      </div>

      <div className="form-row">
        <label className="form-label">Note (optional)</label>
        <textarea className="form-textarea" placeholder="Available Tue–Thu mornings, pickup preferred…" value={form.note} onChange={set("note")} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Posting…" : "Post to community board →"}
      </button>
    </form>
  );
}

/* ─────────────────────────────── Main ───────────────────────── */
export default function Identify() {
  const { path, setPath, setSelectedWaste, setActionData } = useWaste();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = async (wasteId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/action/${wasteId}`);
      if (!res.ok) throw new Error("Failed to fetch action plan");
      const data = await res.json();
      setSelectedWaste(wasteId);
      setActionData(data);
      navigate("/results");
    } catch (err) {
      setError("Could not load action plan. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="selector-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Route your waste</h1>
        </div>

        {/* Path tabs */}
        <div className="path-tabs">
          <button className={`path-tab ${path === "A" ? "active" : ""}`} onClick={() => setPath("A")}>
            Handle waste
          </button>
          <button className={`path-tab ${path === "B" ? "active" : ""}`} onClick={() => setPath("B")}>
            Offer waste
          </button>
        </div>

        {error && (
          <p style={{ color: "#c00", fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        {loading ? (
          <p style={{ color: "var(--gray-600)", fontSize: 14 }}>Loading action plan…</p>
        ) : path === "A" ? (
          <PathA onSelect={handleSelect} loading={loading} />
        ) : (
          <PathB />
        )}
      </div>
    </main>
  );
}