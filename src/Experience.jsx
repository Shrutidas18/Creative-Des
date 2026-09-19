import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { C, SERIF, SANS, EXPERIENCE_DATA, SLOT_WORDS } from "./constants";
import { SectionHeader } from "./About";

// ── EXPERIENCE SECTION (Optimized Spacing) ──────────────────────────────────
export function Experience({ setHov }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if(!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".exp-card");
    gsap.fromTo(cards,
      { y: 30, opacity: 0 }, // Reduced initial Y offset for snappier feel
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%", // Slightly later trigger
        }
      }
    );
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section-pad" style={{ 
      // REDUCED PADDING: Was 120px, now 80px top/bottom
      padding: "80px 56px", 
      borderBottom: `1px solid ${C.faint}`, 
      background: C.tint 
    }}>
      <SectionHeader label="Work History" />
      
      {/* REDUCED MARGIN: Was 72px, now 32px */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(28px,5vw,64px)", // Slightly smaller font
          fontWeight: 600, color: C.text, lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>
          My Professional<br /><em style={{ fontStyle: "italic", color: C.wine }}>Journey</em>
        </h2>
      </div>

      {/* REDUCED GAP: Was 24px, now 16px between cards */}
     <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {EXPERIENCE_DATA.map((exp, i) => (
          <div key={i} style={{ display: "flex", gap: 20, alignItems: "stretch" }}>

            {/* ── Timeline spine ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
              {/* Dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: C.wine, flexShrink: 0, marginTop: 28,
                boxShadow: `0 0 0 3px rgba(140,28,48,0.15)`,
              }} />
              {/* Line — hidden on last item */}
              {i < EXPERIENCE_DATA.length - 1 && (
                <div style={{
                  width: 1, flex: 1, marginTop: 6,
                  background: `linear-gradient(to bottom, rgba(140,28,48,0.3), rgba(140,28,48,0.05))`,
                }} />
              )}
            </div>

          <div 
            className="exp-card" 
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ 
              opacity: 0,
              flex: 1,
              marginBottom: 16,
              background: C.surface, 
              border: `1px solid ${C.faint}`, 
              padding: "24px",
              transition: "border-color 0.3s, transform 0.3s",
              transformOrigin: "left center"
            }}
          >
            <div className="exp-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.text }}>{exp.company}</h3>
              <span style={{ fontFamily: SANS, fontSize: 10, color: C.dimmer, textTransform: "uppercase", letterSpacing: "0.1em" }}>{exp.date}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.wine }}>{exp.role}</p>
              <span style={{ fontFamily: SANS, fontSize: 11, color: C.dimmer }}>{exp.location}</span>
            </div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {exp.highlights.map((point, idx) => (
                <li key={idx} style={{ fontFamily: SANS, fontSize: 13, color: C.dim, lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: C.wine, marginTop: 4 }}>•</span> {point}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.faint}` }}>
               <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                 {exp.tech.map(t => (
                   <span key={t} className="pill" style={{ fontSize: 8, padding: "4px 10px" }}>{t}</span>
                 ))}
               </div>
          </div>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── SLOT MACHINE (Ashley "NUMBERS / VENDORS / BUSINESS PLANS" style) ─────────
export function SlotMachine() {
  const slotRef    = useRef(null);
  const clipRef    = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el   = slotRef.current;
    const clip = clipRef.current;
    if (!el || !clip) return;

    const init = () => {
      const wordH = el.children[0].getBoundingClientRect().height;
      clip.style.height = `${wordH}px`;
      const total = SLOT_WORDS.length;
      gsap.to(el, {
        y: -(wordH * (total - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: `+=${wordH * (total - 1) * 1.6}`,
          scrub: 1.5,
        },
      });
    };

    // Wait for Google Fonts before measuring — prevents fallback-font sizing bug
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      setTimeout(init, 600);
    }
  }, []);

  return (
    <div ref={sectionRef} className="slot-pad" style={{
      padding: "120px 56px 160px",
      borderBottom: `1px solid ${C.faint}`,
    }}>
      <p style={{
        fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em",
        textTransform: "uppercase", color: C.dimmer, marginBottom: 28,
      }}>I am a</p>
      <div ref={clipRef} style={{ overflow: "hidden" }}>
        <div ref={slotRef} style={{ display: "flex", flexDirection: "column" }}>
          {SLOT_WORDS.map((w) => (
            <span key={w} style={{
              fontFamily: SERIF, fontStyle: "italic",
              fontSize: "clamp(80px,14vw,190px)", fontWeight: 700,
              color: C.wine, lineHeight: 1.12, display: "block",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
            }}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}