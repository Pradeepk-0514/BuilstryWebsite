"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Carousel({ items }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const goTo = (index) => {
    const next = (index + items.length) % items.length;
    const track = trackRef.current;
    if (track) track.scrollTo({ left: track.clientWidth * next, behavior: "smooth" });
    setActive(next);
  };

  useEffect(() => {
    const timer = window.setInterval(() => goTo(active + 1), 4200);
    return () => window.clearInterval(timer);
  }, [active]);

  return <div className="carousel-shell">
    <div className="benefits-carousel" ref={trackRef} onScroll={(event) => {
      const next = Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth);
      if (next !== active) setActive(next);
    }}>
      {items.map(([number, title, text]) => <article className="benefit-card" key={number}><span className="benefit-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
    </div>
    <div className="carousel-controls">
      <div className="carousel-dots" aria-label="Benefits slides">{items.map(([number], index) => <button key={number} className={index === active ? "is-active" : ""} aria-label={`Show benefit ${index + 1}`} onClick={() => goTo(index)} />)}</div>
      <div className="carousel-arrows"><button aria-label="Previous benefit" onClick={() => goTo(active - 1)}><ArrowLeft size={16} /></button><button aria-label="Next benefit" onClick={() => goTo(active + 1)}><ArrowRight size={16} /></button></div>
    </div>
  </div>;
}
      
