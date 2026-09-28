"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, BrainCircuit, Lightbulb, Sparkles } from "lucide-react";

const pillars = [
  { short: "Industry Solutions", title: "Industry Solutions", icon: BarChart3, text: "Practical AI, technology and design systems shaped around the needs of modern teams and industries." },
  { short: "Business & Product Strategy", title: "Business & Product Strategy", icon: BrainCircuit, text: "Clear strategy, product thinking and decisions that turn a complex opportunity into a focused next move." },
  { short: "Innovation & Community", title: "Innovation & Community", icon: Lightbulb, text: "Upskilling, innovation programs and communities that help people learn, collaborate and build what matters." },
];

export default function BuildPillars() {
  const [active, setActive] = useState(1);
  const wheelLocked = useRef(false);
  const sectionRef = useRef(null);

  const move = (direction) => setActive((current) => (current + direction + pillars.length) % pillars.length);
  const choose = (index) => setActive(index);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 12 || wheelLocked.current) return;
      wheelLocked.current = true;
      move(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => { wheelLocked.current = false; }, 520);
    };
    section.addEventListener("wheel", onWheel, { passive: true });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);

  return <section id="verticals" ref={sectionRef} className="build-pillars-section" aria-labelledby="build-pillars-title">
    <div className="build-pillars-topline"><p className="eyebrow">OUR APPROACH</p><span>BUILD SYSTEM / 01 — 03</span></div>
    <div className="build-pillars-layout">
      <div className="build-pillars-copy">
        <p className="build-pillars-kicker">DIFFERENT CHALLENGES.</p>
        <h2 id="build-pillars-title"><span>THREE WAYS</span><span className="heading-accent">WE BUILD.</span></h2>
        <p className="build-pillars-lede">A stronger tomorrow starts with the right combination of insight, strategy and innovation.</p>
        <div className="build-pillars-progress" aria-label={`Showing build system ${active + 1} of 3`}>
          {pillars.map((pillar, index) => <button key={pillar.title} type="button" className={active === index ? "is-active" : ""} onClick={() => choose(index)} aria-label={`Show ${pillar.title}`}><span>0{index + 1}</span></button>)}
        </div>
        <a className="build-learn-more" href={active === 0 ? "/industry-solutions" : active === 1 ? "/business-product-strategy" : "/innovation-community"}>Explore our approach <ArrowRight size={16} /></a>
        <div className="build-carousel-arrows"><button type="button" onClick={() => move(-1)} aria-label="Previous build system"><ArrowRight size={16} className="arrow-previous" /></button><button type="button" onClick={() => move(1)} aria-label="Next build system"><ArrowRight size={16} /></button></div>
      </div>
      <div className="build-carousel-column">
        <div className="build-carousel" aria-live="polite">
          {pillars.map((pillar, index) => {
            const offset = (index - active + pillars.length) % pillars.length;
            const Icon = pillar.icon;
            return <article key={pillar.title} className={`build-carousel-card card-position-${offset} ${index === active ? "is-active" : ""}`}>
              <div className="build-card-top"><span className="build-card-tag">0{index + 1}</span><Icon size={24} /></div>
              <div className={`build-visual build-visual-${index + 1}`} aria-hidden="true"><span /><span /><span /></div>
              <h3>{pillar.short}</h3>
              <p>{pillar.text}</p>
              <span className="build-card-explore">EXPLORE <ArrowRight size={13} /></span>
              <div className="build-card-glow" />
            </article>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
