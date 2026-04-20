import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useWaste } from "../context/WasteContext";

// Animated count-up hook
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

const STATS = [
  { value: 1240, suffix: "", label: "Items routed today" },
  { value: 38,   suffix: " kg", label: "CO₂ saved this week" },
  { value: 94,   suffix: "",  label: "Community offers active" },
];

function StatItem({ value, suffix, label }) {
  const count = useCountUp(value);
  return (
    <div className="impact-stat">
      <div className="impact-stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="impact-stat-label">{label}</div>
    </div>
  );
}

const HOW_STEPS = [
  {
    num: "01",
    title: "Select your waste",
    desc: "Choose from 8 categories or post waste you're offering to others.",
  },
  {
    num: "02",
    title: "Get a clear action plan",
    desc: "Numbered steps, CO₂ impact, and urgency level — specific, not generic.",
  },
  {
    num: "03",
    title: "Act locally",
    desc: "Map shows official drop-offs and neighbours with reuse offers nearby.",
  },
];

export default function Landing() {
  const { setPath } = useWaste();

  return (
    <>
      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-eyebrow">
            <span className="pulse" />
            Live — Bengaluru network
          </div>

          <h1 className="hero-headline">
            Turn any waste into a clear decision.
          </h1>

          <p className="hero-sub">
            WasteWise tells you exactly what to do with your waste, where to
            take it, and who nearby can use it. No generic search results.
          </p>

          <div className="hero-cta-group">
            <Link
              to="/identify"
              className="btn btn-primary"
              onClick={() => setPath("A")}
            >
              I have waste to handle →
            </Link>
            <Link
              to="/identify"
              className="btn btn-outline"
              onClick={() => setPath("B")}
            >
              I have waste to offer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Impact Counter ── */}
      <section className="impact-bar">
        <div className="container">
          <div className="impact-grid">
            {STATS.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="container">
          <p className="section-label">How it works</p>
          <div className="how-steps">
            {HOW_STEPS.map((s) => (
              <div key={s.num}>
                <div className="how-step-num">{s.num}</div>
                <div className="how-step-title">{s.title}</div>
                <div className="how-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <span>WasteWise © 2026 — Bengaluru</span>
          <span>
            <Link to="/facilities" style={{ marginRight: 16 }}>Map</Link>
            <Link to="/donations">Community Board</Link>
          </span>
        </div>
      </footer>
    </>
  );
}