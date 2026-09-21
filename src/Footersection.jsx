import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { C, SERIF, SANS, CERTS } from "./Constants";
import { SectionHeader } from "./About";

// ── CERTIFICATIONS ───────────────────────────────────────────────────────────
export function Certifications({ setHov }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".cert-card");
    gsap.fromTo(cards,
      { y: 36, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  return (
    <section id="certifications" ref={sectionRef} className="section-pad"
      style={{ padding: "120px 56px", borderBottom: `1px solid ${C.faint}`, background: C.tint }}>
      <SectionHeader label="Certifications" />
      <div style={{ marginBottom: 64 }}>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(32px,5.5vw,72px)",
          fontWeight: 600, color: C.text, lineHeight: 1.0, letterSpacing: "-0.02em",
        }}>
          What I've<br /><em style={{ fontStyle: "italic", color: C.wine }}>Earned So Far</em>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {CERTS.map((cert, i) => (
          <div key={cert.title} className="cert-card"
            style={{ opacity: 0 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}>
            <span style={{ fontFamily: SANS, fontSize: 10, color: C.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: 24 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, lineHeight: 1.25 }}>{cert.title}</h3>
            <p style={{ fontFamily: SANS, fontSize: 12, color: C.dimmer, marginBottom: 28, letterSpacing: "0.04em" }}>{cert.issuer} · {cert.year}</p>
            <a href={cert.url} target="_blank" rel="noreferrer" className="sweep-link">
              View Certificate →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact({ setHov }) {
  const headingRef = useRef(null);
  const socials = [
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/shruti-das-8b8191247/" },
    { label: "GitHub",    href: "https://github.com/Shrutidas18" },
    { label: "Twitter",   href: "https://x.com/ShrutiDas157646" },
    { label: "Instagram", href: "https://www.instagram.com/shruti_das_19/" },
  ];

  useEffect(() => {
    // Big heading splits + flies in
    gsap.fromTo(headingRef.current,
      { yPercent: 30, opacity: 0 },
      {
        yPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section id="contact" className="contact-pad" style={{ padding: "140px 56px 100px" }}>
      <SectionHeader label="Get In Touch" />
      <div style={{ maxWidth: 900 }}>
        <h2 ref={headingRef} style={{
          opacity: 0, // GSAP reveals
          fontFamily: SERIF, fontWeight: 700,
          fontSize: "clamp(46px,9vw,118px)", lineHeight: 0.9,
          letterSpacing: "-0.03em", color: C.text, marginBottom: 32,
        }}>
          Let's build<br /><em style={{ fontStyle: "italic", color: C.wine }}>something great.</em>
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.dim, marginBottom: 56, letterSpacing: "0.04em", lineHeight: 1.7 }}>
          Open to Freelancing, collaborations, and interesting conversations. Reach out and let's make something worth building.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <a href="mailto:shrutidas574@gmail.com" className="btn-primary"
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            shrutidas574@gmail.com
          </a>
          {socials.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="btn-outline"
              onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer-pad" style={{
      padding: "28px 56px", background: C.tint,
      borderTop: `1px solid ${C.faint}`,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <p style={{ fontFamily: SANS, fontSize: 11, color: C.dimmer, letterSpacing: "0.08em" }}>© Shruti Das 2025 · All rights reserved</p>
      <p style={{ fontFamily: SERIF, fontSize: 14, fontStyle: "italic", color: C.dimmer }}>Crafted with curiosity &amp; code</p>
    </footer>
  );
}