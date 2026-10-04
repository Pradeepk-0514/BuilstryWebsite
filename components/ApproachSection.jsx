"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./RouterLink";

const steps = [
  ["01", "FIND", "Identify what truly needs solving.", "Start with the signal, not the noise."],
  ["02", "UNDERSTAND", "Study the people, systems and forces behind it.", "See the full context before choosing a direction."],
  ["03", "REFRAME", "Challenge assumptions. Find the better question.", "The sharper question makes the stronger opportunity."],
  ["04", "DESIGN", "Shape the strategy, experience and solution.", "Turn insight into a clear path people can follow."],
  ["05", "BUILD", "Turn the idea into something real.", "Make the first useful version tangible and testable."],
  ["06", "EVOLVE", "Learn, improve and keep moving.", "Momentum comes from staying curious after launch."],
];
const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function ApproachSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return undefined;
    let frame = 0;
    let metrics = { top: 0, offset: 0, stickyHeight: window.innerHeight, intro: 0, distance: 0, range: 1 };
    const mobile = () => window.innerWidth <= 720;
    const syncMobileStep = () => {
      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
      const cardWidth = track.firstElementChild?.getBoundingClientRect().width || viewport.clientWidth;
      const index = Math.min(steps.length - 1, Math.max(0, Math.round(viewport.scrollLeft / Math.max(1, cardWidth + gap))));
      section.dataset.activeCard = `${index + 1}`;
      setActiveStep((current) => current === index ? current : index);
    };
    const reset = () => {
      section.style.height = "";
      section.dataset.phase = "mobile";
      track.style.transform = "translate3d(0, 0, 0)";
      syncMobileStep();
    };
    const update = () => {
      frame = 0;
      if (mobile()) return;
      const elapsed = clamp(window.scrollY - (metrics.top - metrics.offset), 0, metrics.range);
      const introProgress = clamp(elapsed / metrics.intro);
      const horizontalProgress = clamp(Math.max(0, elapsed - metrics.intro) / Math.max(1, metrics.distance));
      const index = Math.min(steps.length - 1, Math.round(horizontalProgress * (steps.length - 1)));
      const snappedProgress = index / (steps.length - 1);
      section.style.setProperty("--approach-intro-progress", `${introProgress}`);
      section.style.setProperty("--approach-progress", `${horizontalProgress}`);
      section.dataset.phase = introProgress < 1 ? "centering" : horizontalProgress >= 1 ? "complete" : "cards";
      section.dataset.activeCard = `${index + 1}`;
      track.style.transform = `translate3d(${-metrics.distance * snappedProgress}px, 0, 0)`;
      setActiveStep((current) => current === index ? current : index);
    };
    const measure = () => {
      if (mobile()) return reset();
      viewport.scrollLeft = 0;
      const header = document.querySelector(".site-header");
      const offset = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      const stickyHeight = Math.max(1, window.innerHeight - offset);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPadding = parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight);
      const cardWidth = Math.max(250, viewport.clientWidth - viewportPadding);
      track.style.setProperty("--approach-card-width", `${cardWidth}px`);
      const contentWidth = Math.max(1, viewport.clientWidth - viewportPadding);
      const distance = Math.max(0, track.scrollWidth - contentWidth);
      const intro = Math.round(Math.max(180, Math.min(window.innerHeight * .34, 360)));
      const range = Math.max(1, intro + distance);
      metrics = { top: section.getBoundingClientRect().top + window.scrollY, offset, stickyHeight, intro, distance, range };
      section.style.setProperty("--approach-sticky-offset", `${offset}px`);
      section.style.height = `${stickyHeight + range}px`;
      update();
    };
    const onScroll = () => { if (mobile()) return; if (!frame) frame = window.requestAnimationFrame(update); };
    const onHorizontalScroll = () => { if (mobile()) syncMobileStep(); };
    const onResize = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("scroll", onHorizontalScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("scroll", onHorizontalScroll);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="approach-scroll-section" ref={sectionRef} data-phase="centering" data-active-card="1">
    <div className="approach-sticky-wrapper">
      <div className="approach-left-content">
        <span className="approach-kicker">THE PROCESS</span>
        <h2>THE <em>BUILSTRY</em><br />APPROACH</h2>
        <p>A clear process. A simple philosophy. Real impact.</p>
        <Link className="text-link" href="/capabilities">See Our Process →</Link>
        <div className="approach-progress-indicator" aria-live="polite"><span>{`0${activeStep + 1}`}</span><i /><span>06</span></div>
      </div>
      <div className="approach-right-container" ref={viewportRef} aria-label="Builstry approach cards" tabIndex="0">
        <div className="approach-card-track" ref={trackRef}>
          {steps.map(([number, title, text, support], index) => <article className={`approach-card ${index <= activeStep ? "is-revealed" : ""} ${index === activeStep ? "is-active" : ""}`} key={number}>
            <div className="approach-card-number"><span>{number}</span></div>
            <div className="approach-card-content"><h3>{title}</h3><p>{text}</p><span>{support}</span></div>
            <div className="approach-card-accent" aria-hidden="true" />
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
