import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroCube from "../components/HeroCube";
import IntentSection from "../components/IntentSection";
import CtaModal from "../components/CtaModal";
import "./HomeEnhancements.css";
import "./ApproachEnhancements.css";
import "./HomeApproachRefinement.css";

import "./IndustriesCarousel.css";

const pillars = [
  {
    n: "01",
    title: "INDUSTRY SOLUTIONS",
    text: "We identify meaningful problems across industries and create technology-driven solutions — from software and AI to hardware and custom systems.",
    cls: "pillar-one",
  },
  {
    n: "02",
    title: "BUSINESS & PRODUCT STRATEGY",
    text: "We challenge products, businesses and brands to uncover what isn't working, what could work better, and what should come next.",
    cls: "pillar-two",
  },
  {
    n: "03",
    title: "INNOVATION & COMMUNITY",
    text: "Through programs, hackathons and innovation spaces, we bring people, ideas and opportunities together to turn potential into action.",
    cls: "pillar-three",
  },
];

const steps = [
  ["01", "FIND", "Identify what truly needs solving."],
  ["02", "UNDERSTAND", "Study the people, systems and forces behind it."],
  ["03", "REFRAME", "Challenge assumptions. Find the better question."],
  ["04", "DESIGN", "Shape the strategy, experience and solution."],
  ["05", "BUILD", "Turn the idea into something real."],
  ["06", "EVOLVE", "Learn, improve and keep moving."],
];

const lower = [
  {
    title: "BUILSTRY LABS",
    text: "Some ideas come from clients. Some come from us.",
    link: "/projects",
    cta: "Explore Labs →",
    cls: "labs-card",
  },
  {
    title: "12 INDUSTRIES",
    text: "We look beyond categories to discover where things can work better.",
    link: "/industries",
    cta: "Explore Industries →",
    cls: "industries-card",
  },
];

const industryCards = [
  ["01", "INDUSTRY SOLUTIONS", "Technology-driven systems for meaningful real-world problems.", "industry"],
  ["02", "BUSINESS & PRODUCT STRATEGY", "Sharper decisions for products, brands and businesses.", "strategy"],
  ["03", "INNOVATION & COMMUNITY", "Platforms, programs and ideas that move potential into action.", "community"],
  ["04", "AI & TECHNOLOGY", "Practical intelligence and digital infrastructure built for momentum.", "technology"],
  ["05", "PRODUCTS & SYSTEMS", "Useful experiences that turn complexity into something people can use.", "systems"],
];
const labItems = [
  ["01", "BUILSTRY LABS", "Experiments we start ourselves to explore useful possibilities."],
  ["02", "PROTOTYPES", "Early systems that turn a question into something people can try."],
  ["03", "TOOLS & FRAMEWORKS", "Practical methods for making complex problems easier to understand."],
  ["04", "RESEARCH NOTES", "Observations and patterns gathered before the next build begins."],
  ["05", "NEW DIRECTIONS", "Ideas still taking shape, waiting for the right problem and moment."],
];

function IndustriesCarousel() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const moveIndustry = (direction) => setActiveIndustry((current) => Math.max(0, Math.min(industryCards.length - 1, current + direction)));
  const onTouchStart = (event) => setTouchStart(event.touches[0].clientX);
  const onTouchEnd = (event) => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45) moveIndustry(delta < 0 ? 1 : -1);
    setTouchStart(null);
  };
  return (
    <div className="industries-carousel industries-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="industries-carousel-head">
        <div>
          <span className="industries-kicker">05 CATEGORIES</span>
          <h2>LOOK BEYOND <em>CATEGORIES.</em></h2>
          <p>We look beyond categories to discover where things can work better.</p>
        </div>
        <div className="industries-carousel-controls">
          <button type="button" aria-label="Previous industry" onClick={() => moveIndustry(-1)} disabled={activeIndustry === 0}>←</button>
          <span aria-live="polite">0{activeIndustry + 1} / 05</span>
          <button type="button" aria-label="Next industry" onClick={() => moveIndustry(1)} disabled={activeIndustry === industryCards.length - 1}>→</button>
        </div>
      </div>
      <div className="industries-carousel-stage" role="region" aria-label="Industries carousel">
        {industryCards.map(([number, title, text, visual], index) => {
          const offset = index - activeIndustry;
          return (
            <article className={`industry-slide ${offset === 0 ? "is-active" : ""} ${Math.abs(offset) > 1 ? "is-hidden" : ""}`} key={number} style={{ "--industry-offset": offset }} aria-hidden={offset !== 0}>
              <span className="industry-slide-number">{number} / 05</span>
              <div className={`industry-slide-art industry-art-${visual}`} aria-hidden="true"><span /></div>
              <div className="industry-slide-copy"><h3>{title}</h3><p>{text}</p><Link className="text-link" to="/industries">Explore →</Link></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function LabsCarousel() {
  const [activeLab, setActiveLab] = useState(0);
  const moveLab = (direction) => setActiveLab((current) => Math.max(0, Math.min(labItems.length - 1, current + direction)));
  return <article className="labs-carousel labs-card" aria-label="Builstry Labs carousel"><div className="labs-carousel-head"><div><span className="labs-kicker">BUILSTRY LABS / 05 ITEMS</span><h2>IDEAS WE'RE <em>EXPLORING.</em></h2><p>Experiments, tools and early directions from the Builstry studio.</p></div><div className="labs-carousel-controls"><button type="button" aria-label="Previous Lab item" onClick={() => moveLab(-1)} disabled={activeLab === 0}>←</button><span aria-live="polite">0{activeLab + 1} / 05</span><button type="button" aria-label="Next Lab item" onClick={() => moveLab(1)} disabled={activeLab === labItems.length - 1}>→</button></div></div><div className="labs-carousel-stage" role="region" aria-label="Builstry Lab items">{labItems.map(([number, title, text], index) => <article key={number} className={`lab-slide ${index === activeLab ? "is-active" : ""}`} aria-hidden={index !== activeLab} style={{ "--lab-offset": index - activeLab }}><span className="lab-slide-number">{number} / 05</span><div className="lab-slide-art" aria-hidden="true" /><div className="lab-slide-copy"><h3>{title}</h3><p>{text}</p><span className="lab-slide-arrow" aria-hidden="true">→</span></div></article>)}</div><div className="labs-progress" aria-hidden="true">{labItems.map(([number], index) => <i className={index === activeLab ? "is-active" : ""} key={number} />)}</div></article>;
}

export default function Home() {
  const heroRef = useRef(null);
  const approachRef = useRef(null);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [approachProgress, setApproachProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [ctaMode, setCtaMode] = useState(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    let raf = 0;
    const updateHeroParallax = () => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(0, Math.min(110, -rect.top * 0.08));
      hero.style.setProperty("--hero-scroll-y", `${travel.toFixed(2)}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(updateHeroParallax); };
    updateHeroParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const section = approachRef.current;
    if (!section) return undefined;
    let raf = 0;
    const measureApproach = () => {
      const track = section.querySelector(".approach-track");
      const windowEl = section.querySelector(".approach-window");
      if (!track || !windowEl) return;
      const firstCard = track.querySelector(".step");
      const cardWidth = firstCard?.getBoundingClientRect().width || 0;
      const cardHeight = firstCard?.getBoundingClientRect().height || 0;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      const sidePad = Math.max(0, (windowEl.clientWidth - cardWidth) / 2);
      track.style.setProperty("--approach-side-pad", `${sidePad}px`);
      track.style.setProperty("--approach-card-width", `${cardWidth}px`);
      track.style.setProperty("--approach-card-height", `${cardHeight}px`);
      track.style.setProperty("--approach-card-shift", `${-(cardWidth + gap)}px`);
      track.style.setProperty("--approach-card-step", `${cardWidth + gap}px`);
      const horizontalTravel = Math.max(0, track.scrollWidth - windowEl.clientWidth);
      // One viewport for the pinned stage plus the measured rail travel and a small final hold.
      const verticalTravel = Math.max(window.innerHeight * 1.10, horizontalTravel * 0.68) + window.innerHeight * 0.08;
      section.style.setProperty("--approach-horizontal-travel", `${horizontalTravel}px`);
      section.style.setProperty("--approach-horizontal-shift", `${-horizontalTravel}px`);
      // The sticky viewport itself occupies one viewport; the measured travel is added on top.
      section.style.setProperty("--approach-scroll-height", `${verticalTravel + window.innerHeight}px`);
    };
    const updateApproach = () => {
      raf = 0;
      measureApproach();
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const settlePhase = 0.14;
      const cardProgress = Math.max(0, Math.min(1, (progress - settlePhase) / (1 - settlePhase)));
      setSectionProgress(progress);
      setApproachProgress(cardProgress);
      setActiveStep(Math.min(steps.length - 1, Math.floor(cardProgress * steps.length)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(updateApproach); };
    updateApproach();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="home-page">
      <section
        ref={heroRef}
        className="hero section editorial-hero"
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          event.currentTarget.style.setProperty("--hero-pointer-x", x.toFixed(3));
          event.currentTarget.style.setProperty("--hero-pointer-y", y.toFixed(3));
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--hero-pointer-x", 0);
          event.currentTarget.style.setProperty("--hero-pointer-y", 0);
        }}
      >
        <div className="hero-copy">
          <div className="eyebrow">
            BUILSTRY / <span>PROBLEM</span> → POSSIBILITY
          </div>
          <h1 className="hero-reveal-title">
            <span><i>WE BUILD</i></span>
            <span><i>WHAT</i></span>
            <span><i><em>SHOULD EXIST.</em></i></span>
          </h1>
          <p className="hero-text">
            We find problems worth solving across industries, businesses and
            products — then turn them into strategies, systems and experiences
            that move things forward.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/about">
              Explore Builstry <span>→</span>
            </Link>
            <Link className="button button-secondary" to="/contact">
              Bring Us a Problem <span>→</span>
            </Link>
          </div>
          <div className="scroll-cue">
            <span className="mouse">↓</span> SCROLL TO EXPLORE
          </div>
        </div>
        <HeroCube />
      </section>

      <section className="section pillars-section">
        <div className="section-heading">
          <h2>
            THREE WAYS WE <em>BUILD</em>
          </h2>
          <p>Each pillar. Equal passion. One purpose.</p>
        </div>
        <div className="pillar-grid">
          {pillars.map((p) => (
            <article className={`pillar-card ${p.cls}`} key={p.n} tabIndex="0" aria-label={`${p.title}: ${p.text}`}>
              <span className="card-number">{p.n}</span>
              <div className="pillar-art" />
              <div className="pillar-content">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link className="round-arrow" to="/capabilities">
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="approach-section approach-redesign" ref={approachRef} style={{ "--approach-card-count": steps.length, "--approach-section-progress": sectionProgress, "--approach-settle": Math.min(1, sectionProgress / 0.14), "--approach-progress": approachProgress, "--approach-active": activeStep }}>
        <div className="approach-stage">
          <div className="approach-intro">
            <span className="approach-kicker">THE PROCESS</span>
            <h2 className="approach-heading">
              <span className="approach-line approach-line-the">THE</span>
              <span className="approach-line approach-line-builstry">BUILSTRY</span>
              <span className="approach-line approach-line-approach">APPROACH</span>
            </h2>
            <p>A clear process. A simple philosophy. Real impact.</p>
            <Link className="text-link" to="/capabilities">
              See Our Process →
            </Link>
            <span className="approach-stage-count" aria-live="polite"><b>0{activeStep + 1}</b> / 06</span>
          </div>
            <div className="approach-window">
            <div className="steps approach-track">
              {steps.map(([n, title, text], index) => (
                <article className={`step ${index === activeStep ? "is-active" : ""}`} key={n} aria-current={index === activeStep ? "step" : undefined} style={{ "--step-index": index }}>
                  <div className="step-topline"><span className="step-icon">{n}</span><i /></div>
                  <div className="step-content">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                  <span className="step-watermark">{n}</span>
                </article>
              ))}
            </div>
            <div className="approach-progress-track"><span /></div>
          </div>
        </div>
      </section>

      <section className="section lower-section">
        <div className="lower-grid">
          <LabsCarousel />
          <IndustriesCarousel />
        </div>
      </section>

      <IntentSection />

      <section className="final-cta">
        <div className="cta-pattern" />
        <div>
          <h2>
            GOT A <em>PROBLEM</em>
            <br />
            WORTH <em>SOLVING?</em>
          </h2>
          <p>Let's figure out what should exist.</p>
        </div>
        <div className="final-cta-actions"><button type="button" className="button button-primary" onClick={() => setCtaMode("inquiry")}>Start a Conversation <span>→</span></button><button type="button" className="button button-secondary" onClick={() => setCtaMode("booking")}>Book a Call <span>→</span></button></div>
      </section>
      {ctaMode && <CtaModal mode={ctaMode} onClose={() => setCtaMode(null)} />}
    </div>
  );
}
