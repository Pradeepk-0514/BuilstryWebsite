"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";


const curiosityTopics = [
  ["!", "WHAT'S BROKEN?", "broken", "Problems worth understanding before they become expensive."],
  ["↗", "WHAT'S CHANGING?", "changing", "Signals, shifts and technologies changing the way we build."],
  ["□", "WHAT'S WORTH BUILDING?", "worth", "Ideas with the potential to become useful, scalable systems."],
  ["◎", "WHY DOES IT WORK?", "works", "The principles, products and systems that create real value."],
  ["⌕", "WHERE'S THE OPPORTUNITY?", "opportunity", "Gaps where better experiences and smarter systems can win."],
  ["✦", "WHAT'S NEXT?", "next", "Emerging ideas, behaviours and technologies to watch next."],
];

export default function InsightsPage() {
  const [subscribed, setSubscribed] = useState(false);
  const curiosityRef = useRef(null);
  const curiosityTrackRef = useRef(null);
  const [curiosityIndex, setCuriosityIndex] = useState(0);

  useEffect(() => {
    const section = curiosityRef.current;
    const track = curiosityTrackRef.current;
    if (!section || !track) return undefined;
    let frame = 0;
    let target = 0;
    let current = 0;
    let travel = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      if (window.innerWidth <= 720) {
        section.style.height = "auto";
        track.style.transform = "none";
        return;
      }
      travel = Math.max(0, track.scrollWidth - section.clientWidth + section.querySelector(".insights-curiosity-stage")?.querySelector(".insights-curiosity-intro")?.getBoundingClientRect().width || 0);
      const releaseDistance = Math.max(window.innerHeight * 2.15, travel * 1.18);
      section.style.height = `${window.innerHeight + releaseDistance}px`;
      updateTarget();
    };

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const releaseDistance = Math.max(window.innerHeight * 2.15, travel * 1.18);
      target = Math.max(0, Math.min(1, -rect.top / releaseDistance));
      const nextIndex = Math.min(curiosityTopics.length - 1, Math.floor(target * curiosityTopics.length));
      setCuriosityIndex((previous) => previous === nextIndex ? previous : nextIndex);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      const ease = reducedMotion ? 1 : 0.12;
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.0005) current = target;
      track.style.transform = `translate3d(${-travel * current}px, 0, 0)`;
      if (Math.abs(target - current) > 0.0005) frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (window.innerWidth <= 720) return;
      updateTarget();
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="insights-page">
    <section className="insights-opening" aria-label="Insights introduction and featured insight">
      <div className="insights-opening-visual" aria-hidden="true"><div className="insights-opening-frame"><span className="insights-art-kicker">BUILSTRY / SIGNALS</span><div className="insights-art-grid" /><div className="insights-art-orbit insights-art-orbit-one" /><div className="insights-art-orbit insights-art-orbit-two" /><div className="insights-art-cube"><i /><i /><i /></div><span className="insights-art-index">01 — 02</span></div></div>
      <div className="insights-opening-copy">
        <article className="insights-opening-panel"><div className="insights-opening-inner"><span className="insights-opening-index">01 / 02</span><div className="insights-eyebrow">BUILSTRY / <span>INSIGHTS</span></div><h1>THINKING<br />BEFORE<br /><em>BUILDING.</em></h1><p>Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next.</p></div></article>
        <article className="insights-opening-panel insights-featured-panel"><div className="insights-opening-inner"><span className="insights-opening-index">02 / 02</span><span className="insights-tag">FEATURED INSIGHT</span><h2>Why most recruitment systems optimize for volume instead of quality.</h2><p>An in-depth analysis of the hidden flaws in today&apos;s hiring systems — and what needs to change.</p><div className="insights-featured-meta"><span>◷ &nbsp;8 min read</span><b>•</b><span>Builstry Research</span></div><Link className="insights-button" href="/blog/recruitment-systems">Read the Insight <span>→</span></Link><span className="insights-category">QUALITY OVER VOLUME <b>SIGNAL 01</b></span></div></article>
      </div>
    </section>

    <section className="insights-curiosity" ref={curiosityRef} aria-labelledby="insights-curiosity-title">
      <div className="insights-curiosity-stage">
        <div className="insights-curiosity-intro">
          <span className="insights-curiosity-kicker">BUILSTRY / QUESTIONS</span>
          <h2 id="insights-curiosity-title">WHAT ARE<br />YOU <em>CURIOUS</em><br />ABOUT?</h2>
          <div className="insights-curiosity-rule" aria-hidden="true" />
          <p>Ideas worth asking about before they become things worth building.</p>
          <span className="insights-scroll-hint">SCROLL TO EXPLORE <b>→</b></span>
          <span className="insights-curiosity-progress"><b>0{curiosityIndex + 1}</b> / 06</span>
        </div>
        <div className="insights-curiosity-rail" aria-label="Curiosity topics">
          <div className="insights-curiosity-track" ref={curiosityTrackRef}>
            {curiosityTopics.map(([icon, title, key, description], index) => <Link href={`/blog?topic=${key}`} className={`insights-curiosity-card ${index === curiosityIndex ? "is-active" : ""}`} key={title}>
              <div className="insights-card-head"><span className="insights-card-index">0{index + 1}</span><span className="insights-card-icon" aria-hidden="true">{icon}</span></div>
              <strong>{title}</strong>
              <div className="insights-card-rule" aria-hidden="true" />
              <small>{description}</small>
              <span className="insights-explore">Explore <b>→</b></span>
            </Link>)}
          </div>
        </div>
      </div>
    </section>

    <section className="insights-built-section"><div className="insights-section-heading"><div><span>BUILT / INBUILT</span><small>Exploring ideas that should — or shouldn&apos;t — exist.</small></div><Link href="/projects">View all <b>→</b></Link></div><div className="insights-built-grid"><article className="insights-built-card insights-built"><div className="insights-built-copy"><span className="insights-status insights-status-built">BUILT</span><h3>AI-Powered Placement Intelligence Platform</h3><p>Helping colleges predict, track and improve student placement outcomes with data and AI.</p><Link href="/projects">View case study <b>→</b></Link></div><div className="insights-dashboard-art" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></article><article className="insights-built-card insights-inbuilt"><div className="insights-built-copy"><span className="insights-status">INBUILT</span><h3>A better way to evaluate student employability.</h3><p>Why existing assessments fail — and what a future-ready platform should look like.</p><Link href="/launchpad">Explore the idea <b>→</b></Link></div><div className="insights-unbuilt-art" aria-hidden="true"><i /><i /><i /><i /><i /></div></article></div></section>

    <section className="insights-newsletter"><div className="insights-newsletter-icon">✉</div><div className="insights-newsletter-copy"><h2>NEVER STOP QUESTIONING.</h2><p>Get curated insights, research and perspectives straight to your inbox.</p></div><form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" placeholder="Enter your email" aria-label="Email address" required /><button type="submit">{subscribed ? "Subscribed" : "Subscribe"} <span>→</span></button></form></section>
  </div>;
}
