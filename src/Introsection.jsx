import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { C, SERIF, SANS, TICKER_ITEMS, NAV_LINKS, TRAIL_IMAGES } from "./constants";
import { useHeroReveal } from "./hooks";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
export function Cursor({ pos, hov }) {
  return (
    <>
      <div className={`cur-dot${hov ? " hov" : ""}`} style={{ left: pos.x, top: pos.y }} />
      <div className={`cur-ring${hov ? " hov" : ""}`} style={{ left: pos.x, top: pos.y }} />
    </>
  );
}

// ── NAV with hamburger ───────────────────────────────────────────────────────
export function Nav({ setHov }) {
  const navRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Nav slides down on load
    gsap.fromTo(navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNavClick = () => setOpen(false);

  return (
    <>
      <nav ref={navRef} className="nav-pad" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "22px 56px",
        background: "rgba(250,248,245,0.92)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${C.faint}`,
      }}>
        <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.wine, letterSpacing: "0.04em" }}>SD</span>

        {/* Desktop links — hidden on mobile via CSS */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 36 }}>
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link"
              onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{l}</a>
          ))}
        </div>

        {/* Hamburger — hidden on desktop via CSS, shown on mobile */}
        <button
          className={`hamburger-btn${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

     {/* Full-screen mobile overlay menu */}
<div className={`mobile-menu${open ? " open" : ""}`}>
  <button
    onClick={() => setOpen(false)}
    style={{
      position: "absolute", top: 28, right: 24,
      fontFamily: SANS, fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase", background: "none", border: "none",
      color: "rgba(26,10,14,0.35)", cursor: "pointer",
      transition: "color 0.3s",
    }}
    onMouseEnter={e => e.currentTarget.style.color = "#8c1c30"}
    onMouseLeave={e => e.currentTarget.style.color = "rgba(26,10,14,0.35)"}
  >
    Close ✕
  </button>
  {NAV_LINKS.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="mobile-nav-link"
            onClick={handleNavClick}
          >
            {l}
          </a>
        ))}
      </div>
    </>
  );
}

function HeroWord({ children, delay = 0 }) {
  return (
    <span className="hero-word">
      <span className="hero-word-inner" style={{ transitionDelay: `${delay}ms` }}>{children}</span>
    </span>
  );
}

// ── HERO ────────────────────────────────────────────────────────────────────
export function Hero({ setHov }) {
  useHeroReveal();
  const heroRef      = useRef(null);
  const watermarkRef = useRef(null);
  const lastSpawn    = useRef(0);
  const imgIndex     = useRef(0);

  useEffect(() => {
    // Watermark parallax
    gsap.to(watermarkRef.current, {
      scale: 1.18, y: -60,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top", end: "bottom top", scrub: 1.2,
      },
    });

    // Hero content fades as you scroll away
    gsap.to(heroRef.current.querySelector(".hero-content"), {
      yPercent: 12, opacity: 0.3,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "40% top", end: "bottom top", scrub: true,
      },
    });

    // ── Cursor image trail ─────────────────────────────────────────────────
    const section = heroRef.current;

    const spawnImage = (x, y) => {
      const now = Date.now();
      if (now - lastSpawn.current < 320) return;
      lastSpawn.current = now;

      const src = TRAIL_IMAGES[imgIndex.current % TRAIL_IMAGES.length];
      imgIndex.current++;

      const img = document.createElement("img");
      img.src = src;

      // ── Smaller images on mobile ──────────────────────────────────────
      const isMobile = window.innerWidth < 680;
      const w = isMobile ? 110 : 180;
      const h = isMobile ? 145 : 240;

      const rot = (Math.random() - 0.5) * 20;
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;

      Object.assign(img.style, {
        position:      "absolute",
        left:          (x + offsetX - w / 2) + "px",
        top:           (y + offsetY - h / 2) + "px",
        width:         w + "px",
        height:        h + "px",
        objectFit:     "cover",
        borderRadius:  "4px",
        pointerEvents: "none",
        zIndex:        10,
        transform:     "rotate(" + rot + "deg) scale(0.3) translateY(40px)",
        opacity:       "0",
        transition:    "transform 0.5s cubic-bezier(0.34,1.5,0.64,1), opacity 0.3s ease",
        willChange:    "transform, opacity",
      });

      section.appendChild(img);

      // Spring pop-in — starts small from below, bounces to full size
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.style.opacity   = "0.95";
          img.style.transform = "rotate(" + rot + "deg) scale(1) translateY(0px)";
        });
      });

      // Gentle float-up and fade out after 2s
      setTimeout(() => {
        img.style.transition = "transform 0.5s ease, opacity 0.5s ease";
        img.style.opacity    = "0";
        img.style.transform  = "rotate(" + (rot + 4) + "deg) scale(0.9) translateY(-14px)";
        setTimeout(() => img.remove(), 520);
      }, 2000);
    };

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      // Only spawn when cursor is inside hero section
      if (
        e.clientY < rect.top || e.clientY > rect.bottom ||
        e.clientX < rect.left || e.clientX > rect.right
      ) return;
      spawnImage(e.clientX - rect.left, e.clientY - rect.top);
    };

    // Don't attach on touch devices — no mousemove exists there
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) {
      window.addEventListener("mousemove", onMove);
    }
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-pad" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "flex-end",
      // ── Top padding accounts for fixed navbar (66px) + breathing room ──
      padding: "88px 56px 80px",
      position: "relative",
      borderBottom: `1px solid ${C.faint}`, overflow: "hidden",
    }}>
      <span ref={watermarkRef} style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: SERIF, fontSize: "clamp(90px,16vw,220px)", fontWeight: 700,
        color: "rgba(140,28,48,0.04)", whiteSpace: "nowrap",
        pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em",
        willChange: "transform",
      }}>PORTFOLIO</span>

      <div className="hero-content" style={{ position: "relative", zIndex: 20 }}>
        <p style={{
          fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em",
          textTransform: "uppercase", color: C.dimmer, marginBottom: 28,
        }}>
          Frontend Developer · CS Student · ITER, 2022–2026
        </p>

        <h1 style={{
          fontFamily: SERIF, fontWeight: 700,
          fontSize: "clamp(64px,11vw,158px)", lineHeight: 0.88,
          color: C.text, letterSpacing: "-0.03em",
        }}>
          <HeroWord delay={0}>Shruti</HeroWord>
          <br />
          <HeroWord delay={140}><em style={{ fontStyle: "italic", color: C.wine }}>Das.</em></HeroWord>
        </h1>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          flexWrap: "wrap", gap: 28, marginTop: 44,
        }}>
          <p style={{
            fontFamily: SERIF, fontSize: "clamp(17px,2vw,23px)",
            fontWeight: 300, color: C.dim, maxWidth: 500, lineHeight: 1.68,
          }}>
            A Computer Science graduate passionate about building thoughtful, user-focused interfaces where creativity meets code.
          </p>
          <a href="/Shruti_DasSDE.pdf" download className="btn-primary"
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            Download Resume ↓
          </a>
        </div>
      </div>
    </section>
  );
}

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      overflow: "hidden", borderBottom: `1px solid ${C.faint}`,
      padding: "14px 0", background: C.tint,
    }}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="ticker-item" style={{
            fontFamily: SANS, fontSize: 9, fontWeight: 600,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.dimmer, marginRight: 44,
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── BIG MARQUEE (Ashley-style oversized scrolling text) ─────────────────────
export function BigMarquee() {
  const words = ["Frontend Dev", "·", "UI/UX", "·", "React", "·", "Python", "·"];
  const doubled = [...words, ...words];
  return (
    <div style={{
      overflow: "hidden",
      borderBottom: `1px solid ${C.faint}`,
      padding: "24px 0",
      background: C.bg,
    }}>
      <div className="marquee-track-l">
        {doubled.map((w, i) => (
          <span key={i} style={{
            fontFamily: SERIF, fontStyle: "italic",
            fontSize: "clamp(48px,8vw,96px)", fontWeight: 700,
            color: "rgba(26,10,14,0.06)", marginRight: "0.5em",
            letterSpacing: "-0.03em", whiteSpace: "nowrap",
          }}>{w}</span>
        ))}
      </div>
    </div>
  );
}