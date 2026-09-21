import { useStyles, useLenis, useSectionRules, useCursor } from "./Hooks";
import { Cursor, Nav, Hero, Ticker, BigMarquee } from "./Introsection";
import { About } from "./About";
import { Experience, SlotMachine } from "./Experience";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Certifications, Contact, Footer } from "./Footersection";

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