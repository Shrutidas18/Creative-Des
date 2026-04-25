import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', sans-serif";
const C = {
  bg:      "#faf8f5",
  wine:    "#8c1c30",
  text:    "#1a0a0e",
  dim:     "rgba(26,10,14,0.5)",
  dimmer:  "rgba(26,10,14,0.3)",
  faint:   "rgba(26,10,14,0.08)",
};

const IMAGES = Array.from({ length: 11 }, (_, i) => `/Graphic${i + 1}.jpg`);

export default function GraphicDesigns() {
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState(null); // index or null

  // Inject fonts + base styles
  useEffect(() => {
    if (document.getElementById("gd-css")) return;
    const el = document.createElement("style");
    el.id = "gd-css";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #faf8f5; color: #1a0a0e; overflow-x: hidden; }

      .gd-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
      @media (max-width: 900px) {
        .gd-grid { grid-template-columns: repeat(2, 1fr); }
      }
        @media (max-width: 560px) {
    .gd-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .gd-thumb { max-width: 100%; }
  }

      .gd-thumb {
    overflow: hidden;
    border: 1px solid rgba(26,10,14,0.08);
    cursor: pointer;
    position: relative;
    aspect-ratio: 4/3;
    max-width: 320px;
    background: #f0ede8;
    transition: border-color 0.3s, box-shadow 0.3s;
  }s
      .gd-thumb:hover {
        border-color: rgba(140,28,48,0.3);
        box-shadow: 0 12px 40px rgba(140,28,48,0.1);
      }
      .gd-thumb img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
        display: block;
      }
      .gd-thumb:hover img { transform: scale(1.04); }
      .gd-thumb-overlay {
        position: absolute; inset: 0;
        background: rgba(140,28,48,0);
        display: flex; align-items: center; justify-content: center;
        transition: background 0.3s;
      }
      .gd-thumb:hover .gd-thumb-overlay {
        background: rgba(140,28,48,0.08);
      }
      .gd-thumb-overlay span {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
        color: #8c1c30; opacity: 0;
        transition: opacity 0.3s;
        background: rgba(250,248,245,0.92);
        padding: 8px 18px;
      }
      .gd-thumb:hover .gd-thumb-overlay span { opacity: 1; }

      /* Lightbox */
      .gd-lightbox {
        position: fixed; inset: 0; z-index: 9000;
        background: rgba(26,10,14,0.92);
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
        animation: lb-in 0.25s ease;
      }
      @keyframes lb-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .gd-lightbox img {
        max-width: 90vw; max-height: 88vh;
        object-fit: contain;
        border: 1px solid rgba(250,248,245,0.1);
        animation: lb-img-in 0.3s cubic-bezier(0.23,1,0.32,1);
      }
      @keyframes lb-img-in {
        from { transform: scale(0.94); opacity: 0; }
        to   { transform: scale(1);    opacity: 1; }
      }
      .gd-lb-close {
        position: fixed; top: 24px; right: 32px;
        font-family: 'DM Sans', sans-serif; font-size: 11px;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: rgba(250,248,245,0.5); background: none; border: none;
        cursor: pointer; transition: color 0.2s;
      }
      .gd-lb-close:hover { color: #faf8f5; }
      .gd-lb-nav {
        position: fixed; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer;
        font-size: 28px; color: rgba(250,248,245,0.4);
        transition: color 0.2s; padding: 16px;
      }
      .gd-lb-nav:hover { color: #faf8f5; }
      .gd-lb-nav.prev { left: 16px; }
      .gd-lb-nav.next { right: 16px; }
      .gd-lb-counter {
        position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
        font-family: 'DM Sans', sans-serif; font-size: 10px;
        letter-spacing: 0.2em; text-transform: uppercase;
        color: rgba(250,248,245,0.35);
      }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // Close lightbox on Escape, arrow keys to navigate
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(i => (i + 1) % IMAGES.length);
      if (e.key === "ArrowLeft")  setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>

      {/* ── Header ── */}
      <div style={{
        padding: "48px 56px 40px",
        borderBottom: `1px solid ${C.faint}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
      }}>
        <div>
          <button
            onClick={() => navigate("/")}
            style={{
              fontFamily: SANS, fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", background: "none", border: "none",
              color: C.dimmer, cursor: "pointer", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 8,
              transition: "color 0.3s", padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.wine}
            onMouseLeave={e => e.currentTarget.style.color = C.dimmer}
          >
            ← Back to Portfolio
          </button>
          <h1 style={{
            fontFamily: SERIF, fontSize: "clamp(36px, 6vw, 80px)",
            fontWeight: 700, color: C.text, lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}>
            Graphic<br />
            <em style={{ fontStyle: "italic", color: C.wine }}>Designs.</em>
          </h1>
          <p style={{
            fontFamily: SANS, fontSize: 13, color: C.dim,
            marginTop: 20, letterSpacing: "0.04em", lineHeight: 1.7,
          }}>
            {IMAGES.length} pieces — social media graphics, brand campaigns &amp; more.
          </p>
        </div>
        <span style={{
          fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: C.dimmer,
        }}>Click any image to expand</span>
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: "48px 56px 80px" }}>
        <div className="gd-grid">
          {IMAGES.map((src, i) => (
            <div key={i} className="gd-thumb" onClick={() => setLightbox(i)}>
              <img src={src} alt={`Graphic design ${i + 1}`} loading="lazy" />
              <div className="gd-thumb-overlay">
                <span>View ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="gd-lightbox" onClick={() => setLightbox(null)}>
          <img
            src={IMAGES[lightbox]}
            alt={`Graphic design ${lightbox + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button className="gd-lb-close" onClick={() => setLightbox(null)}>Close ✕</button>
          <button className="gd-lb-nav prev" onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length); }}>‹</button>
          <button className="gd-lb-nav next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % IMAGES.length); }}>›</button>
          <div className="gd-lb-counter">{lightbox + 1} / {IMAGES.length}</div>
        </div>
      )}
    </div>
  );
}