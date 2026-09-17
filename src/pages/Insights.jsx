import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Insights.css";
import "./InsightsEnhancements.css";
import "./InsightsClean2D.css";
import "./InsightsCuriositySection.css";
import "./InsightsEditorialSequence.css";
import "./InsightsOpeningSequence.css";

const labels = {
  broken: "Problems worth understanding before they become expensive.",
  changing: "Signals, shifts and technologies changing the way we build.",
  worth: "Ideas with the potential to become useful, scalable systems.",
  works: "The principles, products and systems that create real value.",
  opportunity: "Gaps where better experiences and smarter systems can win.",
  next: "Emerging ideas, behaviours and technologies to watch next.",
};

const curiosity = [
  ["!", "WHAT'S BROKEN?", "broken"],
  ["↗", "WHAT'S CHANGING?", "changing"],
  ["□", "WHAT'S WORTH BUILDING?", "worth"],
  ["◎", "WHY DOES IT WORK?", "works"],
  ["⌕", "WHERE'S THE OPPORTUNITY?", "opportunity"],
];

const latest = [
  ["PRODUCT TEARDOWN", "Why Notion became more than a productivity tool.", "6 min read", "May 08, 2024", "notion", "/blog/notion", "PRODUCT TEARDOWNS", "Deep dives into products, user experiences and business models.", "Explore Teardowns →", "/blog?topic=teardown"],
  ["FIELD NOTE", "The hidden friction inside India's logistics network.", "4 min read", "May 06, 2024", "logistics", "/blog/logistics", "INDUSTRY INTELLIGENCE", "Research and insights across 12 industries.", "Explore Industries →", "/blog?topic=industry"],
  ["PERSPECTIVE", "Your customers don't care about your technology.", "3 min read", "May 03, 2024", "cube", "/blog/cube", "BUILSTRY PERSPECTIVES", "Short takes on ideas, strategies and the future.", "Explore Perspectives →", "/blog?topic=perspective"],
  ["RESEARCH", "The 2027 AI recruitment landscape.", "18 min read", "Apr 30, 2024", "research", "/blog/research", "BUILSTRY RESEARCH", "Long-form research reports on trends, markets and technologies.", "View Research →", "/blog?topic=research"],
  ["BUILD JOURNAL", "What we learned building our first prototype.", "5 min read", "Apr 28, 2024", "journal", "/blog/journal", "BUILD JOURNAL", "Behind the scenes of what we're building.", "View Journal →", "/blog?topic=journal"],
];

const categories = [
  ["PRODUCT TEARDOWNS", "Deep dives into products, user experiences and business models.", "Explore Teardowns →", "teardown"],
  ["INDUSTRY INTELLIGENCE", "Research and insights across 12 industries.", "Explore Industries →", "industry"],
  ["BUILSTRY PERSPECTIVES", "Short takes on ideas, strategies and the future.", "Explore Perspectives →", "perspective"],
  ["BUILSTRY RESEARCH", "Long-form research reports on trends, markets and technologies.", "View Research →", "book"],
  ["BUILD JOURNAL", "Behind the scenes of what we're building.", "View Journal →", "blueprint"],
];

function SubscribeModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const handleKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return <div className="subscribe-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="subscribe-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-title"><button type="button" className="subscribe-close" onClick={onClose} aria-label="Close subscription form">×</button>{submitted ? <div className="subscribe-success"><span className="insights-eyebrow">BUILSTRY / INSIGHTS</span><h2>You're on the list.</h2><p>We'll share considered ideas, research and perspectives with you.</p><button type="button" className="insight-button" onClick={onClose}>Close <span>→</span></button></div> : <><span className="insights-eyebrow">BUILSTRY / INSIGHTS</span><h2 id="subscribe-title">NEVER STOP <em>QUESTIONING.</em></h2><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>Name <span>(optional)</span><input name="name" autoComplete="name" /></label><label>Email address *<input name="email" type="email" required autoComplete="email" /></label><button type="submit" className="insight-button">Subscribe <span>→</span></button></form></>}</section></div>;
}

export default function Insights() {
  const curiositySectionRef = useRef(null);
  const curiosityRailRef = useRef(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [curiosityIndex, setCuriosityIndex] = useState(0);

  useEffect(() => {
    const section = curiositySectionRef.current;
    const rail = curiosityRailRef.current;
    const track = rail?.querySelector(".curiosity-track");
    if (!section || !rail || !track) return undefined;
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      frame = 0;
      if (window.innerWidth <= 720 || reducedMotion) {
        section.style.removeProperty("height");
        track.style.transform = "none";
        setCuriosityIndex(0);
        return;
      }
      const travel = Math.max(0, track.scrollWidth - rail.clientWidth);
      const releaseDistance = Math.max(window.innerHeight * 2.1, travel * 1.12);
      section.style.height = `${window.innerHeight + releaseDistance}px`;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / releaseDistance));
      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
      setCuriosityIndex(Math.min(curiosity.length - 1, Math.floor(progress * curiosity.length)));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveCuriosityRail = (direction) => {
    const rail = curiosityRailRef.current;
    const firstCard = rail?.querySelector(".curiosity-card");
    if (!rail || !firstCard) return false;

    const step = firstCard.getBoundingClientRect().width;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const nextScroll = Math.max(0, Math.min(maxScroll, rail.scrollLeft + direction * step));
    if (Math.abs(nextScroll - rail.scrollLeft) < 2) return false;

    rail.scrollTo({ left: nextScroll, behavior: "smooth" });
    return true;
  };

  const handleCuriosityKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCuriosityRail(event.key === "ArrowRight" ? 1 : -1);
  };

  return (
    <div className="insights-page">
      <section className="opening-insight-sequence" aria-label="Insights introduction and featured insight">
        <div className="opening-insight-visual" aria-hidden="true">
          <div className="opening-visual-frame">
            <span className="opening-visual-kicker">BUILSTRY / SIGNALS</span>
            <div className="opening-visual-grid" />
            <div className="opening-visual-orbit opening-visual-orbit-one" />
            <div className="opening-visual-orbit opening-visual-orbit-two" />
            <div className="opening-visual-cube"><i /><i /><i /></div>
            <span className="opening-visual-index">01 — 02</span>
          </div>
        </div>
        <div className="opening-insight-copy">
          <article className="opening-insight-panel opening-insight-panel-intro">
            <div className="opening-insight-panel-inner">
              <span className="opening-insight-index">01 / 02</span>
              <div className="insights-eyebrow">BUILSTRY / <span>INSIGHTS</span></div>
              <h1>THINKING<br />BEFORE<br /><em>BUILDING.</em></h1>
              <p>Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next.</p>
            </div>
          </article>
          <article className="opening-insight-panel opening-insight-panel-featured">
            <div className="opening-insight-panel-inner">
              <span className="opening-insight-index">02 / 02</span>
              <span className="insight-tag">FEATURED INSIGHT</span>
              <h2>Why most recruitment systems optimize for volume instead of quality.</h2>
              <p>An in-depth analysis of the hidden flaws in today's hiring systems — and what needs to change.</p>
              <div className="featured-meta"><span>◷ &nbsp;8 min read</span><b>•</b><span>Builstry Research</span></div>
              <Link className="insight-button" to="/blog/recruitment-systems">Read the Insight <span>→</span></Link>
              <span className="opening-insight-category">QUALITY OVER VOLUME <b>SIGNAL 01</b></span>
            </div>
          </article>
        </div>
      </section>

      <section className="insights-container">
                <section className="curiosity-showcase" ref={curiositySectionRef} aria-labelledby="curiosity-title">

          <div className="curiosity-showcase-intro">
            <span className="curiosity-kicker">BUILSTRY / QUESTIONS</span>
            <h2 id="curiosity-title">WHAT ARE<br />YOU <em>CURIOUS</em><br />ABOUT?</h2>
            <div className="curiosity-intro-rule" aria-hidden="true" />
            <p>Ideas worth asking about before they become things worth building.</p>
            <span className="curiosity-scroll-hint">SCROLL TO EXPLORE <b>→</b></span>
            <span className="curiosity-progress" aria-live="polite"><b>0{curiosityIndex + 1}</b> / 05</span>
          </div>
          <div
            className="curiosity-rail"
            ref={curiosityRailRef}
            tabIndex="0"
            role="region"
            aria-label="Curiosity topics"
                        onKeyDown={handleCuriosityKeyDown}

          >
            <div className="curiosity-track">
              {curiosity.map(([icon, title, cls], index) => (
                <Link to={`/blog?topic=${cls}`} className={`curiosity-card ${index === curiosityIndex ? "is-active" : ""}`} key={title} aria-current={index === curiosityIndex ? "step" : undefined}>
                  <div className="curiosity-card-head"><span className="curiosity-index">0{index + 1}</span><span className="curiosity-icon" aria-hidden="true">{icon}</span></div>
                  <strong>{title}</strong>
                  <div className="curiosity-card-rule" aria-hidden="true" />
                  <small>{labels[cls]}</small>
                  <span className="curiosity-explore">Explore <b>→</b></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="insights-section-title built-title">
          <div><span>BUILT / UNBUILT</span><small>Exploring ideas that should — or shouldn't — exist.</small></div>
          <Link to="/projects">View all <b>→</b></Link>
        </div>
        <div className="built-grid">
          <article className="built-card built">
            <div className="built-copy">
              <span className="status built-status">BUILT</span>
              <h3>WHAT HAS ALREADY BEEN CREATED</h3>
              <p>Practical solutions, products, systems, experiments and case studies that have moved from a question into the world.</p>
              <Link to="/projects">Explore what exists <b>→</b></Link>
            </div>
            <div className="dashboard-art" aria-hidden="true"><div/><div/><div/><div/><div/><div/></div>
          </article>
          <article className="built-card unbuilt">
            <div className="built-copy">
              <span className="status unbuilt-status">UNBUILT</span>
              <h3>WHAT COULD EXIST NEXT</h3>
              <p>Ideas still being questioned, future concepts, problems worth exploring and experiments that have not become products yet.</p>
              <Link to="/launchpad">Explore the possibility <b>→</b></Link>
            </div>
            <div className="unbuilt-art" aria-hidden="true"><span/><span/><span/><span/><span/></div>
          </article>
        </div>

        <section className="newsletter">
          <div className="newsletter-icon">✉</div>
          <div className="newsletter-copy">
            <h2>NEVER STOP QUESTIONING.</h2>
            <p>Get curated insights, research and perspectives straight to your inbox.</p>
          </div>
          <button type="button" className="newsletter-trigger" onClick={() => setSubscribeOpen(true)}>Subscribe <span>→</span></button>
        </section>
      </section>
      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} />}
    </div>
  );
}
