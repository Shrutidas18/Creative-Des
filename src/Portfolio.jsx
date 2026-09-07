import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: auto; } /* Lenis takes over smooth scroll */
  body { background: #faf8f5; overflow-x: hidden; cursor: none; color: #1a0a0e; }
  ::selection { background: #8c1c30; color: #faf8f5; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #faf8f5; }
  ::-webkit-scrollbar-thumb { background: #c0374f; }

  /* ── Cursor ── */
  .cur-dot {
    width: 7px; height: 7px; background: #8c1c30; border-radius: 50%;
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%); transition: transform 0.15s;
  }
  .cur-ring {
    width: 34px; height: 34px;
    border: 1.5px solid rgba(140,28,48,0.28); border-radius: 50%;
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.35s cubic-bezier(0.23,1,0.32,1),
                height 0.35s cubic-bezier(0.23,1,0.32,1),
                border-color 0.35s,
                left 0.08s linear, top 0.08s linear;
  }
  .cur-ring.hov { width: 80px; height: 80px; border-color: rgba(140,28,48,0.1); }
  .cur-dot.hov { transform: translate(-50%,-50%) scale(1.8); }

  /* ── Ticker ── */
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ticker-track { display: flex; white-space: nowrap; animation: ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
  .ticker-item { transition: color 0.3s; }
  .ticker-track:hover .ticker-item { color: rgba(26,10,14,0.2); }
  .ticker-track:hover .ticker-item:hover { color: #8c1c30; }

  /* ── Nav ── */
  .nav-link {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; color: rgba(26,10,14,0.4); text-decoration: none;
    position: relative; transition: color 0.3s; cursor: none;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -3px; left: 0;
    width: 0; height: 1px; background: #8c1c30;
    transition: width 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .nav-link:hover { color: #8c1c30; }
  .nav-link:hover::after { width: 100%; }

  /* ── Hamburger button ── */
  .hamburger-btn {
    display: none;
    flex-direction: column; justify-content: center; align-items: center;
    gap: 5px; background: none; border: none; cursor: pointer;
    padding: 4px; z-index: 1100;
  }
  .hamburger-btn span {
    display: block; width: 22px; height: 1.5px; background: #1a0a0e;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s;
    transform-origin: center;
  }
  .hamburger-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ── Full-screen mobile menu ── */
  .mobile-menu {
    display: none;
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: #faf8f5; z-index: 1050;
    flex-direction: column; justify-content: center; align-items: center;
    gap: 36px;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.23,1,0.32,1);
  }
  .mobile-menu.open { opacity: 1; pointer-events: all; }
  .mobile-nav-link {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(40px, 10vw, 56px); font-weight: 600;
    color: rgba(26,10,14,0.18); text-decoration: none;
    letter-spacing: -0.02em; line-height: 1;
    transition: color 0.3s;
  }
  .mobile-nav-link:hover { color: #8c1c30; }

  /* ── Hero word-split ── */
  .hero-word { display: inline-block; overflow: hidden; }
  .hero-word-inner {
    display: inline-block; transform: translateY(110%);
    transition: transform 0.9s cubic-bezier(0.23,1,0.32,1);
  }
  .hero-word-inner.vis { transform: translateY(0); }

  /* ── Scroll word reveal (word-by-word scrub) ── */
  .scrub-word { color: rgba(26,10,14,0.12); display: inline-block; }
  .scrub-word.lit { color: #1a0a0e; }

  /* ── Slot machine text ── */
  .slot-wrapper { overflow: hidden; height: 1.1em; }
  .slot-inner { display: flex; flex-direction: column; }

  /* ── Project tabs ── */
  .proj-tab {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; background: none; border: none;
    color: rgba(26,10,14,0.32); padding: 12px 0; cursor: none;
    position: relative; transition: color 0.3s; margin-right: 32px;
  }
  .proj-tab::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 0; height: 1.5px; background: #8c1c30;
    transition: width 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .proj-tab.active { color: #8c1c30; }
  .proj-tab.active::after { width: 100%; }

  /* ── Project cards ── */
  .proj-card {
    background: #fff; border: 1px solid rgba(26,10,14,0.08);
    padding: 28px 24px; text-decoration: none; color: inherit; display: block;
    cursor: none; transition: border-color 0.35s, box-shadow 0.35s,
                              transform 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .proj-card:hover {
    border-color: rgba(140,28,48,0.3);
    box-shadow: 0 14px 44px rgba(140,28,48,0.08);
    transform: translateY(-4px);
  }
  .proj-card-arrow {
    display: inline-block;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
  }
  .proj-card:hover .proj-card-arrow { transform: translate(4px,-4px); }

  /* ── Skill pills ── */
  .pill {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.1em;
    text-transform: uppercase; border: 1px solid rgba(26,10,14,0.14);
    padding: 6px 14px; color: rgba(26,10,14,0.45);
    transition: border-color 0.3s, color 0.3s, background 0.3s; cursor: none;
  }
  .pill:hover { border-color: #8c1c30; color: #8c1c30; background: rgba(140,28,48,0.04); }

  /* ── Cert cards ── */
  .cert-card {
    border: 1px solid rgba(26,10,14,0.08); padding: 32px 28px; background: #fff;
    cursor: none; transition: border-color 0.35s, box-shadow 0.35s,
                              transform 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .cert-card:hover {
    border-color: rgba(140,28,48,0.3);
    box-shadow: 0 10px 32px rgba(140,28,48,0.07);
    transform: translateY(-3px);
  }

  /* ── Buttons ── */
  .btn-primary {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; background: #8c1c30; color: #faf8f5;
    padding: 15px 36px; text-decoration: none; font-weight: 600;
    border: none; cursor: none; display: inline-block;
    transition: background 0.35s, transform 0.25s cubic-bezier(0.23,1,0.32,1);
  }
  .btn-primary:hover { background: #6e1526; transform: translateY(-2px); }

  .btn-outline {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #1a0a0e; background: transparent;
    padding: 15px 36px; text-decoration: none; font-weight: 600;
    border: 1px solid rgba(26,10,14,0.18); cursor: none; display: inline-block;
    transition: border-color 0.35s, color 0.35s, background 0.35s;
  }
  .btn-outline:hover { border-color: #8c1c30; color: #8c1c30; background: rgba(140,28,48,0.04); }

  /* ── Underline sweep ── */
  .sweep-link {
    position: relative; display: inline-block;
    color: #8c1c30; text-decoration: none;
    font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .sweep-link::before {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 100%; height: 1px; background: #8c1c30;
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .sweep-link:hover::before { transform: scaleX(1); transform-origin: left; }

  /* ── Section rule ── */
  .section-rule {
    height: 1px; background: rgba(26,10,14,0.1); width: 0;
    transition: width 1.2s cubic-bezier(0.77,0,0.18,1);
  }
  .section-rule.vis { width: 100%; }

  /* ── Horizontal scroll marquee (Ashley big text) ── */
  @keyframes marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
  @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
  .marquee-track-l { display: flex; white-space: nowrap; animation: marquee-left  18s linear infinite; }
  .marquee-track-r { display: flex; white-space: nowrap; animation: marquee-right 18s linear infinite; }

  /* ── Floating image on hover (brand-list style) ── */
  .peek-img {
    position: fixed; pointer-events: none; z-index: 8000;
    width: 220px; height: 280px; object-fit: cover;
    border-radius: 2px; opacity: 0;
    transform: rotate(-4deg) scale(0.88);
    transition: opacity 0.28s cubic-bezier(0.23,1,0.32,1),
                transform 0.28s cubic-bezier(0.23,1,0.32,1);
    will-change: transform, opacity;
  }
  .peek-img.show { opacity: 1; transform: rotate(-2deg) scale(1); }

  /* ── Skills grids — responsive ── */
  .skills-top-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  .skills-bottom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  /* ── Mobile responsive ── */
  @media (max-width: 680px) {
    .about-grid   { grid-template-columns: 1fr !important; gap: 40px !important; }
    .about-bio    { order: -1; }
    .section-pad  { padding: 72px 24px !important; }
    .hero-pad     { padding: 72px 24px 48px !important; min-height: auto !important; justify-content: flex-start !important; }
    .nav-pad      { padding: 18px 24px !important; }
    .slot-pad     { padding: 80px 24px 120px !important; }
    .contact-pad  { padding: 100px 24px 72px !important; }
    .footer-pad   { padding: 22px 24px !important; }
    .proj-tab     { margin-right: 16px !important; }
    .cert-card    { padding: 24px 20px !important; }
    .proj-card    { padding: 22px 18px !important; }

    /* Experience specific mobile fixes */
    .exp-header-row {
        flex-direction: column !important; align-items: flex-start !important; gap: 4px !important;
    }

    /* Hamburger: show on mobile, hide desktop links */
    .nav-desktop-links  { display: none !important; }
    .hamburger-btn      { display: flex !important; }
    .mobile-menu        { display: flex !important; }

    /* Skills: collapse to 1 column */
    .skills-top-grid    { grid-template-columns: 1fr !important; }
    .skills-bottom-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#faf8f5",
  wine:    "#8c1c30",
  text:    "#1a0a0e",
  dim:     "rgba(26,10,14,0.5)",
  dimmer:  "rgba(26,10,14,0.3)",
  faint:   "rgba(26,10,14,0.08)",
  surface: "#ffffff",
  tint:    "rgba(140,28,48,0.03)",
};
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const MINI_PROJECTS = [
  { id:1, title:"Tic Tac Toe",  desc:"A simple tic tac toe game using HTML, CSS, and JS.",  tags:["HTML","CSS","JS"], url:"https://tic-tac-toe-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:2, title:"To Do List",   desc:"Task manager to keep your daily life organized.",       tags:["HTML","CSS","JS"], url:"https://to-do-list-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:3, title:"Stopwatch",    desc:"Stopwatch with start, stop, and reset features.",       tags:["HTML","CSS","JS"], url:"https://stop-watch-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:4, title:"Landing Page", desc:"A basic responsive landing page.",                      tags:["HTML","CSS","JS"], url:"https://landing-page-shruti-das-projects-64e0d3f9.vercel.app/" },
];
const MAIN_PROJECTS = [
  {
    id: 1,
    title: "Mini ERP + CRM Operations Portal",
    desc: "A full-stack operations portal for managing customers, products, inventory, stock movements, and sales challans with role-based access control.",
    tags: ["React", "Node.js", "Express", "Prisma", "MySQL", "JWT"],
    url: null,
  },
  {
    id: 2,
    title: "Second Brain",
    desc: "An AI-powered knowledge management platform designed to organize, connect, and retrieve personal information intelligently.",
    tags: ["React", "AI", "LLM", "Python"],
    url: null,
  },
  {
    id: 3,
    title: "Resume Analyzer",
    desc: "An AI-powered resume analyzer that reviews your resume, scores it against a job description, and suggests improvements.",
    tags: ["React", "AI", "LLM", "Python"],
    url: null,
  },
  {
    id: 4,
    title: "BareGlow Skincare",
    desc: "A full skincare product web app built with React, focused on a clean and engaging shopping experience.",
    tags: ["React", "CSS", "UI/UX"],
    url: "https://bare-glow-shruti-das-projects-64e0d3f9.vercel.app/",
  },
  {
    id: 5,
    title: "Shree Ganesh Patholab",
    desc: "Real-time client project built during internship.",
    tags: ["React", "Client Work"],
    url: "https://ganesh-patholab.vercel.app/",
  },
  {
    id: 6,
    title: "Pranabandhu Sahoo",
    desc: "Personal website for a client, built during internship.",
    tags: ["React", "Client Work"],
    url: "https://pranabandhu.com/",
  },
];
const DESIGN_WORK = [
  { id:1, title:"Social Media Graphics", desc:"12 graphics created for various brands and campaigns.", tags:["Canva","Graphic Design"], url:"/graphic-designs" },
  { id:2, title:"UI/UX Designs",         desc:"Figma mockups and wireframes for web interfaces.",      tags:["Figma","UI/UX"],          url:"#" },
];
const SKILLS = [
  {
    cat: "Languages",
    items: ["Python","JavaScript","Java","HTML5","CSS3"],
  },
  {
    cat: "Frameworks & Libraries",
    items: ["React","Three.js","GSAP","Tailwind CSS","Framer Motion"],
  },
  {
    cat: "Databases & Backend",
    items: ["MySQL","Firebase","REST APIs","DBMS Concepts"],
  },
  {
    cat: "Design & Tools",
    items: ["Figma","Canva","Git","GitHub","VS Code","Power BI","Excel","Trello"],
  },
  {
    cat: "Concepts",
    items: ["UI/UX Design","Responsive Design","OOP","Data Structures","Agile","Product Management"],
  },
  {
    cat: "Currently Learning",
    items: ["AI & ML Concepts","Large Language Models (LLMs)","Prompt Engineering","Generative AI","Data Science"],
  },
];
const CERTS = [
  { title:"Advanced MS Excel",                  issuer:"Microsoft", year:"2023", url:"https://drive.google.com/file/d/1dlSErl8mOzIymfioG4L_9cuAj020llSQ/view?usp=sharing" },
  { title:"Software Engineering Job Simulation", issuer:"Forage",    year:"2023", url:"https://drive.google.com/file/d/14e-Px_B-GdTxVlWGMuxc0mr1VHmz_kNX/view?usp=sharing" },
  { title:"Basic Data Science",                  issuer:"Various",   year:"2022", url:"https://drive.google.com/file/d/18a7slJ_ULVu8K4RMZDFbygHPqblx48d2/view?usp=sharing" },
  { title:"Product Management",                  issuer:"Various",   year:"2024", url:"#" },
];

// New Experience Data
const EXPERIENCE_DATA = [
    {
    company: "RSB Healthcare Consulting",
    role: "Software Engineer Intern",
    date: "Feb 2025 – Present",
    location: "Bangalore, India",
    highlights: [
      "Currently working as a Software Engineer Intern on a live healthcare SaaS platform.",
      "Built responsive and performant frontend interfaces using React.",
      "Integrated complex backend APIs with frontend, implementing features like real-time patient dashboards, appointment scheduling, and report generation.",
      "Developed and deployed AWS Lambda functions (Node.js) for serverless workflows including automated report generation, SMS/email notifications, and data syncing.",
      "Significantly improved page load performance and Core Web Vitals through code splitting, lazy loading, and optimized asset delivery."
    ],
    tech: ["React", "Node.js", "AWS Lambda", "Tailwind"]
  },
  {
    company: "MoBuzz Media Private Limited",
    role: "Web Developer Intern",
    date: "Jul 2025 - Sep 2025",
    location: "Odisha, India · Remote",
    highlights: [
      "Designed and developed 3 fully functional, responsive websites from concept to deployment.",
      "Conducted client interactions to gather requirements and provide technical input.",
      "Translated client needs into wireframes and working prototypes using HTML, CSS, JS, and React.",
      "Focused on user experience, performance optimization, and mobile responsiveness."
    ],
    tech: ["React", "Client Work", "Frontend Dev"]
  },
  {
    company: "SkillCraft Technology",
    role: "Web Development Intern",
    date: "Jul 2024",
    location: "India · Remote",
    highlights: [
      "Successfully completed 3 individual web development projects during a fast-paced virtual internship.",
      "Designed responsive, interactive web pages ensuring clean code and cross-browser compatibility.",
      "Implemented UI enhancements such as form validations and dynamic content rendering.",
      "Practiced independent problem-solving by researching solutions without direct mentorship."
    ],
    tech: ["HTML5", "CSS3", "Vanilla JS"]
  },
];

const TICKER_ITEMS = ["Frontend Dev","·","UI/UX Designer","·","React","·","Python","·","Open to Work","·","ITER 2026","·","AI & ML","·","Product Manager","·","Creative Code","·","Internships","·"];
const NAV_LINKS    = ["About","Skills","Experience","Projects","Certifications","Contact"]; // Added Experience to Nav

// Slot words for the Ashley-style cycling section
const SLOT_WORDS = ["Developer","Designer","Creator","Builder","Learner"];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useStyles() {
  useEffect(() => {
    if (document.getElementById("sd-css")) return;
    const el = document.createElement("style");
    el.id = "sd-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
}

function useCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const m = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return { pos, hov, setHov };
}

// ── Lenis smooth scroll + GSAP ticker ──────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

    // Keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
}

function useHeroReveal() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(".hero-word-inner").forEach((el, i) => {
        setTimeout(() => el.classList.add("vis"), i * 130);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);
}

// ── Section rule observer ───────────────────────────────────────────────────
function useSectionRules() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-rule");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.06 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ label }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Cursor({ pos, hov }) {
  return (
    <>
      <div className={`cur-dot${hov ? " hov" : ""}`} style={{ left: pos.x, top: pos.y }} />
      <div className={`cur-ring${hov ? " hov" : ""}`} style={{ left: pos.x, top: pos.y }} />
    </>
  );
}

// ── NAV with hamburger ───────────────────────────────────────────────────────
function Nav({ setHov }) {
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

// ── TRAIL IMAGES — filenames from public folder ──────────────────────────────
const TRAIL_IMAGES = [
  "/one.jpeg",
  "/two.jpeg",
  "/three.jpeg",
  "/four.jpeg",
  "/five.jpeg",
  "/six.jpeg",
  "/seven.jpeg",
  "/eight.jpeg",
  "/nine.jpeg",
  "/ten.jpeg",
  "/eleven.jpeg",
  "/twelve.jpeg",
];

// ── HERO ────────────────────────────────────────────────────────────────────
function Hero({ setHov }) {
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

function Ticker() {
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
function BigMarquee() {
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

// ── ABOUT with pinned heading + scroll-reveal bio ───────────────────────────
function About() {
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

// ── EXPERIENCE SECTION (Optimized Spacing) ──────────────────────────────────
function Experience({ setHov }) {
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
function SlotMachine() {
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
function Skills({ setHov }) {
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

function Projects({ setHov }) {
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

// ── CERTIFICATIONS ───────────────────────────────────────────────────────────
function Certifications({ setHov }) {
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

function Contact({ setHov }) {
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

function Footer() {
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

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  useStyles();
  useLenis();          // ← Lenis smooth scroll
  useSectionRules();   // ← animated hr lines
  const { pos, hov, setHov } = useCursor();

  return (
    <>
      <Cursor pos={pos} hov={hov} />
      <Nav setHov={setHov} />
      <main>
        <Hero setHov={setHov} />
        <Ticker />
        <BigMarquee />          
        <About />
        
        {/* ── NEW EXP SECTION ADDED HERE ── */}
        <Experience setHov={setHov} />

        <SlotMachine />         
        <Skills setHov={setHov} />
        <Projects setHov={setHov} />
        <Certifications setHov={setHov} />
        <Contact setHov={setHov} />
      </main>
      <Footer />
    </>
  );
}