// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
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
export const C = {
  bg:      "#faf8f5",
  wine:    "#8c1c30",
  text:    "#1a0a0e",
  dim:     "rgba(26,10,14,0.5)",
  dimmer:  "rgba(26,10,14,0.3)",
  faint:   "rgba(26,10,14,0.08)",
  surface: "#ffffff",
  tint:    "rgba(140,28,48,0.03)",
};
export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS  = "'DM Sans', sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
export const MINI_PROJECTS = [
  { id:1, title:"Tic Tac Toe",  desc:"A simple tic tac toe game using HTML, CSS, and JS.",  tags:["HTML","CSS","JS"], url:"https://tic-tac-toe-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:2, title:"To Do List",   desc:"Task manager to keep your daily life organized.",       tags:["HTML","CSS","JS"], url:"https://to-do-list-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:3, title:"Stopwatch",    desc:"Stopwatch with start, stop, and reset features.",       tags:["HTML","CSS","JS"], url:"https://stop-watch-shruti-das-projects-64e0d3f9.vercel.app/" },
  { id:4, title:"Landing Page", desc:"A basic responsive landing page.",                      tags:["HTML","CSS","JS"], url:"https://landing-page-shruti-das-projects-64e0d3f9.vercel.app/" },
];
export const MAIN_PROJECTS = [
  {
    id: 1,
    title: "Mova",
    desc: "A full-stack ERP + CRM portal with role-based access for managing customers, inventory, and sales challans.",
    tags: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "JWT"],
    url: "https://mini-erp-frontend-87hq.onrender.com/login",
  },
  {
    id: 7,
    title: "BookNest",
    desc: "A full-stack multi-user reading tracker with shelf sharing, book lending, and real-time updates.",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "Socket.IO"],
    url: "https://booknest-client-f82s.onrender.com/",
  },
  {
    id: 2,
    title: "Second Brain",
    desc: "An AI-powered knowledge management platform designed to organize, connect, and retrieve personal information intelligently.",
    tags: ["React", "AI", "LLM", "Python"],
    url: "https://secondbrain-frontend-m3v2.onrender.com",
  },
  {
  id: 3,
  title: "Insight OS",
  desc: "An AI-powered business analytics platform that transforms uploaded Excel and CSV files into actionable insights, revenue and loss analysis, and AI-driven business recommendations.",
  tags: ["React", "Python", "FastAPI", "Pandas", "AI"],
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
export const DESIGN_WORK = [
  { id:1, title:"Social Media Graphics", desc:"12 graphics created for various brands and campaigns.", tags:["Canva","Graphic Design"], url:"/graphic-designs" },
  { id:2, title:"UI/UX Designs",         desc:"Figma mockups and wireframes for web interfaces.",      tags:["Figma","UI/UX"],          url:"#" },
];
export const SKILLS = [
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
export const CERTS = [
  { title:"Advanced MS Excel",                  issuer:"Microsoft", year:"2023", url:"https://drive.google.com/file/d/1dlSErl8mOzIymfioG4L_9cuAj020llSQ/view?usp=sharing" },
  { title:"Software Engineering Job Simulation", issuer:"Forage",    year:"2023", url:"https://drive.google.com/file/d/14e-Px_B-GdTxVlWGMuxc0mr1VHmz_kNX/view?usp=sharing" },
  { title:"Basic Data Science",                  issuer:"Various",   year:"2022", url:"https://drive.google.com/file/d/18a7slJ_ULVu8K4RMZDFbygHPqblx48d2/view?usp=sharing" },
  { title:"Product Management",                  issuer:"Various",   year:"2024", url:"#" },
];

// New Experience Data
export const EXPERIENCE_DATA = [
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

export const TICKER_ITEMS = ["Frontend Dev","·","UI/UX Designer","·","React","·","Python","·","Open to Work","·","ITER 2026","·","AI & ML","·","Product Manager","·","Creative Code","·","Internships","·"];
export const NAV_LINKS    = ["About","Skills","Experience","Projects","Certifications","Contact"]; // Added Experience to Nav

// Slot words for the Ashley-style cycling section
export const SLOT_WORDS = ["Developer","Designer","Creator","Builder","Learner"];

// ── TRAIL IMAGES — filenames from public folder ──────────────────────────────
export const TRAIL_IMAGES = [
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