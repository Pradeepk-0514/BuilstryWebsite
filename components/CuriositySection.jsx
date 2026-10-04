"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./RouterLink";

const curiosityTopics = [
  ["!", "WHAT'S BROKEN?", "broken", "Problems worth understanding before they become expensive."],
  ["↗", "WHAT'S CHANGING?", "changing", "Signals, shifts and technologies changing the way we build."],
  ["□", "WHAT'S WORTH BUILDING?", "worth", "Ideas with the potential to become useful, scalable systems."],
  ["◎", "WHY DOES IT WORK?", "works", "The principles, products and systems that create real value."],
  ["⌕", "WHERE'S THE OPPORTUNITY?", "opportunity", "Gaps where better experiences and smarter systems can win."],
  ["✦", "WHAT'S NEXT?", "next", "Emerging ideas, behaviours and technologies to watch next."],
];

export default function CuriositySection() {
  const [curiosityIndex, setCuriosityIndex] = useState(0);
  const curiosityRef = useRef(null);
  const curiosityTrackRef = useRef(null);

  useEffect(() => {
    const section = curiosityRef.current;
    const track = curiosityTrackRef.current;
    if (!section || !track) return undefined;
    const rail = section.querySelector(".insights-curiosity-rail");
    let frame = 0;
    let target = 0;
    let current = 0;
    let travel = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      if (window.innerWidth <= 720) {
        section.style.height = "";
        track.style.transform = "none";
        setCuriosityIndex(0);
        return;
      }
      travel = Math.max(0, track.scrollWidth - section.clientWidth + section.querySelector(".insights-curiosity-stage")?.querySelector(".insights-curiosity-intro")?.getBoundingClientRect().width || 0);
      const releaseDistance = Math.max(window.innerHeight * 2.15, travel * 1.18);
      section.style.height = `${window.innerHeight + releaseDistance}px`;
      updateTarget();
    };

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const releaseDistance = Math.max(window.innerHeight * 2.15, travel * 1.18);
      target = Math.max(0, Math.min(1, -rect.top / releaseDistance));
      const nextIndex = Math.min(curiosityTopics.length - 1, Math.floor(target * curiosityTopics.length));
      setCuriosityIndex((previous) => previous === nextIndex ? previous : nextIndex);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      const ease = reducedMotion ? 1 : 0.12;
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.0005) current = target;
      track.style.transform = `translate3d(${-travel * current}px, 0, 0)`;
      if (Math.abs(target - current) > 0.0005) frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (window.innerWidth <= 720) return;
      updateTarget();
    };
    const onMobileRailScroll = () => {
      if (window.innerWidth > 720 || !rail) return;
      const firstCard = track.firstElementChild;
      const cardWidth = firstCard?.getBoundingClientRect().width || rail.clientWidth;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const nextIndex = Math.min(curiosityTopics.length - 1, Math.round(rail.scrollLeft / (cardWidth + gap)));
      setCuriosityIndex((previous) => previous === nextIndex ? previous : nextIndex);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    rail?.addEventListener("scroll", onMobileRailScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      rail?.removeEventListener("scroll", onMobileRailScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="insights-curiosity" ref={curiosityRef} aria-labelledby="insights-curiosity-title" style={{ "--insights-ice": "var(--ice)", "--insights-midnight": "var(--midnight)", "--insights-steel": "var(--steel)", "--insights-magenta": "var(--magenta)" }}>
    <div className="insights-curiosity-stage">
      <div className="insights-curiosity-intro">
        <span className="insights-curiosity-kicker">BUILSTRY / QUESTIONS</span>
        <h2 id="insights-curiosity-title">WHAT ARE<br />YOU <em>CURIOUS</em><br />ABOUT?</h2>
        <div className="insights-curiosity-rule" aria-hidden="true" />
        <p>Ideas worth asking about before they become things worth building.</p>
        <span className="insights-scroll-hint">SCROLL TO EXPLORE <b>→</b></span>
        <span className="insights-curiosity-progress"><b>{`0${curiosityIndex + 1}`}</b> / 06</span>
      </div>
      <div className="insights-curiosity-rail" aria-label="Curiosity topics">
        <div className="insights-curiosity-track" ref={curiosityTrackRef}>
          {curiosityTopics.map(([icon, title, key, description], index) => <Link href={`/blog?topic=${key}`} className={`insights-curiosity-card ${index === curiosityIndex ? "is-active" : ""}`} key={title}>
            <div className="insights-card-head"><span className="insights-card-index">0{index + 1}</span><span className="insights-card-icon" aria-hidden="true">{icon}</span></div>
            <strong>{title}</strong>
            <div className="insights-card-rule" aria-hidden="true" />
            <small>{description}</small>
            <span className="insights-explore">Explore <b>→</b></span>
          </Link>)}
        </div>
      </div>
    </div>
  </section>;
}
