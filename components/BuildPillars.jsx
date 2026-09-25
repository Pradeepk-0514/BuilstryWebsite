"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, Layers3, Sparkles } from "lucide-react";

const pillars = [
  { short: "Industry", title: "Industry Solutions", icon: Layers3, text: "Practical AI, technology and design systems shaped around the needs of modern teams and industries.", detail: "We turn complex industry challenges into useful, scalable systems." },
  { short: "Strategy", title: "Business & Product Strategy", icon: BrainCircuit, text: "Clear strategy, product thinking and decisions that turn a complex opportunity into a focused next move.", detail: "We turn insight into clear plans that create real momentum." },
  { short: "Innovation", title: "Innovation & Community", icon: Sparkles, text: "Upskilling, innovation programs and communities that help people learn, collaborate and build what matters.", detail: "We bring fresh thinking, practical learning and ambitious people together." },
];

export default function BuildPillars() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % pillars.length), 5200);
    return () => window.clearInterval(timer);
  }, []);
  const previous = () => setActive((active + pillars.length - 1) % pillars.length);
  const next = () => setActive((active + 1) % pillars.length);
  return <section id="verticals" className="build-pillars-section" aria-labelledby="build-pillars-title">
    <div className="build-pillars-topline"><p className="eyebrow">THE BUILSTRY SYSTEM</p><span>01 — 03</span></div>
    <div className="build-pillars-layout">
      <div className="build-carousel-column"><div className="build-carousel" aria-live="polite">{pillars.map((pillar, index) => { const offset = (index - active + pillars.length) % pillars.length; const Icon = pillar.icon; return <article key={pillar.title} className={`build-carousel-card card-position-${offset} ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}><div className="build-card-top"><span className="build-card-tag">0{index + 1} / 03</span><Icon size={28} /></div><h3>{pillar.short}</h3><p>{pillar.text}</p><button type="button" className="build-card-arrow" onClick={index === active ? next : () => setActive(index)} aria-label={`View ${pillar.title}`}><ArrowRight size={18} /></button><div className="build-card-glow" /></article>; })}</div><div className="build-carousel-controls"><div className="build-carousel-dots">{pillars.map((pillar, index) => <button key={pillar.title} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Show ${pillar.title}`} />)}</div><div className="build-carousel-arrows"><button type="button" onClick={previous} aria-label="Previous build pillar"><ArrowRight size={16} className="arrow-previous" /></button><button type="button" onClick={next} aria-label="Next build pillar"><ArrowRight size={16} /></button></div></div><a className="build-learn-more" href={pillars[active].title === "Industry Solutions" ? "/industry-solutions" : pillars[active].title === "Business & Product Strategy" ? "/business-product-strategy" : "/innovation-community"}>Explore the work <ArrowRight size={16} /></a></div>
      <div className="build-pillars-copy"><p className="build-pillars-kicker">THE THREE PILLARS</p><h2 id="build-pillars-title"><span>THREE WAYS</span><span className="heading-accent">WE BUILD.</span></h2><p className="build-pillars-lede">Strategy gives direction. Technology makes it possible. Innovation brings it to life.</p><div className="pillar-detail-list">{pillars.map((pillar, index) => { const Icon = pillar.icon; return <button key={pillar.title} type="button" className={`pillar-detail ${index === active ? "is-active" : ""}`} onClick={() => setActive(index)}><span className="pillar-detail-icon"><Icon size={27} /></span><span><strong>{pillar.title}</strong><small>{pillar.detail}</small></span></button>; })}</div></div>
    </div>
  </section>;
}
