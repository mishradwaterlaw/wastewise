import { useEffect, useState } from "react";

const ACTION_LABEL = {
  recycle:  "Recycle",
  compost:  "Compost",
  donate:   "Donate",
  dispose:  "Dispose safely",
};

export default function Donations() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fbUrl = import.meta.env.VITE_FIREBASE_URL;
    if (!fbUrl) { setLoading(false); return; }

    fetch(`${fbUrl}/community_posts.json`)
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          const arr = Object.entries(data)
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => b.createdAt - a.createdAt);   // newest first
          setPosts(arr);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const contactHref = (post) =>
    post.contact?.startsWith("+")
      ? `https://wa.me/${post.contact.replace(/\D/g, "")}`
      : `mailto:${post.contact}`;

  return (
    <main className="donations-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Community Board</h1>
          <p className="page-subtitle">
            Waste offers from people and businesses. Contact the poster directly.
          </p>
        </div>

        {loading && (
          <p style={{ color: "var(--gray-600)", fontSize: 14 }}>Loading offers…</p>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ border: "1.5px solid var(--gray-200)", borderRadius: 12, padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No offers yet.</p>
            <p style={{ color: "var(--gray-600)", fontSize: 13 }}>
              Be the first — post waste you can't use and someone nearby might need it.
            </p>
            <a href="/identify" className="btn btn-primary" style={{ display: "inline-flex", marginTop: 20 }}>
              Post an offer →
            </a>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="offers-grid">
            {posts.map((post) => (
              <div key={post.id} className="offer-card">
                <div className="offer-card-tag">{post.wasteType}</div>
                <div className="offer-card-title">
                  {post.quantity} {post.unit} available
                </div>
                <div className="offer-card-meta">
                  {post.name} · {post.location}
                  {post.note && <><br /><span style={{ fontSize: 12 }}>{post.note}</span></>}
                </div>
                <div className="offer-card-footer">
                  <a
                    href={contactHref(post)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Contact →
                  </a>
                  <a href="/facilities" className="btn btn-outline btn-sm">
                    View on map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}