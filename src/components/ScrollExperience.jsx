import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const NATIVE_SCROLL_AREAS = [
  "[data-lenis-prevent]",
  "[data-scroll-native]",
].join(",");

const SECTION_SELECTOR = [
  ".home-page > section",
  ".about-website-reference > section",
  ".insights-page > section",
  ".inner-page > section",
  ".verify-page",
  "[data-scroll-section]",
].join(",");

const LAYER_SELECTORS = [
  ["background", ".hero-grid, .insights-art-grid, .capabilities-visual-grid, .journey-modern-orb", 0.3],
  ["visual", ".hero-orb, .home-concept-scene, .capabilities-visual, .about-ref-fan-stage, .about-ref-direction-visual, .about-ref-people-showcase, .about-ref-network-stage, .about-ref-principles-stage, .insights-opening-visual, .insights-dashboard-art, .insights-unbuilt-art, .approach-card-accent, .insights-art-orbit, .insights-art-cube", 0.85],
  ["foreground", ".hero-side-note, .hero-scroll, .section-index, .journey-modern-scroll-cue, .journey-modern-endnote, .insights-art-index, .insights-scroll-hint, .insights-curiosity-progress, .what-we-build-progress, .about-ref-status", 1.12],
];

const DECORATIVE_ENTRY_SELECTORS = ".hero-grid, .insights-art-grid, .insights-dashboard-art, .insights-unbuilt-art";
const DEFAULT_VARIANTS = ["rise", "cross", "depth", "tilt", "focus", "mask"];
const SECTION_VARIANTS = [
  [".about-ref-hero", "custom"],
  [".about-ref-why", "cross"],
  [".approach-scroll-section", "rise"],
  [".about-ref-directions", "depth"],
  [".about-ref-mindset-section", "cross"],
  [".about-ref-people", "rise"],
  [".about-ref-network-showcase", "focus"],
  [".about-ref-principles-showcase", "tilt"],
  [".journey-modern-section", "rise"],
  [".hero-section", "depth"],
  [".light-section", "cross"],
  [".capabilities-scroll", "rise"],
  [".insights-curiosity", "tilt"],
  [".marquee-section", "custom"],
  [".impact-section", "focus"],
  [".faq-section", "cross"],
  [".intent-scroll-section", "depth"],
  [".cta-section", "rise"],
  [".insights-opening", "depth"],
  [".insights-built-section", "mask"],
  [".insights-newsletter", "cross"],
  [".inner-hero", "rise"],
  [".inner-cards", "depth"],
  [".verify-page", "cross"],
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getVariant(section, index) {
  return SECTION_VARIANTS.find(([selector]) => section.matches(selector))?.[1]
    ?? DEFAULT_VARIANTS[index % DEFAULT_VARIANTS.length];
}

function createSectionParallax() {
  const sections = [...new Set(document.querySelectorAll(SECTION_SELECTOR))];
  if (!sections.length) return () => {};

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 760px), (pointer: coarse)");
  const visibleSections = new Set();
  const sectionLayers = new Map();
  const settleTimers = new Map();
  let frame = 0;

  const canEnter = (element, section) => {
    if (section.matches(".about-ref-hero")) return false;
    if (element.closest('[style*="opacity"], [style*="transform"], [data-reveal], [data-scroll-entry]')) return false;
    const style = window.getComputedStyle(element);
    return style.animationName === "none" && style.display !== "none" && style.visibility !== "hidden";
  };

  const addEntry = (element, role, section) => {
    if (!canEnter(element, section)) return;
    const authoredOpacity = clamp(Number.parseFloat(window.getComputedStyle(element).opacity) || 0, 0, 1);
    const startFactor = role === "copy" ? 0.66 : role === "visual" ? 0.78 : 0.72;
    element.style.setProperty("--cinematic-entry-end-opacity", authoredOpacity.toFixed(3));
    element.style.setProperty("--cinematic-entry-start-opacity", (authoredOpacity * startFactor).toFixed(3));
    element.dataset.scrollEntry = role;
  };

  for (const [index, section] of sections.entries()) {
    section.dataset.cinematicSection = "true";
    section.dataset.cinematicState = "waiting";
    section.dataset.cinematicVariant = getVariant(section, index);

    const layers = new Map();
    const heading = section.querySelector("h1, h2");
    if (heading) {
      heading.dataset.scrollLayer = "heading";
      layers.set(heading, 0.38);
      addEntry(heading, "heading", section);
    }

    const supportingCopy = [...section.querySelectorAll("p")]
      .find((element) => element.textContent.trim().length > 24);
    if (supportingCopy) {
      supportingCopy.dataset.scrollLayer = "copy";
      layers.set(supportingCopy, 0.58);
      if (heading) addEntry(supportingCopy, "copy", section);
    }

    for (const [layer, selector, factor] of LAYER_SELECTORS) {
      for (const element of section.querySelectorAll(selector)) {
        if (layers.has(element)) continue;
        element.dataset.scrollLayer = layer;
        layers.set(element, factor);
      }
    }

    for (const element of section.querySelectorAll(DECORATIVE_ENTRY_SELECTORS)) {
      addEntry(element, "visual", section);
    }

    if (section.matches(".about-ref-hero")) section.dataset.cinematicBackground = "true";
    sectionLayers.set(section, layers);
  }

  const scheduleFrame = () => {
    if (!frame) frame = window.requestAnimationFrame(updateParallax);
  };

  const updateParallax = () => {
    frame = 0;
    const viewportHeight = Math.max(window.innerHeight, 1);
    const distance = compactViewport.matches ? 9 : 18;

    for (const section of visibleSections) {
      const bounds = section.getBoundingClientRect();
      const progress = clamp((viewportHeight - bounds.top) / (viewportHeight + bounds.height), 0, 1);
      const normalized = progress - 0.5;
      section.style.setProperty("--cinematic-progress", progress.toFixed(3));

      const layers = sectionLayers.get(section);
      if (motionPreference.matches) {
        for (const element of layers.keys()) element.style.setProperty("--scroll-parallax-y", "0px");
        section.style.setProperty("--scroll-background-y", "0px");
        continue;
      }

      for (const [element, factor] of layers) {
        const offset = normalized * distance * factor;
        element.style.setProperty("--scroll-parallax-y", `${offset.toFixed(2)}px`);
      }

      if (section.dataset.cinematicBackground === "true") {
        const backgroundDistance = compactViewport.matches ? -3 : -7;
        section.style.setProperty("--scroll-background-y", `${(normalized * backgroundDistance).toFixed(2)}px`);
      }
    }
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const section = entry.target;
      if (!entry.isIntersecting) {
        visibleSections.delete(section);
        continue;
      }

      visibleSections.add(section);
      if (section.dataset.cinematicState === "waiting") {
        section.dataset.cinematicState = "settling";
        const settleDuration = compactViewport.matches ? 1100 : 1500;
        const timer = window.setTimeout(() => {
          if (section.isConnected) section.dataset.cinematicState = "settled";
          settleTimers.delete(section);
        }, settleDuration);
        settleTimers.set(section, timer);
      }
    }
    scheduleFrame();
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.02 });

  sections.forEach((section) => observer.observe(section));
  window.addEventListener("scroll", scheduleFrame, { passive: true });
  window.addEventListener("resize", scheduleFrame, { passive: true });
  motionPreference.addEventListener?.("change", scheduleFrame);
  scheduleFrame();

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", scheduleFrame);
    window.removeEventListener("resize", scheduleFrame);
    motionPreference.removeEventListener?.("change", scheduleFrame);
    if (frame) window.cancelAnimationFrame(frame);
    for (const timer of settleTimers.values()) window.clearTimeout(timer);
    for (const section of sections) {
      delete section.dataset.cinematicSection;
      delete section.dataset.cinematicState;
      delete section.dataset.cinematicVariant;
      delete section.dataset.cinematicBackground;
      section.style.removeProperty("--cinematic-progress");
      section.style.removeProperty("--scroll-background-y");
      for (const element of section.querySelectorAll("[data-scroll-layer], [data-scroll-entry]")) {
        delete element.dataset.scrollLayer;
        delete element.dataset.scrollEntry;
        element.style.removeProperty("--scroll-parallax-y");
        element.style.removeProperty("--cinematic-entry-start-opacity");
        element.style.removeProperty("--cinematic-entry-end-opacity");
      }
    }
  };
}

export default function ScrollExperience() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis;

    const startLenis = () => {
      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: !reducedMotion.matches,
        syncTouch: false,
        lerp: reducedMotion.matches ? 1 : 0.085,
        wheelMultiplier: 0.9,
        gestureOrientation: "vertical",
        anchors: { offset: 0, duration: reducedMotion.matches ? 0.01 : 1.1 },
        prevent: (node) => node instanceof Element && Boolean(node.closest(NATIVE_SCROLL_AREAS)),
      });
      window.__builstryLenis = lenis;
    };

    const handleMotionPreference = () => {
      const currentScroll = window.scrollY;
      lenis?.destroy();
      startLenis();
      lenis.scrollTo(currentScroll, { immediate: true, force: true });
    };

    startLenis();
    reducedMotion.addEventListener?.("change", handleMotionPreference);
    return () => {
      reducedMotion.removeEventListener?.("change", handleMotionPreference);
      lenis?.destroy();
      if (window.__builstryLenis === lenis) delete window.__builstryLenis;
    };
  }, []);

  useEffect(() => createSectionParallax(), [pathname]);
  return null;
}
