import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { GLOBAL_CSS } from "./Constants";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
export function useStyles() {
  useEffect(() => {
    if (document.getElementById("sd-css")) return;
    const el = document.createElement("style");
    el.id = "sd-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
}

export function useCursor() {
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
export function useLenis() {
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

export function useHeroReveal() {
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
export function useSectionRules() {
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