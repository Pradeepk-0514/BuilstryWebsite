"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./RouterLink";

const MOBILE_MEDIA = "(max-width: 720px), (min-width: 901px) and (max-width: 980px)";

const intents = [
  ["⌕", "I HAVE A PROBLEM.", "Let's understand it.", "/contact"],
  ["◇", "I HAVE A PRODUCT.", "Let's make it better.", "/solutions"],
  ["□", "I HAVE A BUSINESS.", "Let's find what's next.", "/contact"],
  ["✦", "I HAVE AN IDEA.", "Let's see if it should exist.", "/launchpad"],
];
const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
function updateIntentSpotlight(event) {
  if (event.pointerType === "touch") return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / Math.max(bounds.width, 1)));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / Math.max(bounds.height, 1)));
  card.style.setProperty("--intent-spot-x", `${x * 100}%`);
  card.style.setProperty("--intent-spot-y", `${y * 100}%`);
}
function resetIntentSpotlight(event) {
  if (event.pointerType === "touch") return;
  event.currentTarget.style.removeProperty("--intent-spot-x");
  event.currentTarget.style.removeProperty("--intent-spot-y");
}

export default function IntentSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return undefined;
    let frame = 0;
    let metrics = { top: 0, offset: 0, stickyHeight: window.innerHeight, trackDistance: 0, releaseDistance: 0, distance: 0 };
    const mobile = () => window.matchMedia(MOBILE_MEDIA).matches;
    const reset = () => {
      section.style.height = "";
      section.dataset.phase = "natural";
      track.style.transform = "translate3d(0, 0, 0)";
      setActiveIndex(0);
    };
    const update = () => {
      frame = 0;
      if (mobile()) {
        const elapsed = clamp(window.scrollY - metrics.top, 0, metrics.trackDistance);
        const progress = metrics.trackDistance > 0 ? clamp(elapsed / metrics.trackDistance) : 0;
        const index = Math.min(intents.length - 1, Math.floor(progress * intents.length));
        section.dataset.phase = progress >= 1 ? "complete" : "cards";
        section.dataset.activeCard = `${index + 1}`;
        track.style.transform = `translate3d(0, -${metrics.trackDistance * progress}px, 0)`;
        setActiveIndex((current) => current === index ? current : index);
        return;
      }
      const elapsed = clamp(window.scrollY - (metrics.top - metrics.offset), 0, metrics.distance);
      const progress = clamp(elapsed / metrics.distance);
      const cardProgress = clamp(elapsed / metrics.trackDistance);
      const releaseProgress = clamp((elapsed - metrics.trackDistance) / metrics.releaseDistance);
      const index = Math.min(intents.length - 1, Math.floor(cardProgress * intents.length));
      section.style.setProperty("--intent-progress", `${progress}`);
      section.style.setProperty("--intent-release-progress", `${releaseProgress}`);
      section.dataset.phase = releaseProgress > 0 ? "release" : "cards";
      section.dataset.activeCard = `${index + 1}`;
      track.style.transform = `translate3d(0, -${metrics.trackDistance * cardProgress + metrics.releaseDistance * releaseProgress}px, 0)`;
      setActiveIndex((current) => current === index ? current : index);
    };
    const measure = () => {
      if (mobile()) {
        const stage = section.querySelector(".intent-sticky-wrapper");
        const stageHeight = stage?.getBoundingClientRect().height || window.innerHeight;
        const trackDistance = Math.max(0, track.scrollHeight - viewport.clientHeight);
        metrics = {
          top: section.getBoundingClientRect().top + window.scrollY,
          offset: 0,
          stickyHeight: stageHeight,
          trackDistance,
          releaseDistance: 0,
          distance: trackDistance,
        };
        section.style.height = `${Math.ceil(stageHeight + trackDistance)}px`;
        update();
        return;
      }
      section.style.removeProperty("height");
      section.style.removeProperty("--intent-sticky-offset");
      const header = document.querySelector(".site-header");
      const offset = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      const stage = section.querySelector(".intent-sticky-wrapper");
      const stageHeight = stage?.getBoundingClientRect().height;
      const stickyHeight = stageHeight && stageHeight > 0
        ? stageHeight
        : Math.min(Math.max(1, window.innerHeight - offset), 680);
      const finalCard = track.lastElementChild;
      const finalHeight = finalCard?.getBoundingClientRect().height || 0;
      const trackDistance = Math.max(0, track.scrollHeight - (viewport.clientHeight + finalHeight) / 2);
      const releaseDistance = Math.max(160, Math.min(viewport.clientHeight * .48, 260));
      const distance = trackDistance + releaseDistance;
      metrics = { top: section.getBoundingClientRect().top + window.scrollY, offset, stickyHeight, trackDistance, releaseDistance, distance };
      section.style.setProperty("--intent-sticky-offset", `${offset}px`);
      section.style.height = `${stickyHeight + distance}px`;
      update();
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onResize = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="intent-scroll-section" ref={sectionRef} data-phase="cards" data-active-card="1" aria-labelledby="intent-title">
    <div className="intent-sticky-wrapper">
      <div className="intent-title"><span className="intent-kicker">BUILSTRY / BUILD WITH INTENT</span><h2 id="intent-title">WHAT ARE YOU<br />TRYING TO <em>BUILD?</em></h2><div className="intent-sequence-label"><span>{`0${activeIndex + 1}`}</span><i /><span>04</span></div></div>
      <div className="intent-card-viewport" ref={viewportRef} aria-label="Build intent choices">
        <div className="intent-card-track" ref={trackRef}>{intents.map(([icon, title, text, href], index) => <Link className={`intent-card ${index === activeIndex ? "is-active" : ""} ${index < activeIndex ? "is-complete" : ""}`} href={href} key={title} onPointerMove={updateIntentSpotlight} onPointerLeave={resetIntentSpotlight}><div className="intent-card-top"><span className="intent-index">0{index + 1}</span><span className="intent-icon" aria-hidden="true">{icon}</span></div><h3>{title}</h3><p>{text}</p><span className="intent-arrow">Explore <b>→</b></span></Link>)}</div>
      </div>
    </div>
  </section>;
}
