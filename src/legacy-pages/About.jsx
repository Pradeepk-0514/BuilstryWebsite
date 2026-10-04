import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AboutHeroVisual from "../components/about/AboutHeroVisual";

import "../components/about/AboutHeroVisual.css";
import "./About.css";
import "./AboutEnhancements.css";
import "./AboutApproachRefinement.css";
import "./AboutDirectionsFinal.css";
import "./AboutThinkingFinal.css";
import "./AboutPeopleFinal.css";
import "./AboutNetworkFinal.css";
import "./AboutStandardsFinal.css";

const stages = [
  ["01", "PROBLEM", "Real problems exist everywhere.", "⌕"],
  ["02", "UNDERSTANDING", "We dig deep to see what's true.", "♧"],
  ["03", "STRATEGY", "We reframe and find the right way.", "↗"],
  ["04", "CREATION", "We build systems, products and experiences.", "◇"],
  ["05", "IMPACT", "We create value that moves people forward.", "◎"],
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

const peopleImages = [
  "/assets/people/mukeshkumar-profile.png",
  "/assets/people/rowfin-profile.png",
  "/assets/people/design-partner-profile.png",
  "/assets/people/tech-partner-profile.png",
];

const teamPillars = [
  ["⌁", "FOUNDERS", "Vision & leadership"],
  ["◇", "STUDENTS", "Ideas & energy"],
  ["□", "BUILDERS", "Code & craft"],
  ["✦", "DESIGNERS", "Experience & aesthetics"],
  ["♧", "MENTORS & PARTNERS", "Guidance & reach"],
];

const milestones = [
  ["2024", "Builstry begins."],
  ["2024", "First problems we chose to solve."],
  ["2025", "First solutions built and launched."],
  ["2025", "First businesses we partnered with."],
  ["2026", "First hackathons and community."],
  ["2026+", "Many more problems to solve. Many more to build."],
];

const milestoneIcons = ["⌁", "◇", "□", "✦", "♧", "◎"];

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
  const [activeThinking, setActiveThinking] = useState(null);
  const [hoveredThinking, setHoveredThinking] = useState(null);
  const [activePerson, setActivePerson] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const whySectionRef = useRef(null);

  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    let sectionIsVisible = false;
    let userIsScrolling = false;
    let autoTimer = 0;
    let idleTimer = 0;

    const clearAutoTimer = () => {
      if (autoTimer) {
        window.clearTimeout(autoTimer);
        autoTimer = 0;
      }
    };

    const clearIdleTimer = () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
        idleTimer = 0;
      }
    };

    const scheduleAutoStep = () => {
      if (!sectionIsVisible || userIsScrolling || autoTimer) return;
      autoTimer = window.setTimeout(() => {
        autoTimer = 0;
        if (!sectionIsVisible || userIsScrolling) return;
        setActiveStage((current) => (current + 1) % stages.length);
        scheduleAutoStep();
      }, 3200);
    };

    const scheduleAutoScroll = () => {
      clearIdleTimer();
      if (!sectionIsVisible || userIsScrolling) return;
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        scheduleAutoStep();
      }, 1500);
    };

    const handleScroll = () => {
      userIsScrolling = true;
      clearAutoTimer();
      clearIdleTimer();
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        userIsScrolling = false;
        scheduleAutoStep();
      }, 1500);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.82;
        if (!sectionIsVisible) {
          clearAutoTimer();
          clearIdleTimer();
        } else if (!userIsScrolling) {
          scheduleAutoScroll();
        }
      },
      { threshold: [0, 0.82, 1] },
    );

    observer.observe(section);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearAutoTimer();
      clearIdleTimer();
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
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

  const focusedDirection = activeDirection;

  return (
    <main className="about-page about-editorial">
      <div className="about-scroll-progress" aria-hidden="true"><span /></div>

      <section className="about-hero" data-reveal>
        <div className="about-hero-copy">
          <h1 className="manifesto-title"><span>WE DIDN'T START WITH A COMPANY.</span><span><em>WE STARTED WITH A WAY OF LOOKING AT PROBLEMS.</em></span></h1>
          <p>We believe meaningful things are built when people question what already exists, understand what isn't working, and create what should come next.</p>
        </div>
        <div className="about-hero-art"><AboutHeroVisual /><div className="hero-art-label">THINK → BUILD → IMPACT</div></div>
      </section>

      <section ref={whySectionRef} className="about-section why-section" data-reveal>
        <div className="why-copy"><h2>WHY <em>BUILSTRY</em> EXISTS</h2><p>Technology is advancing faster than ever. But technology alone doesn't make something valuable.</p><p>The valuable part is knowing what deserves to be built, why it matters, and how to make it work.</p><p>Builstry brings those stages together.</p><div className="why-carousel-status"><b>{String(activeStage + 1).padStart(2, "0")}</b><span>/ 05</span></div></div>
        <div className="why-fan" data-reveal><div className="why-fan-stage" tabIndex="0" role="region" aria-roledescription="carousel" aria-label="Why Builstry stages" onKeyDown={handleCarouselKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => setDragStart(null)}>{stages.map(([number, title, text, icon], index) => { const offset = index - activeStage; const position = offset < -1 ? "far-left" : offset > 1 ? "far-right" : offset === -1 ? "left-1" : offset === 0 ? "active" : "right-1"; return <button type="button" className={`fan-card ${position}`} key={title} onClick={() => moveCarousel(index)} aria-label={`Show ${title}`} aria-current={index === activeStage ? "true" : undefined}><span className="stage-index">{number}</span><span className="stage-icon">{icon}</span><span className="fan-card-copy"><b>{title}</b><small>{text}</small></span><span className="stage-card-footer">BUILSTRY / {number}</span></button>; })}</div><div className="why-fan-controls"><button type="button" onClick={() => moveCarousel(activeStage - 1)} disabled={activeStage === 0} aria-label="Previous stage">←</button><div className="why-fan-progress">{stages.map(([number], index) => <i className={index === activeStage ? "is-active" : ""} key={number} />)}</div><button type="button" onClick={() => moveCarousel(activeStage + 1)} disabled={activeStage === stages.length - 1} aria-label="Next stage">→</button></div></div>
      </section>

      <section className="about-section directions-section" data-reveal>
        <div className="section-title"><span className="section-kicker">HOW WE TURN BELIEF INTO MOTION</span><h2>THREE DIRECTIONS. <em>ONE BELIEF.</em></h2></div>
        <div className="directions-grid has-selection" data-selected={activeDirection === null ? 0 : activeDirection + 1} onClick={(event) => { if (event.target === event.currentTarget) setActiveDirection(null); }}>
          {directions.map(([number, title, text, visual], index) => <article className={`direction-card ${visual} ${activeDirection !== null && focusedDirection === index ? "is-selected" : activeDirection !== null ? "is-dimmed" : ""}`} key={number} style={{ "--delay": `${index * 100}ms`, "--direction-index": index }} data-reveal role="button" tabIndex="0" aria-pressed={activeDirection === index} onClick={() => selectDirection(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDirection(index); } }}><div className="direction-visual" aria-hidden="true"><span /><span /><span /></div><div className="direction-content"><span>{number}</span><h3>{title}</h3><p>{text}</p><span className="circle-link" aria-hidden="true">→</span></div></article>)}
        </div>
        <Link to="/capabilities" className="about-link">Explore what we do →</Link>
      </section>

      <section className="about-section thinking-section" data-reveal>
        <div className="thinking-topline">
          <div className="thinking-intro"><span className="section-kicker">THE MINDSET</span><h2>HOW <em>WE</em> THINK</h2><p>Our mindset shapes everything we build — from the questions we ask to the solutions we create.</p></div>
        </div>
        <div id="thinking-principles" className="thinking-grid">{thinking.map(([number, title, text, icon], index) => { const isThinkingActive = (hoveredThinking ?? activeThinking) === index; return <article className={`thinking-item ${isThinkingActive ? "is-active" : ""}`} key={number} style={{ "--delay": `${index * 80}ms` }} data-reveal role="button" tabIndex="0" aria-pressed={activeThinking === index} onMouseEnter={() => setHoveredThinking(index)} onMouseLeave={() => setHoveredThinking(null)} onFocus={() => setHoveredThinking(index)} onBlur={() => setHoveredThinking(null)} onClick={() => setActiveThinking(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveThinking(index); } }}><div className="thinking-card-head"><span className="thinking-icon" aria-hidden="true">{icon}</span><small>{number}</small></div><h3>{title}</h3><p>{text}</p><div className="thinking-card-footer"><span className="thinking-rule" /><span className="thinking-arrow" aria-hidden="true">→</span></div></article>; })}</div>
      </section>

      <section className="about-section people-section" data-reveal>
        <div className="people-intro"><span className="section-kicker">WHO BUILDS IT</span><h2>THE PEOPLE<br />BEHIND <em>BUILSTRY</em></h2><p>A small team with a big mission. Driven by curiosity, craft and conviction, we turn ideas into meaningful products.</p><Link to="/careers" className="about-link">Join our journey →</Link><div className="people-stats"><span><b>4</b><small>CORE<br />MEMBERS</small></span><span><b>∞</b><small>BIG<br />IDEAS</small></span><span><b>1</b><small>SHARED<br />MISSION</small></span></div></div>
        <div className="people-showcase"><div className="people-grid">{people.map(([name, role, bio, initials], index) => { const isPersonActive = (hoveredPerson ?? activePerson) === index; return <article className={`person-card ${isPersonActive ? "is-active" : ""}`} key={name} style={{ "--delay": `${index * 90}ms` }} role="button" tabIndex="0" aria-pressed={activePerson === index} onMouseEnter={() => setHoveredPerson(index)} onMouseLeave={() => setHoveredPerson(null)} onFocus={() => setHoveredPerson(index)} onBlur={() => setHoveredPerson(null)} onClick={() => setActivePerson(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActivePerson(index); } }}><div className="person-photo"><img src={peopleImages[index]} alt={`${name} profile portrait`} loading="lazy" /><small>{String(index + 1).padStart(2, "0")}</small><span>{initials}</span></div><div className="person-info"><h3>{name}</h3><b>{role}</b><i /><p>{bio}</p><div className="person-footer"><span className="person-social">in</span><span>View Profile →</span></div></div></article>; })}</div><div className="people-controls"><button type="button" aria-label="Previous profile" onClick={() => setActivePerson((current) => ((current ?? 0) + people.length - 1) % people.length)}>←</button><div>{people.map(([name], index) => <i className={(hoveredPerson ?? activePerson) === index ? "is-active" : ""} key={name} />)}</div><button type="button" aria-label="Next profile" onClick={() => setActivePerson((current) => ((current ?? -1) + 1) % people.length)}>→</button></div></div>
      </section>

      <section className="about-section team-section" data-reveal>
        <div className="team-intro">
          <span className="section-kicker">THE NETWORK</span>
          <h2>BUILSTRY<br /><em>IS BIGGER</em><br /><em>THAN</em><br />ITS TEAM</h2>
          <p>We work with founders, mentors, researchers, students and partners to turn bold ideas into real impact.</p>
          <Link to="/careers" className="about-link">Join our journey →</Link>
          <div className="team-intro-rule" aria-hidden="true" /><span className="team-intro-note">MORE PERSPECTIVES.<br />BETTER POSSIBILITIES.</span>
        </div>
        <div className="team-network">
          <div className="team-grid" role="list" aria-label="Builstry network pillars">
            {teamPillars.map(([icon, title, text], index) => <article key={title} style={{ "--delay": `${index * 70}ms` }} data-reveal role="listitem">
              <div className="team-pillar-marker"><small>{String(index + 1).padStart(2, "0")}</small><span className="team-pillar-logo" aria-hidden="true">{icon}</span><span className="team-pillar-dot" aria-hidden="true" /></div>
              <b>{title}</b>
              <em>{text} {index < 4 ? `to ${["spark what's next.", "challenge the status quo.", "turn ideas into reality.", "make it human."][index]}` : "to scale the impact."}</em>
            </article>)}
          </div>
          <div className="team-network-stats" aria-label="Builstry network stats"><span><b>5+</b><small>COMMUNITIES<br />CONNECTED</small></span><span><b>1000+</b><small>IDEAS<br />IN MOTION</small></span><span><b>∞</b><small>BIGGER<br />POSSIBILITIES</small></span><em>TOGETHER WE BUILD WHAT SHOULD EXIST.</em></div>
          <div className="team-network-line" aria-hidden="true"><span /></div>
          <div className="team-network-footer"><span>BUILSTRY</span><i aria-hidden="true" /><span>THINK</span><i aria-hidden="true" /><span>BUILD</span><i aria-hidden="true" /><span>IMPACT</span></div>
        </div>
      </section>

      <section className="about-section journey-section" data-reveal>
        <div className="refuse-panel">
          <div className="refuse-copy">
            <span className="section-kicker">OUR STANDARD</span>
            <h2>WHAT WE<br /><em>REFUSE</em><br />TO COMPROMISE ON.</h2>
            <p>These principles guide every idea, product and partnership we build — now and always.</p>
            <div className="refuse-note"><i aria-hidden="true" />HIGHER STANDARDS.<br />BRIGHTER OUTCOMES.</div>
          </div>
          <div className="refuse-principles" role="list" aria-label="Builstry standards">
            {[
              ["CLARITY", "OVER COMPLEXITY", "We choose simple, clear thinking over unnecessary complexity."],
              ["EVIDENCE", "OVER ASSUMPTIONS", "We rely on what's real, not what's assumed."],
              ["USEFUL", "OVER IMPRESSIVE", "We build what creates real value, not what just looks good."],
              ["LONG-TERM", "OVER SHORT-TERM", "We care about lasting impact, not quick wins."],
              ["BUILDING", "OVER TALKING", "We turn ideas into real solutions."],
            ].map(([title, subtitle, text], index) => <article key={title} role="listitem" data-reveal style={{ "--delay": `${index * 80}ms` }}>
              <div className="refuse-marker"><small>{String(index + 1).padStart(2, "0")}</small><span aria-hidden="true" /></div>
              <b>{title}</b><small>{subtitle}</small><p>{text}</p>
            </article>)}
          </div>
          <div className="refuse-footer"><span>BUILSTRY</span><i aria-hidden="true" /><span>THINK</span><i aria-hidden="true" /><span>BUILD</span><i aria-hidden="true" /><span>IMPACT</span></div>
        </div>
        <div className="journey-panel"><span className="section-kicker">THE MILESTONES</span><h2>OUR <em>JOURNEY</em> SO FAR</h2><svg className="journey-path" viewBox="0 0 100 520" preserveAspectRatio="none" aria-hidden="true"><path d="M50 0 C18 72 82 132 50 210 S82 348 50 520" /></svg><div className="timeline">{milestones.map(([year, text], index) => <article key={`${year}-${index}`} style={{ "--delay": `${index * 90}ms` }} data-reveal><span className="timeline-dot" /><span className="timeline-icon" aria-hidden="true">{milestoneIcons[index]}</span><b>{year}</b><p>{text}</p></article>)}</div></div>
      </section>

      <section className="about-final-cta" data-reveal><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>BELIEVE SOMETHING<br /><em>SHOULD EXIST?</em></h2><p>Let's build it together.</p><div className="about-cta-actions"><Link to="/contact" className="button button-primary">Start a Conversation <span>→</span></Link><Link to="/capabilities" className="button about-outline-button">Explore What We Do <span>→</span></Link></div></div><div className="cta-mountain-art" aria-hidden="true"><div className="cta-sun" /><div className="cta-person" /><div className="cta-horizon" /></div></section>
    </main>
  );
}
