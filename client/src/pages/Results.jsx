import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useWaste } from "../context/WasteContext";
import jsPDF from "jspdf";

const ACTION_LABEL = {
  recycle:  "Recycle",
  compost:  "Compost",
  donate:   "Donate",
  dispose:  "Dispose safely",
};

const BADGE_CLASS = {
  today:     "badge-today",
  this_week: "badge-week",
  flexible:  "badge-flexible",
};

export default function Results() {
  const navigate = useNavigate();
  const { actionData, selectedWaste } = useWaste();
  const printRef = useRef(null);

  // Guard — no data means user landed here directly
  if (!actionData) {
    return (
      <main style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "var(--gray-600)", marginBottom: 20 }}>
            No waste selected yet.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/identify")}>
            ← Pick a waste type
          </button>
        </div>
      </main>
    );
  }

  const { label, icon, action, urgency, urgency_label, co2_stat, steps } = actionData;

  /* ── PDF Export ──────────────────────────────────────────────────── */
  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("WasteWise — Action Plan", 20, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated: ${date}`, 20, 32);
    doc.text(`Category: ${label}   |   Recommended action: ${ACTION_LABEL[action] || action}   |   Urgency: ${urgency_label}`, 20, 40);

    doc.setDrawColor(220);
    doc.line(20, 46, 190, 46);

    doc.setTextColor(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Steps to take:", 20, 56);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let y = 66;
    steps.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 165);
      doc.text(lines, 20, y);
      y += lines.length * 7 + 4;
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text("CO₂ Impact:", 20, y + 6);
    doc.setFont("helvetica", "normal");
    const co2Lines = doc.splitTextToSize(co2_stat, 165);
    doc.text(co2Lines, 20, y + 14);

    doc.setTextColor(150);
    doc.setFontSize(9);
    doc.text("wastewise.app — Bengaluru waste routing network", 20, 285);

    doc.save(`wastewise-${selectedWaste}-plan.pdf`);
  };

  /* ── WhatsApp Share ──────────────────────────────────────────────── */
  const shareWhatsApp = () => {
    const text = `*WasteWise Action Plan — ${label}*\n\nRecommended: ${ACTION_LABEL[action] || action}\nUrgency: ${urgency_label}\n\n*Steps:*\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n_CO₂ fact: ${co2_stat}_\n\nGenerated at wastewise.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <main className="results-page">
      <div className="container">
        {/* Back nav */}
        <div className="results-back" onClick={() => navigate("/identify")}>
          ← Change waste type
        </div>

        <div className="results-layout" ref={printRef}>
          {/* ── Left column: steps ── */}
          <div>
            <div className="action-header">
              <div className="action-icon-wrap">{icon}</div>
              <div className="action-meta">
                <div className="action-category">{ACTION_LABEL[action] || action}</div>
                <div className="action-title">{label}</div>
                <span className={`action-badge ${BADGE_CLASS[urgency] || "badge-flexible"}`}>
                  {urgency_label}
                </span>
              </div>
            </div>

            <p className="steps-title">What to do</p>
            <ol className="steps-list">
              {steps.map((step, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Right column: sidebar ── */}
          <div>
            {/* CO₂ stat */}
            <div className="co2-card">
              <div className="co2-label">CO₂ Impact</div>
              <div className="co2-text">{co2_stat}</div>
            </div>

            {/* Export */}
            <div className="export-card">
              <div className="export-title">Export plan</div>
              <div className="export-btns">
                <button className="btn btn-primary" onClick={downloadPDF}>
                  ↓ Download PDF
                </button>
                <button className="btn btn-outline" onClick={shareWhatsApp}>
                  Share on WhatsApp
                </button>
              </div>
            </div>

            {/* Map CTA */}
            <div className="co2-card" style={{ border: "1.5px solid #0a0a0a" }}>
              <div className="co2-label" style={{ marginBottom: 10 }}>Find a drop-off</div>
              <p style={{ fontSize: 13, color: "var(--gray-600)", marginBottom: 12, lineHeight: 1.5 }}>
                See official centres and community members offering or requesting this waste near you.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/facilities")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Open map →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}