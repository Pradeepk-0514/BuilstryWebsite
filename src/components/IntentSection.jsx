import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const intents = [
  ["⌕", "I HAVE A PROBLEM.", "Let's understand it.", "/contact"],
  ["◇", "I HAVE A PRODUCT.", "Let's make it better.", "/solutions"],
  ["□", "I HAVE A BUSINESS.", "Let's find what's next.", "/contact"],
  ["✦", "I HAVE AN IDEA.", "Let's see if it should exist.", "/launchpad"],
];

const MOBILE_BREAKPOINT = 720;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function IntentSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePreferenceChange = (event) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handlePreferenceChange);
    return () => mediaQuery.removeEventListener("change", handlePreferenceChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!section || !track || !viewport) return undefined;

    let animationFrameId = 0;
    let scanTimeoutId = 0;
    let metrics = {
      sectionTop: 0,
      stickyOffset: 0,
      stickyHeight: window.innerHeight,
      verticalDistance: 0,
    };

    const showNaturalLayout = () => {
      section.style.height = "";
      section.style.removeProperty("--intent-progress");
      section.dataset.phase = "natural";
      track.style.transform = "translate3d(0, 0, 0)";
      setActiveIndex(0);
    };

    const updateScrollPosition = () => {
      if (
        window.innerWidth <= MOBILE_BREAKPOINT ||
        prefersReducedMotion ||
        metrics.verticalDistance <= 0
      ) {
        showNaturalLayout();
        return;
      }

      const stickyStart = metrics.sectionTop - metrics.stickyOffset;
      const elapsed = clamp(
        window.scrollY - stickyStart,
        0,
        metrics.verticalDistance,
      );
      const progress = clamp(elapsed / metrics.verticalDistance);
      const nextActiveIndex = Math.min(
        intents.length - 1,
        Math.floor(progress * intents.length),
      );

      section.style.setProperty("--intent-progress", `${progress}`);
      section.dataset.phase = progress >= 1 ? "complete" : "cards";
      section.dataset.activeCard = `${nextActiveIndex + 1}`;
      track.style.transform = `translate3d(0, -${
        metrics.verticalDistance * progress
      }px, 0)`;

      setActiveIndex((current) =>
        current === nextActiveIndex
          ? current
          : (() => {
              section.dataset.scan = "active";
              window.clearTimeout(scanTimeoutId);
              scanTimeoutId = window.setTimeout(() => {
                delete section.dataset.scan;
              }, 520);
              return nextActiveIndex;
            })(),
      );
    };

    const measure = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT || prefersReducedMotion) {
        showNaturalLayout();
        return;
      }

      const header = document.querySelector(".site-header");
      const stickyOffset = header
        ? Math.ceil(header.getBoundingClientRect().height)
        : 0;
      const stickyHeight = Math.max(1, window.innerHeight - stickyOffset);
      const verticalDistance = Math.max(
        0,
        track.scrollHeight - viewport.clientHeight,
      );
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      metrics = {
        sectionTop,
        stickyOffset,
        stickyHeight,
        verticalDistance,
      };

      section.style.setProperty("--intent-sticky-offset", `${stickyOffset}px`);
      section.style.height = `${stickyHeight + verticalDistance}px`;
      updateScrollPosition();
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scanTimeoutId) window.clearTimeout(scanTimeoutId);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      className="section intent-section intent-scroll-section"
      ref={sectionRef}
      data-phase="cards"
      data-active-card="1"
    >
      <div className="intent-sticky-wrapper">
        <div className="intent-title">
          <h2>
            WHAT ARE YOU
            <br />
            TRYING TO <em>BUILD?</em>
          </h2>
          <div className="intent-sequence-label" aria-live="polite">
            <span>0{activeIndex + 1}</span>
            <span className="intent-sequence-rule" aria-hidden="true" />
            <span>04</span>
          </div>
        </div>

        <div
          className="intent-card-viewport"
          ref={viewportRef}
          aria-label="Build intent choices"
        >
          <div className="intent-card-track" ref={trackRef}>
            {intents.map(([icon, title, text, href], index) => (
              <Link
                className={`intent-card ${
                  index === activeIndex ? "is-active" : ""
                } ${index < activeIndex ? "is-complete" : ""}`}
                to={href}
                key={title}
              >
                <div className="intent-card-top">
                  <span className="intent-index">0{index + 1}</span>
                  <span className="intent-icon" aria-hidden="true">
                    {icon}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="intent-arrow">
                  Explore <b aria-hidden="true">→</b>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
