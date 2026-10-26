"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./RouterLink";
import ProblemCTA from "./ProblemCTA";
import ApproachSection from "./ApproachSection";
import { NetworkShowcaseSection, PrinciplesShowcaseSection } from "./AboutReferenceShowcaseSections";
import { MindsetInMotionSection } from "./MindsetInMotionSection";
import { OurJourneySection } from "./OurJourneySection";
import "./MindsetInMotionSection.css";
import "./OurJourneySection.css";
import "./AboutReferenceShowcaseSections.css";
import "./ApproachSection.css";
import "./AboutBackgroundRhythm.css";
import "./AboutPrinciplesOrbit.css";
import "./AboutPeopleReference.css";

const stages = [["01", "PROBLEM", "Real problems exist everywhere.", "⌕"], ["02", "UNDERSTANDING", "We dig deep to see what's true.", "♧"], ["03", "STRATEGY", "We reframe and find the right way.", "↗"], ["04", "CREATION", "We build systems, products and experiences.", "◇"], ["05", "IMPACT", "We create value that moves people forward.", "◎"]];
const directions = [["01", "INDUSTRY SOLUTIONS", "We find problems worth solving across industries and build solutions that create real impact.", "industry"], ["02", "BUSINESS & PRODUCT STRATEGY", "We help businesses and products reach their true potential with the right strategy, systems and execution.", "strategy"], ["03", "INNOVATION & COMMUNITY", "We create platforms for ideas, run hackathons, empower students and inspire the next generation of builders.", "community"]];
const people = [["MUKESHKUMAR", "Founder & Product Strategist", "Problem finder, product thinker. Builder at heart.", "MK", "/assets/people/mukeshkumar-profile.png"], ["ROWFIN", "Co-founder & Growth", "Turns ideas into momentum and connects the dots.", "R", "/assets/people/rowfin-profile.png"], ["DESIGN PARTNER", "Experience & Interface", "Designs clarity into every interaction.", "DP", "/assets/people/design-partner-profile.png"], ["TECH PARTNER", "Engineering & Systems", "Builds robust systems that scale.", "TP", "/assets/people/tech-partner-profile.png"]];
const isMobileViewport = () => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

export default function AboutReferencePage() {
  const [activeStage, setActiveStage] = useState(0), [activeDirection, setActiveDirection] = useState(null), [activePerson, setActivePerson] = useState(() => isMobileViewport() ? 0 : 1), [hoveredPerson, setHoveredPerson] = useState(null), [isMobileView, setIsMobileView] = useState(isMobileViewport);
  const whyRef = useRef(null);
  const whyStageRef = useRef(null);
  const fanStageRef = useRef(null);
  const stagePointerRef = useRef(null);
  const suppressStageClickRef = useRef(false);
  const suppressStageClickTimerRef = useRef(0);
  const peopleGridRef = useRef(null);
  const peoplePointerRef = useRef(null);
  const suppressPeopleClickRef = useRef(false);
  const suppressPeopleClickTimerRef = useRef(0);
  const activePersonRef = useRef(activePerson);
  activePersonRef.current = activePerson;
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => {
      setIsMobileView(mobile.matches);
      setActivePerson(mobile.matches ? 0 : 1);
      setHoveredPerson(null);
    };
    mobile.addEventListener?.("change", updateViewport);
    return () => mobile.removeEventListener?.("change", updateViewport);
  }, []);
  useEffect(() => {
    if (!isMobileView) return undefined;
    const grid = document.querySelector(".about-website-reference > .about-ref-people .about-ref-people-grid");
    if (!grid) return undefined;
    peopleGridRef.current = grid;
    grid.addEventListener("pointerdown", startPeoplePointer);
    grid.addEventListener("pointermove", movePeoplePointer);
    grid.addEventListener("pointerup", finishPeoplePointer);
    grid.addEventListener("pointercancel", cancelPeoplePointer);
    grid.addEventListener("lostpointercapture", cancelPeoplePointer);
    grid.addEventListener("click", handlePeopleClickCapture, true);
    return () => {
      grid.removeEventListener("pointerdown", startPeoplePointer);
      grid.removeEventListener("pointermove", movePeoplePointer);
      grid.removeEventListener("pointerup", finishPeoplePointer);
      grid.removeEventListener("pointercancel", cancelPeoplePointer);
      grid.removeEventListener("lostpointercapture", cancelPeoplePointer);
      grid.removeEventListener("click", handlePeopleClickCapture, true);
      peopleGridRef.current = null;
      grid.classList.remove("is-dragging");
    };
  }, [isMobileView]);
  useEffect(() => {
    const section = whyRef.current;
    const stage = whyStageRef.current;
    if (!section || !stage) return undefined;
    const mobile = window.matchMedia("(max-width: 760px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (stagePointerRef.current?.dragging) return;
      const range = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      const index = mobile.matches
        ? Math.min(stages.length - 1, Math.floor(progress * stages.length))
        : Math.min(stages.length - 1, Math.round(progress * (stages.length - 1)));
      setActiveStage((current) => current === index ? current : index);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      const scrollSteps = mobile.matches ? stages.length : stages.length - 1;
      section.style.height = `${stage.getBoundingClientRect().height + window.innerHeight * scrollSteps}px`;
      scheduleUpdate();
    };
    const onViewportChange = () => {
      if (mobile.matches) moveStage(0);
      measure();
    };
    const observer = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    observer?.observe(stage);
    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.visualViewport?.addEventListener("resize", measure, { passive: true });
    mobile.addEventListener?.("change", onViewportChange);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      mobile.removeEventListener?.("change", onViewportChange);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (suppressStageClickTimerRef.current) window.clearTimeout(suppressStageClickTimerRef.current);
      section.style.removeProperty("height");
      if (suppressPeopleClickTimerRef.current) window.clearTimeout(suppressPeopleClickTimerRef.current);
    };
  }, []);
  const moveStage = (index) => setActiveStage(Math.max(0, Math.min(stages.length - 1, index)));
  const syncStageScroll = (index) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    const section = whyRef.current;
    const stage = whyStageRef.current;
    if (!section || !stage) return;
    const range = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = index / (stages.length - 1);
    window.scrollTo({ top: sectionTop + range * progress, behavior: "auto" });
  };
  const startStagePointer = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    stagePointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startIndex: activeStage,
      currentIndex: activeStage,
      dragging: false,
    };
  };
  const moveStagePointer = (event) => {
    const gesture = stagePointerRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) return;
      gesture.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
    }
    event.preventDefault();
    const steps = Math.trunc(-deltaX / 58);
    gesture.currentIndex = Math.max(0, Math.min(stages.length - 1, gesture.startIndex + steps));
    moveStage(gesture.currentIndex);
  };
  const finishStagePointer = (event) => {
    const gesture = stagePointerRef.current;
    if (!gesture || (event && gesture.pointerId !== event.pointerId)) return;
    stagePointerRef.current = null;
    fanStageRef.current?.classList.remove("is-dragging");
    if (gesture.dragging) {
      suppressStageClickRef.current = true;
      if (suppressStageClickTimerRef.current) window.clearTimeout(suppressStageClickTimerRef.current);
      suppressStageClickTimerRef.current = window.setTimeout(() => {
        suppressStageClickRef.current = false;
        suppressStageClickTimerRef.current = 0;
      }, 0);
      if (gesture.currentIndex !== gesture.startIndex) syncStageScroll(gesture.currentIndex);
    }
  };
  const cancelStagePointer = (event) => {
    const gesture = stagePointerRef.current;
    if (!gesture || (event && gesture.pointerId !== event.pointerId)) return;
    stagePointerRef.current = null;
    fanStageRef.current?.classList.remove("is-dragging");
    if (gesture.dragging) moveStage(gesture.startIndex);
  };
  const leaveStagePointer = () => {
    if (!stagePointerRef.current?.dragging) stagePointerRef.current = null;
  };
  const handleStageClickCapture = (event) => {
    if (!suppressStageClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressStageClickRef.current = false;
    if (suppressStageClickTimerRef.current) window.clearTimeout(suppressStageClickTimerRef.current);
    suppressStageClickTimerRef.current = 0;
  };
  const startPeoplePointer = (event) => {
    if (!isMobileView || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    peoplePointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startIndex: activePersonRef.current,
      currentIndex: activePersonRef.current,
      dragging: false,
    };
  };
  const movePeoplePointer = (event) => {
    const gesture = peoplePointerRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.abs(deltaX) < 10 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
      gesture.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
    }
    event.preventDefault();
    gesture.currentIndex = Math.max(0, Math.min(people.length - 1, gesture.startIndex + Math.trunc(-deltaX / 52)));
    setActivePerson(gesture.currentIndex);
  };
  const finishPeoplePointer = (event) => {
    const gesture = peoplePointerRef.current;
    if (!gesture || (event && gesture.pointerId !== event.pointerId)) return;
    peoplePointerRef.current = null;
    peopleGridRef.current?.classList.remove("is-dragging");
    if (gesture.dragging) {
      suppressPeopleClickRef.current = true;
      if (suppressPeopleClickTimerRef.current) window.clearTimeout(suppressPeopleClickTimerRef.current);
      suppressPeopleClickTimerRef.current = window.setTimeout(() => {
        suppressPeopleClickRef.current = false;
        suppressPeopleClickTimerRef.current = 0;
      }, 0);
    }
  };
  const cancelPeoplePointer = (event) => {
    const gesture = peoplePointerRef.current;
    if (!gesture || (event && gesture.pointerId !== event.pointerId)) return;
    peoplePointerRef.current = null;
    peopleGridRef.current?.classList.remove("is-dragging");
    if (gesture.dragging) setActivePerson(gesture.startIndex);
  };
  const handlePeopleClickCapture = (event) => {
    if (!suppressPeopleClickRef.current && event.detail === 0) return;
    event.preventDefault();
    event.stopPropagation();
    suppressPeopleClickRef.current = false;
    if (suppressPeopleClickTimerRef.current) window.clearTimeout(suppressPeopleClickTimerRef.current);
    suppressPeopleClickTimerRef.current = 0;
  };
  const keyStage = (event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) event.preventDefault(); if (event.key === "ArrowLeft") moveStage(activeStage - 1); if (event.key === "ArrowRight") moveStage(activeStage + 1); if (event.key === "Home") moveStage(0); if (event.key === "End") moveStage(stages.length - 1); };
  const selectDirection = (index) => setActiveDirection((current) => current === index ? null : index);
  const activePersonIndex = isMobileView ? activePerson : hoveredPerson ?? activePerson;
  return <main className="about-reference-page about-website-reference">
    <section className="about-ref-hero"><div className="about-ref-hero-copy"><h1><span className="primary">WE DIDN&apos;T</span><span className="primary">START</span><span className="primary">WITH A</span><span className="primary">COMPANY.</span><span className="accent">WE STARTED</span><span className="accent">WITH A</span><span className="accent">WAY OF</span><span className="accent">LOOKING AT</span><span className="accent">PROBLEMS.</span></h1><p>We believe meaningful things are built when people question what already exists, understand what isn&apos;t working, and create what should come next.</p></div></section>
    <section ref={whyRef} className="about-ref-why">
      <div className="about-ref-why-stage" ref={whyStageRef}>
        <div className="about-ref-why-copy"><h2 className="about-section-heading about-why-heading"><span className="about-heading-line about-heading-primary">WHY</span><span className="about-heading-line about-heading-accent">BUILSTRY</span><span className="about-heading-line about-heading-primary">EXISTS.</span></h2><p>Technology is advancing faster than ever. But technology alone doesn&apos;t make something valuable.</p><p>The valuable part is knowing what deserves to be built, why it matters, and how to make it work.</p><p>Builstry brings those stages together.</p><div className="about-ref-status" aria-live="polite"><b>{String(activeStage + 1).padStart(2, "0")}</b><span>/ 05</span></div></div>
        <div className="about-ref-fan"><div className="about-ref-fan-stage" ref={fanStageRef} tabIndex="0" role="region" aria-label="Why Builstry stages" onKeyDown={keyStage} onPointerDown={startStagePointer} onPointerMove={moveStagePointer} onPointerUp={finishStagePointer} onPointerCancel={cancelStagePointer} onLostPointerCapture={cancelStagePointer} onPointerLeave={leaveStagePointer} onDragStart={(event) => event.preventDefault()} onClickCapture={handleStageClickCapture}>{stages.map(([number, title, text, icon], index) => { const offset = index - activeStage; const position = offset < -1 ? "far-left" : offset > 1 ? "far-right" : offset === -1 ? "left-1" : offset === 0 ? "active" : "right-1"; return <button type="button" className={`about-ref-fan-card ${position}`} key={title} onClick={(event) => { if (!isMobileView || event.detail === 0) moveStage(index); }} aria-label={`Show ${title}`} aria-current={index === activeStage ? "true" : undefined}><span className="about-ref-stage-index">{number}</span><span className="about-ref-stage-icon">{icon}</span><span className="about-ref-fan-copy"><b>{title}</b><small>{text}</small></span><span className="about-ref-stage-footer">BUILSTRY / {number}</span></button>; })}</div></div>
      </div>
    </section>
    <ApproachSection />
    <section className="about-ref-directions"><div className="about-ref-section-title"><span className="about-ref-kicker">HOW WE TURN BELIEF INTO MOTION</span><h2 className="about-section-heading about-directions-heading"><span className="about-heading-line about-heading-primary">THREE</span><span className="about-heading-line about-heading-primary">DIRECTIONS.</span><span className="about-heading-line about-heading-accent">ONE</span><span className="about-heading-line about-heading-accent">BELIEF.</span></h2></div><div className="about-ref-directions-grid has-selection" data-selected={activeDirection === null ? 0 : activeDirection + 1}>{directions.map(([number, title, text, visual], index) => <article className={`about-ref-direction-card ${visual} ${activeDirection === index ? "is-selected" : activeDirection !== null ? "is-dimmed" : ""}`} key={number} role="button" tabIndex="0" onClick={() => selectDirection(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDirection(index); } }}><div className="about-ref-direction-visual"><span /><span /><span /></div><div className="about-ref-direction-content"><span>{number}</span><h3>{title}</h3><p>{text}</p><span className="about-ref-circle-link">→</span></div></article>)}</div><Link href="/capabilities" className="about-ref-link">Explore what we do →</Link></section>
    <MindsetInMotionSection />
    <section className="about-ref-people"><div className="about-ref-people-intro"><span className="about-ref-kicker">WHO BUILDS IT</span><h2 className="about-section-heading about-people-heading"><span className="about-heading-line about-heading-primary">THE</span><span className="about-heading-line about-heading-primary">PEOPLE</span><span className="about-heading-line about-heading-primary">BEHIND</span><span className="about-heading-line about-heading-accent">BUILSTRY.</span></h2><p>A small team with a big mission. Driven by curiosity, craft and conviction, we turn ideas into meaningful products.</p><Link href="/careers" className="about-ref-link">Join our journey →</Link><div className="about-ref-people-stats"><span><b>4</b><small>CORE<br />MEMBERS</small></span><span><b>∞</b><small>BIG<br />IDEAS</small></span><span><b>1</b><small>SHARED<br />MISSION</small></span></div></div><div className="about-ref-people-showcase"><div className="about-ref-people-grid">{people.map(([name, role, bio, initials, image], index) => <article className={activePersonIndex === index ? "is-active" : ""} key={name} tabIndex="0" onMouseEnter={() => setHoveredPerson(index)} onMouseLeave={() => setHoveredPerson(null)} onFocus={() => setHoveredPerson(index)} onBlur={() => setHoveredPerson(null)} onClick={() => setActivePerson(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setActivePerson(index); }}><div className="about-ref-person-photo"><img src={image} alt={`${name} profile portrait`} loading="lazy" /><small>{String(index + 1).padStart(2, "0")}</small><span>{initials}</span></div><div className="about-ref-person-info"><h3>{name}</h3><b>{role}</b><i /><p>{bio}</p><div className="about-ref-person-footer"><span>in</span><span>View Profile →</span></div></div></article>)}</div><div className="about-ref-people-controls"><button type="button" onClick={() => setActivePerson((current) => ((current ?? 0) + people.length - 1) % people.length)}>←</button><div>{people.map(([name], index) => <i className={activePersonIndex === index ? "is-active" : ""} key={name} />)}</div><button type="button" onClick={() => setActivePerson((current) => ((current ?? -1) + 1) % people.length)}>→</button></div><p className="about-ref-people-quote">Great products<br />are built by great people.</p></div></section>
    <NetworkShowcaseSection />
    <PrinciplesShowcaseSection />
    <OurJourneySection />
    <ProblemCTA />
  </main>;
}
