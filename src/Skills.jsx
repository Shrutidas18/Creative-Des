import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C, SERIF, SANS, SKILLS } from "./constants";
import { SectionHeader } from "./About";

// ── SKILL CARD (defined outside Skills so it never re-mounts) ────────────────
const SKILL_ACCENT = [
  "rgba(140,28,48,1)",
  "rgba(140,28,48,0.55)",
  "rgba(140,28,48,0.28)",
  "rgba(26,10,14,0.18)",
  "rgba(26,10,14,0.1)",
  "rgba(140,28,48,0.72)",
];

function SkillCard({ cat, items, index, setHov }) {
  return (
    <div className="skill-cat-card" style={{
      background: C.surface,
      border: `1px solid ${C.faint}`,
      padding: "32px 28px 28px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.3s, transform 0.3s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(140,28,48,0.3)";
        e.currentTarget.style.transform   = "translateY(-3px)";
        setHov(true);
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.faint;
        e.currentTarget.style.transform   = "translateY(0)";
        setHov(false);
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "2px",
        background: `linear-gradient(90deg, ${SKILL_ACCENT[index] || SKILL_ACCENT[0]} 0%, transparent 100%)`,
      }} />

      {/* Index */}
      <span style={{
        fontFamily: SANS, fontSize: 10, letterSpacing: "0.1em",
        color: "rgba(140,28,48,0.3)", display: "block", marginBottom: 14,
      }}>{String(index + 1).padStart(2, "0")}</span>

      {/* Category name */}
      <p style={{
        fontFamily: SERIF, fontSize: 18, fontWeight: 600,
        color: C.text, marginBottom: 18, letterSpacing: "-0.01em",
      }}>{cat}</p>

      {/* Divider */}
      <div style={{ height: "1px", background: C.faint, marginBottom: 18 }} />

      {/* Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {items.map((s) => (
          <span key={s} className="pill">{s}</span>
        ))}
      </div>
    </div>
  );
}

// ── SKILLS ───────────────────────────────────────────────────────────────────
export function Skills({ setHov }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Use once:true so it always fires even if already scrolled past
    const triggerOpts = { trigger: section, start: "top 85%", once: true };

    gsap.fromTo(section.querySelector(".skills-heading"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: triggerOpts }
    );

    gsap.fromTo(section.querySelectorAll(".skill-cat-card"),
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: "power3.out",
        scrollTrigger: { ...triggerOpts, start: "top 82%" } }
    );

    gsap.fromTo(section.querySelectorAll(".pill"),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.018, duration: 0.3, ease: "back.out(1.5)",
        scrollTrigger: { ...triggerOpts, start: "top 75%" } }
    );

    // Refresh ScrollTrigger after a tick so positions are calculated correctly
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, []);

  const topRow    = SKILLS.slice(0, 3);
  const bottomRow = SKILLS.slice(3);

  return (
    <section id="skills" ref={sectionRef} className="section-pad"
      style={{ padding: "120px 56px", borderBottom: `1px solid ${C.faint}`, background: C.tint }}>
      <SectionHeader label="My Skills" />

      <div style={{ marginBottom: 72 }}>
        <h2 className="skills-heading" style={{
          fontFamily: SERIF, fontSize: "clamp(32px,5.5vw,72px)",
          fontWeight: 600, color: C.text, lineHeight: 1.0, letterSpacing: "-0.02em",
        }}>
          Technologies &amp;<br />
          <em style={{ fontStyle: "italic", color: C.wine }}>Tools I Work With</em>
        </h2>
      </div>

      {/* ── Responsive skill grids via CSS classes (collapse to 1col on mobile) ── */}
      <div className="skills-top-grid">
        {topRow.map((s, i) => <SkillCard key={s.cat} cat={s.cat} items={s.items} index={i} setHov={setHov} />)}
      </div>
      <div className="skills-bottom-grid">
        {bottomRow.map((s, i) => <SkillCard key={s.cat} cat={s.cat} items={s.items} index={i + 3} setHov={setHov} />)}
      </div>

      <p style={{
        fontFamily: SERIF, fontSize: 16, fontStyle: "italic",
        color: C.dimmer, marginTop: 52,
      }}>
        Always learning — always adding to this list.
      </p>
    </section>
  );
}