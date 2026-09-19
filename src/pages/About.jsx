import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AboutHeroVisual from "../components/about/AboutHeroVisual";

import "../components/about/AboutHeroVisual.css";
import "./About.css";
import "./AboutEnhancements.css";
import "./AboutApproachRefinement.css";

const stages = [
  ["01", "PROBLEM", "Real problems exist everywhere.", "⌕"],
  ["02", "UNDERSTANDING", "We dig deep to see what's true.", "♧"],
  ["03", "STRATEGY", "We reframe and find the right way.", "↗"],
  ["04", "CREATION", "We build systems, products and experiences.", "◇"],
  ["05", "IMPACT", "We create value that moves people forward.", "◎"],
];

const philosophy = [
  ["01", "?", "QUESTION THE OBVIOUS", "The accepted way isn't necessarily the right way."],
  ["02", "◉", "UNDERSTAND BEFORE SOLVING", "A solution without understanding is just an assumption."],
  ["03", "◇", "SIMPLIFY THE COMPLEX", "Good products don't make people work harder to understand."],
  ["04", "⌁", "BUILD FOR REALITY", "Ideas matter only when they survive contact with the real world."],
];

const directions = [
  ["01", "INDUSTRY SOLUTIONS", "We find problems worth solving across industries and build solutions that create real impact.", "industry"],
  ["02", "BUSINESS & PRODUCT STRATEGY", "We help businesses and products reach their true potential with the right strategy, systems and execution.", "strategy"],
  ["03", "INNOVATION & COMMUNITY", "We create platforms for ideas, run hackathons, empower students and inspire the next generation of builders.", "community"],
];

const thinking = [
  ["01", "CURIOUS", "We ask questions before making assumptions.", "⌕"],
  ["02", "RESTLESS", "We don't accept that 'that's how it's always been done.'", "ϟ"],
  ["03", "PRACTICAL", "A beautiful idea means little if it cannot work.", "⚒"],
  ["04", "EXPERIMENTAL", "We prototype, test and learn continuously.", "⚗"],
  ["05", "LONG-TERM", "We care about what happens after launch.", "↗"],
];

const people = [
  ["MUKESHKUMAR", "Founder & Product Strategist", "Problem finder, product thinker. Builder at heart.", "MK"],
  ["ROWFIN", "Co-founder & Growth", "Turns ideas into momentum and connects the dots.", "R"],
  ["DESIGN PARTNER", "Experience & Interface", "Designs clarity into every interaction.", "DP"],
  ["TECH PARTNER", "Engineering & Systems", "Builds robust systems that scale.", "TP"],
];

const teamPillars = [
  ["⌁", "FOUNDERS", "Vision & leadership"],
  ["◇", "STUDENTS", "Ideas & energy"],
  ["□", "BUILDERS", "Code & craft"],
  ["✦", "DESIGNERS", "Experience & aesthetics"],
  ["♧", "MENTORS", "Guidance & wisdom"],
  ["↗", "PARTNERS", "Scale & reach"],
];

const milestones = [
  ["2024", "Builstry begins."],
  ["2024", "First problems we chose to solve."],
  ["2025", "First solutions built and launched."],
  ["2025", "First businesses we partnered with."],
  ["2026", "First hackathons and community."],
  ["2026+", "Many more problems to solve. Many more to build."],
];

function useAboutMotion() {
  useEffect(() => {
    const page = document.querySelector(".about-page");
    if (!page) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      page.style.setProperty("--scroll-progress", max > 0 ? `${window.scrollY / max}` : "0");
      const directions = page.querySelector(".directions-section");
      if (directions) {
        const rect = directions.getBoundingClientRect();
        const progress = reducedMotion ? 0.5 : Math.max(0, Math.min(1, (window.innerHeight * 0.78 - rect.top) / Math.max(1, rect.height * 0.72)));
        directions.style.setProperty("--directions-progress", progress.toFixed(3));
        directions.querySelectorAll(".direction-card").forEach((card, index) => {
          const center = (index - 1) * 0.28;
          const distance = progress - (0.5 + center);
          const y = reducedMotion ? 0 : distance * -92;
          const rotate = reducedMotion ? (index - 1) * 3 : (index - 1) * 4 - distance * 5;
          const scale = reducedMotion ? 0.96 : 0.94 + Math.max(0, 1 - Math.abs(distance) * 1.8) * 0.06;
          card.style.setProperty("--direction-y", `${y.toFixed(2)}px`);
          card.style.setProperty("--direction-rotate", `${rotate.toFixed(2)}deg`);
          card.style.setProperty("--direction-scale", scale.toFixed(3));
          card.style.setProperty("--direction-depth", `${Math.round((1 - Math.abs(distance)) * 30)}px`);
        });
      }
      const journey = page.querySelector(".journey-section");
      if (journey) {
        const rect = journey.getBoundingClientRect();
        const local = Math.max(0, Math.min(1, (window.innerHeight * .78 - rect.top) / Math.max(1, rect.height + window.innerHeight * .22)));
        journey.style.setProperty("--journey-progress", local.toFixed(3));
      }
    };

    let animationFrame = 0;
    const handleScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateProgress();
      });
    };
    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("timeline")) entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );

    page.querySelectorAll("[data-reveal], .timeline").forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);
}

export default function About() {
  useAboutMotion();
  const [activeStage, setActiveStage] = useState(0);
  const [activeDirection, setActiveDirection] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % stages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  const moveCarousel = (index) => {
    setActiveStage(Math.max(0, Math.min(stages.length - 1, index)));
  };

  const handleCarouselKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveCarousel(activeStage - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveCarousel(activeStage + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      moveCarousel(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      moveCarousel(stages.length - 1);
    }
  };

  const handlePointerDown = (event) => {
    setDragStart(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (dragStart === null) return;
    const distance = event.clientX - dragStart;
    if (Math.abs(distance) > 42) moveCarousel(activeStage + (distance < 0 ? 1 : -1));
    setDragStart(null);
  };

  const selectDirection = (index) => {
    setActiveDirection((current) => (current === index ? null : index));
  };

  return (
    <main className="about-page about-editorial">
      <div className="about-scroll-progress" aria-hidden="true"><span /></div>

      <section className="about-hero" data-reveal>
        <div className="about-hero-copy">
          <div className="about-breadcrumb"><span>BUILSTRY</span><b>/</b><strong>ABOUT</strong></div>
          <h1 className="manifesto-title"><span>WE DIDN'T START WITH A COMPANY.</span><span><em>WE STARTED WITH A WAY OF LOOKING AT PROBLEMS.</em></span></h1>
          <p>We believe meaningful things are built when people question what already exists, understand what isn't working, and create what should come next.</p>
        </div>
        <div className="about-hero-art"><AboutHeroVisual /><div className="hero-art-label">THINK → BUILD → IMPACT</div></div>
      </section>

      <section className="about-section why-section" data-reveal>
        <div className="why-copy"><span className="section-kicker">THE FOUNDATION</span><h2>WHY <em>BUILSTRY</em> EXISTS</h2><p>Technology is advancing faster than ever. But technology alone doesn't make something valuable.</p><p>The valuable part is knowing what deserves to be built, why it matters, and how to make it work.</p><p>Builstry brings those stages together.</p><div className="why-carousel-status"><b>{String(activeStage + 1).padStart(2, "0")}</b><span>/ 05</span></div></div>
        <div className="why-fan" data-reveal><div className="why-fan-stage" tabIndex="0" role="region" aria-roledescription="carousel" aria-label="Why Builstry stages" onKeyDown={handleCarouselKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => setDragStart(null)}>{stages.map(([number, title, text, icon], index) => { const offset = index - activeStage; const position = offset < -1 ? "far-left" : offset > 1 ? "far-right" : offset === -1 ? "left-1" : offset === 0 ? "active" : "right-1"; return <button type="button" className={`fan-card ${position}`} key={title} onClick={() => moveCarousel(index)} aria-label={`Show ${title}`} aria-current={index === activeStage ? "true" : undefined}><span className="stage-index">{number}</span><span className="stage-icon">{icon}</span><span className="fan-card-copy"><b>{title}</b><small>{text}</small></span><span className="stage-card-footer">BUILSTRY / {number}</span></button>; })}</div><div className="why-fan-controls"><button type="button" onClick={() => moveCarousel(activeStage - 1)} disabled={activeStage === 0} aria-label="Previous stage">←</button><div className="why-fan-progress">{stages.map(([number], index) => <i className={index === activeStage ? "is-active" : ""} key={number} />)}</div><button type="button" onClick={() => moveCarousel(activeStage + 1)} disabled={activeStage === stages.length - 1} aria-label="Next stage">→</button></div></div>
      </section>

      <section className="about-section philosophy-section" data-reveal>
        <div className="center-heading"><span>OUR</span> PHILOSOPHY<i /></div>
        <div className="philosophy-grid">{philosophy.map(([number, icon, title, text], index) => <article className="philosophy-item" key={number} style={{ "--delay": `${index * 90}ms` }} data-reveal><span className="philosophy-number">{number}</span><div className="philosophy-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="about-section directions-section" data-reveal>
        <div className="section-title"><span className="section-kicker">HOW WE TURN BELIEF INTO MOTION</span><h2>THREE DIRECTIONS. <em>ONE BELIEF.</em></h2></div>
        <div className={`directions-grid ${activeDirection !== null ? "has-selection" : ""}`} data-selected={activeDirection === null ? "none" : activeDirection + 1} onClick={(event) => { if (event.target === event.currentTarget) setActiveDirection(null); }}>
          {directions.map(([number, title, text, visual], index) => <article className={`direction-card ${visual} ${activeDirection === index ? "is-selected" : ""} ${activeDirection !== null && activeDirection !== index ? "is-dimmed" : ""}`} key={number} style={{ "--delay": `${index * 100}ms`, "--direction-index": index }} data-reveal role="button" tabIndex="0" aria-pressed={activeDirection === index} onClick={() => selectDirection(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDirection(index); } }}><div className="direction-visual" aria-hidden="true"><span /><span /><span /></div><div className="direction-content"><span>{number}</span><h3>{title}</h3><p>{text}</p><span className="circle-link" aria-hidden="true">→</span></div></article>)}
        </div>
        <Link to="/capabilities" className="about-link">Explore what we do →</Link>
      </section>

      <section className="about-section thinking-section" data-reveal>
        <div className="thinking-intro"><span className="section-kicker">THE MINDSET</span><h2>HOW<br />WE <em>THINK</em></h2><p>Our mindset shapes everything we build.</p></div>
        <div className="thinking-grid">{thinking.map(([number, title, text, icon], index) => <article className="thinking-item" key={number} style={{ "--delay": `${index * 80}ms` }} data-reveal><span>{icon}</span><small>{number}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="about-section people-section" data-reveal>
        <div className="people-intro"><span className="section-kicker">WHO BUILDS IT</span><h2>THE PEOPLE<br />BEHIND <em>BUILSTRY</em></h2><p>A small team with a big mission. Driven by curiosity, craft and conviction.</p><Link to="/careers" className="about-link">Join our journey →</Link></div>
        <div className="people-grid">{people.map(([name, role, bio, initials], index) => <article className="person-card" key={name} style={{ "--delay": `${index * 90}ms` }} data-reveal><div className="person-photo"><span>{initials}</span></div><div className="person-info"><h3>{name}</h3><b>{role}</b><p>{bio}</p><span className="person-social">in</span></div></article>)}</div>
      </section>

      <section className="about-section team-section" data-reveal><div className="team-intro"><span className="section-kicker">THE NETWORK</span><h2>BUILSTRY IS<br /><em>BIGGER THAN</em><br />ITS TEAM.</h2><p>We work with founders, mentors, researchers, students and partners.</p></div><div className="team-grid">{teamPillars.map(([icon, title, text], index) => <article key={title} style={{ "--delay": `${index * 70}ms` }} data-reveal><span>{icon}</span><b>{title}</b><small>{text}</small></article>)}</div></section>

      <section className="about-section journey-section" data-reveal><div className="refuse-panel"><span className="section-kicker">OUR STANDARD</span><h2>WHAT WE <em>REFUSE</em><br />TO COMPROMISE ON</h2><ul><li>Clarity over complexity.</li><li>Evidence over assumptions.</li><li>Useful over impressive.</li><li>Long-term value over short-term noise.</li><li>Building over talking.</li></ul></div><div className="journey-panel"><span className="section-kicker">THE MILESTONES</span><h2>OUR <em>JOURNEY</em> SO FAR</h2><svg className="journey-path" viewBox="0 0 100 520" preserveAspectRatio="none" aria-hidden="true"><path d="M50 0 C18 72 82 132 50 210 S82 348 50 520" /></svg><div className="timeline">{milestones.map(([year, text], index) => <article key={`${year}-${index}`} style={{ "--delay": `${index * 90}ms` }} data-reveal><span className="timeline-dot" /><b>{year}</b><p>{text}</p></article>)}</div></div></section>

      <section className="about-final-cta" data-reveal><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>BELIEVE SOMETHING<br /><em>SHOULD EXIST?</em></h2><p>Let's build it together.</p><div className="about-cta-actions"><Link to="/contact" className="button button-primary">Start a Conversation <span>→</span></Link><Link to="/capabilities" className="button about-outline-button">Explore What We Do <span>→</span></Link></div></div><div className="cta-mountain-art" aria-hidden="true"><div className="cta-sun" /><div className="cta-person" /><div className="cta-horizon" /></div></section>
    </main>
  );
}
