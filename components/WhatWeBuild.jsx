"use client";

import { useRef, useState } from "react";
import { ArrowRight, BarChart3, Lightbulb, Search, Settings2 } from "lucide-react";

const cards = [
  ["I HAVE A PROBLEM", "Let’s understand it.", "We start with the real question, the people affected and the opportunity hidden inside the friction.", Search],
  ["I HAVE A PRODUCT", "Let’s make it better.", "We find the useful next move, then shape the product, workflow and experience around it.", Settings2],
  ["I HAVE A BUSINESS", "Let’s find what’s next.", "Strategy, technology and intelligent systems come together to create practical momentum.", BarChart3],
  ["I HAVE AN IDEA", "Let’s see if it should exist.", "We test the signal, build the first proof and turn a promising idea into something people can use.", Lightbulb],
];

export default function WhatWeBuild() {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  const updateActive = (event) => {
    const rail = event.currentTarget;
    const next = Math.round(rail.scrollLeft / Math.max(rail.clientWidth, 1));
    setActive(Math.max(0, Math.min(cards.length - 1, next)));
  };
  const handleWheel = (event) => {
    const rail = railRef.current;
    if (!rail || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const atStart = rail.scrollLeft <= 1;
    const atEnd = rail.scrollLeft >= maxScroll - 1;
    const movingBack = event.deltaY < 0;
    if ((movingBack && atStart) || (!movingBack && atEnd)) return;
    event.preventDefault();
    rail.scrollBy({ left: event.deltaY, behavior: "smooth" });
  };

  return <section className="what-we-build" aria-labelledby="what-we-build-title">
    <div className="what-we-build-inner">
      <div className="what-we-build-intro">
        <div className="what-we-build-sticky">
          <p className="what-we-build-kicker">BUILSTRY / BUILD WITH INTENT</p>
          <h2 id="what-we-build-title"><span>WHAT</span><span>ARE YOU</span><span>TRYING</span><span className="heading-accent">TO BUILD?</span></h2>
          <p className="what-we-build-lede">Different starting points. The same commitment to making the next move useful.</p>
          <div className="what-we-build-progress"><strong>0{active + 1}</strong><span> / 04</span></div>
        </div>
      </div>
      <div className="what-we-build-cards" aria-live="polite">
        <div className="what-we-build-rail" ref={railRef} onWheelCapture={handleWheel} onScroll={updateActive} tabIndex="0" role="region" aria-label="What we build options">
          <div className="what-we-build-track">
          {cards.map(([label, title, text, Icon], index) => <article key={label} className={`what-we-build-card ${index === active ? "is-active" : ""}`}>
              <div className="what-we-build-card-top"><span>0{index + 1}</span><Icon size={25} strokeWidth={1.6} /></div>
              <div className="what-we-build-card-body"><p>{label}</p><h3>{title}</h3><span className="what-we-build-rule" /><small>{text}</small></div>
              <a href="#connect" className="what-we-build-link">EXPLORE <ArrowRight size={14} /></a>
            </article>)}
          </div>
        </div>
        <div className="what-we-build-rail-hint" aria-hidden="true">SCROLL TO EXPLORE <span>→</span></div>
      </div>
    </div>
  </section>;
}
