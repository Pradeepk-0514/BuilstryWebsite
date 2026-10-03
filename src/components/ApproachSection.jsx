import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  ["01", "FIND", "Identify what truly needs solving.", "Start with the signal, not the noise."],
  ["02", "UNDERSTAND", "Study the people, systems and forces behind it.", "See the full context before choosing a direction."],
  ["03", "REFRAME", "Challenge assumptions. Find the better question.", "The sharper question makes the stronger opportunity."],
  ["04", "DESIGN", "Shape the strategy, experience and solution.", "Turn insight into a clear path people can follow."],
  ["05", "BUILD", "Turn the idea into something real.", "Make the first useful version tangible and testable."],
  ["06", "EVOLVE", "Learn, improve and keep moving.", "Momentum comes from staying curious after launch."],
];

const MOBILE_BREAKPOINT = 980;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function ApproachSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!section || !track || !viewport) return undefined;

    let animationFrameId = 0;
    let metrics = {
      sectionTop: 0,
      stickyOffset: 0,
      stickyHeight: window.innerHeight,
      introDistance: 0,
      horizontalDistance: 0,
      scrollRange: 1,
    };

    const resetForMobile = () => {
      section.style.height = "";
      section.style.removeProperty("--intro-progress");
      section.style.removeProperty("--left-offset");
      section.dataset.phase = "mobile";
      track.style.transform = "translate3d(0, 0, 0)";
      setActiveStep(0);
    };

    const measure = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        resetForMobile();
        return;
      }

      const header = document.querySelector(".site-header");
      const stickyOffset = header
        ? Math.ceil(header.getBoundingClientRect().height)
        : 0;
      const stickyHeight = Math.max(1, window.innerHeight - stickyOffset);
      const horizontalDistance = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth,
      );

      // The first part of the section is reserved for the left copy to settle
      // into its centered position. Only after this distance does the track move.
      const introDistance = Math.round(
        Math.max(180, Math.min(window.innerHeight * 0.34, 360)),
      );
      const scrollRange = Math.max(1, introDistance + horizontalDistance);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      metrics = {
        sectionTop,
        stickyOffset,
        stickyHeight,
        introDistance,
        horizontalDistance,
        scrollRange,
      };

      section.style.setProperty("--approach-sticky-offset", `${stickyOffset}px`);
      section.style.height = `${stickyHeight + scrollRange}px`;
      updateScrollPosition();
    };

    const updateScrollPosition = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        resetForMobile();
        return;
      }

      const stickyStart = metrics.sectionTop - metrics.stickyOffset;
      const elapsed = clamp(
        window.scrollY - stickyStart,
        0,
        metrics.scrollRange,
      );
      const introProgress = clamp(elapsed / metrics.introDistance);
      const horizontalElapsed = Math.max(0, elapsed - metrics.introDistance);
      const horizontalProgress = metrics.horizontalDistance
        ? clamp(horizontalElapsed / metrics.horizontalDistance)
        : 1;
      const activeIndex = Math.min(
        steps.length - 1,
        Math.floor(horizontalProgress * steps.length),
      );

      section.style.setProperty("--intro-progress", `${introProgress}`);
      section.style.setProperty(
        "--left-offset",
        `${Math.round((1 - introProgress) * 48)}px`,
      );
      section.style.setProperty(
        "--horizontal-progress",
        `${horizontalProgress}`,
      );
      section.dataset.phase =
        introProgress < 1 ? "centering" : horizontalProgress >= 1 ? "complete" : "cards";
      section.dataset.activeCard = `${activeIndex + 1}`;

      // The end point is exactly track.scrollWidth - viewport.clientWidth,
      // so Card 6 ends flush and cannot be clipped or followed by hidden travel.
      track.style.transform = `translate3d(-${
        metrics.horizontalDistance * horizontalProgress
      }px, 0, 0)`;

      setActiveStep((current) => (current === activeIndex ? current : activeIndex));
    };

    const handleScroll = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateScrollPosition);
    };

    const handleResize = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(measure);
    };

    measure();

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      className="approach-scroll-section"
      ref={sectionRef}
      data-active-card="1"
      data-phase="centering"
    >
      <div className="approach-sticky-wrapper">
        <div className="approach-left-content">
          <h2>
            THE <em>BUILSTRY</em>
            <br />
            APPROACH
          </h2>
          <p>A clear process. A simple philosophy. Real impact.</p>
          <Link className="text-link" to="/capabilities">
            See Our Process →
          </Link>

          <div className="approach-progress-indicator" aria-label="Six-step approach">
            <span className="progress-number">01</span>
            <span className="progress-separator" aria-hidden="true" />
            <span className="progress-number">0{steps.length}</span>
          </div>
        </div>

        <div
          className="approach-right-container"
          ref={viewportRef}
          aria-label="Builstry approach cards"
        >
          <div className="approach-card-track" ref={trackRef}>
            {steps.map(([number, title, text, support], index) => (
              <article
                className={`approach-card ${
                  index <= activeStep ? "is-revealed" : ""
                } ${index === activeStep ? "is-active" : ""}`}
                key={number}
                aria-label={`Step ${number}: ${title}`}
              >
                <div className="approach-card-number">
                  <span>{number}</span>
                </div>
                <div className="approach-card-content">
                  <h3>{title}</h3>
<p>{text}</p>
                  <span className="approach-card-support">{support}</span>
                </div>
                <div className="approach-card-accent" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
