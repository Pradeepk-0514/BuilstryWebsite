"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const stats = [["6+", "YEARS OF EXPERIENCE"], ["100+", "PROJECTS DELIVERED"], ["10+", "PARTNERS SCALING"], ["15K+", "CREATORS SKILLED"]];

function StatValue({ value, active }) {
  const match = value.match(/^(\d+)(.*)$/);
  const [number, setNumber] = useState(0);
  useEffect(() => {
    if (!active || !match) return;
    const target = Number(match[1]);
    let frame = 0;
    const total = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      setNumber(Math.round(target * Math.min(frame / total, 1)));
      if (frame >= total) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [active, value]);
  return <>{match ? `${active ? number : 0}${match[2]}` : value}</>;
}

export default function ImpactStats() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(true); }, { threshold: .35 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section className="impact-section" ref={ref} aria-labelledby="impact-title"><div className="impact-intro"><Reveal><p className="eyebrow">OUR IMPACT STATS</p><h2 id="impact-title" className="editorial-heading impact-heading"><span>BUILT FOR</span><span>THE <span className="heading-accent inline-accent">NEXT</span></span><span className="heading-accent">NORMAL<span className="impact-period">.</span></span></h2><p>We are a future-driven ecosystem for people and teams ready to learn, build and scale what comes next.</p></Reveal></div><div className="impact-stat-grid">{stats.map(([value, label], index) => <Reveal key={label} delay={index * .08}><article className={`impact-stat impact-stat-${index + 1}`}><span className="impact-stat-index">0{index + 1}</span><strong><StatValue value={value} active={active} /></strong><span>{label}</span></article></Reveal>)}</div></section>;
}
