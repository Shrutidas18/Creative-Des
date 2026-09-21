import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { C, SERIF, SANS } from "./Constants";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export function SectionHeader({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
      <p style={{
        fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em",
        textTransform: "uppercase", color: C.dimmer, whiteSpace: "nowrap",
      }}>{label}</p>
      <div className="section-rule" style={{ flex: 1 }} />
    </div>
  );
}

// ── ABOUT with pinned heading + scroll-reveal bio ───────────────────────────
export function About() {
  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const bioWordsRef  = useRef(null);

  useEffect(() => {
    // 1. Heading fades + slides in from left
    gsap.fromTo(headingRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      }
    );

    // 2. Bio paragraphs stagger in
    const paras = sectionRef.current.querySelectorAll(".bio-para");
    gsap.fromTo(paras,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.18, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: paras[0],
          start: "top 82%",
        },
      }
    );

    // 3. Meta rows stagger in from left
    const rows = sectionRef.current.querySelectorAll(".meta-row");
    gsap.fromTo(rows,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: rows[0],
          start: "top 85%",
        },
      }
    );

    // 4. Word-by-word scrub on the big quote
    if (bioWordsRef.current) {
      const words = bioWordsRef.current.querySelectorAll(".scrub-word");
      gsap.to(words, {
        color: "#1a0a0e",
        stagger: 0.04,
        scrollTrigger: {
          trigger: bioWordsRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 0.8,
        },
      });
    }
  }, []);

  const bigQuote = "I'm a Computer Science graduate passionate about building engaging, intuitive, and impactful web experiences.";
  return (
    <section id="about" ref={sectionRef} className="section-pad" style={{ padding: "120px 56px", borderBottom: `1px solid ${C.faint}` }}>
      <SectionHeader label="About Me" />

      <h2 ref={headingRef} style={{
        fontFamily: SERIF, fontSize: "clamp(32px,5.5vw,72px)",
        fontWeight: 600, color: C.text, lineHeight: 1.0, letterSpacing: "-0.02em",
        opacity: 0, // GSAP will reveal
      }}>
        I Refuse<br />
        <em style={{ fontStyle: "italic", color: C.wine }}>To Stay In</em>
        <br />A Single Lane.
      </h2>

      {/* Scrub quote */}
      <p ref={bioWordsRef} style={{
        fontFamily: SERIF, fontSize: "clamp(22px,3vw,38px)",
        fontWeight: 300, lineHeight: 1.5, letterSpacing: "-0.01em",
        maxWidth: 780, marginTop: 64, marginBottom: 72,
      }}>
        {bigQuote.split(" ").map((word, i) => (
          <span key={i} className="scrub-word" style={{ marginRight: "0.28em" }}>{word}</span>
        ))}
      </p>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 80, alignItems: "start" }}>
        {/* Meta rows */}
        <div>
          {[
            { label: "Education", val: "B.Tech CS · ITER · 2022–2026" },
            { label: "Interests",  val: "UI/UX · Web Dev · AI · Data Science" },
            { label: "Status",     val: "Open to Freelancing & collabs" },
            { label: "GitHub",
              val: <a href="https://github.com/Shrutidas18" target="_blank" rel="noreferrer"
                      style={{ color: C.wine, textDecoration: "none" }}>Shrutidas18</a> },
            { label: "LinkedIn",
              val: <a href="https://www.linkedin.com/in/shruti-das-8b8191247/" target="_blank" rel="noreferrer"
                      style={{ color: C.wine, textDecoration: "none" }}>shruti-das</a> },
          ].map(({ label, val }) => (
            <div key={label} className="meta-row" style={{
              opacity: 0, // GSAP reveals
              display: "grid", gridTemplateColumns: "90px 1fr", gap: 16,
              alignItems: "baseline",
              padding: "18px 0", borderBottom: `1px solid ${C.faint}`,
            }}>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dimmer }}>{label}</span>
              <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 300, color: C.dim }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="about-bio">
          <p className="bio-para" style={{ opacity: 0, fontFamily: SANS, fontSize: 14, color: C.dim, lineHeight: 1.9, marginBottom: 20 }}>
            I’m a Computer Science graduate passionate about web development, UI/UX, and building digital experiences that are both functional and intuitive. I enjoy blending creativity with technology to turn ideas into thoughtful, user-focused solutions.
          </p>
          <p className="bio-para" style={{ opacity: 0, fontFamily: SANS, fontSize: 14, color: C.dim, lineHeight: 1.9 }}>
            From crafting responsive interfaces to working with APIs and backend services, I’m always curious to understand how things work and find better ways to build them. I’m continuously exploring new technologies, contributing to projects, and strengthening my skills to grow as a well-rounded software developer.
          </p>
        </div>
      </div>
    </section>
  );
}