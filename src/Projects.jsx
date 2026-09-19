import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { C, SERIF, SANS, MINI_PROJECTS, MAIN_PROJECTS, DESIGN_WORK } from "./constants";
import { SectionHeader } from "./About";

// ── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, idx, setHov }) {
  const isInternal = proj.url && proj.url.startsWith("/") && !proj.url.startsWith("//");
  const isWip = !proj.url || proj.url === "#";
  const Tag   = isWip ? "div" : "a";
  const extra = isWip ? {} : isInternal
    ? { href: proj.url }
    : { href: proj.url, target: "_blank", rel: "noreferrer" };
  return (
    <Tag {...extra}
      className="proj-card gsap-proj-card"
      style={{ opacity: 0, transform: "translateY(30px)", textDecoration: "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span style={{ fontFamily: SANS, fontSize: 10, color: C.dimmer, letterSpacing: "0.1em" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        {isWip && (
          <span style={{
            fontFamily: SANS, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
            background: "rgba(140,28,48,0.07)", color: C.wine,
            padding: "3px 10px", borderRadius: 2,
          }}>In Progress</span>
        )}
      </div>

      <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 10, lineHeight: 1.2 }}>{proj.title}</h3>
      <p style={{ fontFamily: SANS, fontSize: 13, color: C.dim, lineHeight: 1.75, marginBottom: 20 }}>{proj.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {proj.tags.map((t) => (
          <span key={t} style={{
            fontFamily: SANS, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
            border: "1px solid rgba(140,28,48,0.2)", padding: "3px 9px", color: C.wine,
          }}>{t}</span>
        ))}
      </div>
      <span style={{
        fontFamily: SANS, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
        color: isWip ? C.dimmer : C.dimmer,
        borderBottom: `1px solid ${C.faint}`, paddingBottom: 2,
        opacity: isWip ? 0.45 : 1,
      }}>
        {isWip ? "Coming Soon" : <>View Project <span className="proj-card-arrow">↗</span></>}
      </span>
    </Tag>
  );
}

export function Projects({ setHov }) {
  const [tab, setTab] = useState("main");
  const gridRef = useRef(null);
  const panels = { mini: MINI_PROJECTS, main: MAIN_PROJECTS, design: DESIGN_WORK };
  const tabs = [
    { key: "mini",   label: "Mini Projects" },
    { key: "main",   label: "Main Projects" },
    { key: "design", label: "UI/UX & Design" },
  ];

  // Re-run stagger whenever tab changes.
  // requestAnimationFrame ensures every card in the new tab has actually
  // painted to the DOM before GSAP queries + animates it — without this,
  // cards rendered later in the list (e.g. "Second Brain", "Resume Analyzer")
  // can be missed by querySelectorAll and stay stuck at opacity: 0.
  useEffect(() => {
    if (!gridRef.current) return;
    const raf = requestAnimationFrame(() => {
      const cards = gridRef.current.querySelectorAll(".gsap-proj-card");
      gsap.set(cards, { opacity: 0, y: 30 });
      gsap.to(cards, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out" });
    });
    return () => cancelAnimationFrame(raf);
  }, [tab]);

  return (
    <section id="projects" className="section-pad" style={{ padding: "120px 56px", borderBottom: `1px solid ${C.faint}` }}>
      <SectionHeader label="Projects" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 52 }}>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5.5vw,72px)", fontWeight: 600, color: C.text, letterSpacing: "-0.02em" }}>
          Selected <em style={{ fontStyle: "italic", color: C.wine }}>Projects</em>
        </h2>
        <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dimmer }}>
          {MINI_PROJECTS.length + MAIN_PROJECTS.length + DESIGN_WORK.length} Total
        </span>
      </div>

      <div style={{ borderBottom: `1px solid ${C.faint}`, marginBottom: 40 }}>
        {tabs.map(({ key, label }) => (
          <button key={key}
            className={`proj-tab${tab === key ? " active" : ""}`}
            onClick={() => setTab(key)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {label}
          </button>
        ))}
      </div>

      <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {panels[tab].map((proj, i) => (
          <ProjectCard key={proj.id} proj={proj} idx={i} setHov={setHov} />
        ))}
      </div>

      <div style={{ marginTop: 52, paddingTop: 28, borderTop: `1px solid ${C.faint}` }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: C.dimmer, fontStyle: "italic" }}>
          More projects and designs — coming soon.
        </p>
      </div>
    </section>
  );
}