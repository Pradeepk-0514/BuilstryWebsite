"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const curiosity = [
  ["!", "WHAT'S BROKEN?", "Problems worth understanding before they become expensive."],
  ["↗", "WHAT'S CHANGING?", "Signals, shifts and technologies changing the way we build."],
  ["□", "WHAT'S WORTH BUILDING?", "Ideas with the potential to become useful, scalable systems."],
  ["◎", "WHY DOES IT WORK?", "The principles, products and systems that create real value."],
  ["⌕", "WHERE'S THE OPPORTUNITY?", "Gaps where better experiences and smarter systems can win."],
  ["✦", "WHO'S BUILDING?", "The people, teams and communities turning better questions into useful momentum."],
];

export default function InsightsPage() {
  const curiositySectionRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const section = curiositySectionRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    if (!section || !stage || !rail) return undefined;

    let frame = 0;
    let metrics = { top: 0, distance: 0, stickyTop: 0 };

    const measure = () => {
      const stageHeight = stage.getBoundingClientRect().height;
      const distance = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const stickyTop = Math.max(84, (window.innerHeight - stageHeight) / 2);
      metrics = { top: section.getBoundingClientRect().top + window.scrollY, distance, stickyTop };
      section.style.setProperty("--curiosity-scroll-distance", `${distance}px`);
      section.style.setProperty("--curiosity-sticky-top", `${stickyTop}px`);
      section.style.height = `${stageHeight + distance}px`;
    };

    const syncRail = () => {
      frame = 0;
      const progress = metrics.distance === 0
        ? 0
        : Math.max(0, Math.min(1, (window.scrollY - (metrics.top - metrics.stickyTop)) / metrics.distance));
      rail.scrollLeft = metrics.distance * progress;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncRail);
    };

    measure();
    syncRail();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveRail = (direction) => {
    const rail = railRef.current;
    const card = rail?.querySelector(".insights-curiosity-card");
    if (!rail || !card) return false;
    const step = card.getBoundingClientRect().width + 1;
    const max = rail.scrollWidth - rail.clientWidth;
    const next = Math.max(0, Math.min(max, rail.scrollLeft + direction * step));
    if (Math.abs(next - rail.scrollLeft) < 2) return false;
    rail.scrollTo({ left: next, behavior: "smooth" });
    return true;
  };

  const onCuriosityWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const section = curiositySectionRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    if (!section || !stage || !rail) return;

    const stageRect = stage.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const stageIsActive = stageRect.top <= viewportCenter && stageRect.bottom >= viewportCenter && sectionRect.bottom > stageRect.bottom;
    if (!stageIsActive) return;

    const atStart = event.deltaY < 0 && rail.scrollLeft <= 1;
    const atEnd = event.deltaY > 0 && rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
    if (atStart || atEnd) return;

    event.preventDefault();
    window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
  };

  const onCuriosityKey = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveRail(event.key === "ArrowRight" ? 1 : -1);
  };

  return <div className="insights-page">
    <section className="insights-opening" aria-label="Insights introduction and featured insight">
      <div className="insights-opening-visual" aria-hidden="true"><div className="insights-opening-frame"><span className="insights-art-kicker">BUILSTRY / SIGNALS</span><div className="insights-art-grid" /><div className="insights-art-orbit insights-art-orbit-one" /><div className="insights-art-orbit insights-art-orbit-two" /><div className="insights-art-cube"><i /><i /><i /></div><span className="insights-art-index">01 — 02</span></div></div>
      <div className="insights-opening-copy">
        <article className="insights-opening-panel"><div className="insights-opening-inner"><span className="insights-opening-index">01 / 02</span><div className="insights-eyebrow">BUILSTRY / <span>INSIGHTS</span></div><h1>THINKING<br />BEFORE<br /><em>BUILDING.</em></h1><p>Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next.</p></div></article>
        <article className="insights-opening-panel insights-featured-panel"><div className="insights-opening-inner"><span className="insights-opening-index">02 / 02</span><span className="insights-tag">FEATURED INSIGHT</span><h2>Why most recruitment systems optimize for volume instead of quality.</h2><p>An in-depth analysis of the hidden flaws in today&apos;s hiring systems — and what needs to change.</p><div className="insights-featured-meta"><span>◷ &nbsp;8 min read</span><b>•</b><span>Builstry Research</span></div><Link className="insights-button" href="/blog/recruitment-systems">Read the Insight <span>→</span></Link><span className="insights-category">QUALITY OVER VOLUME <b>SIGNAL 01</b></span></div></article>
      </div>
    </section>

    <section className="insights-curiosity" ref={curiositySectionRef} aria-labelledby="insights-curiosity-title">
      <div className="insights-curiosity-stage" ref={stageRef}>
        <div className="insights-curiosity-intro"><span className="insights-curiosity-kicker">BUILSTRY / QUESTIONS</span><h2 id="insights-curiosity-title">WHAT ARE<br />YOU <em>CURIOUS</em><br />ABOUT?</h2><div className="insights-curiosity-rule" /><p>Ideas worth asking about before they become things worth building.</p><span className="insights-scroll-hint">SCROLL TO EXPLORE <b>→</b></span></div>
        <div className="insights-curiosity-rail" ref={railRef} tabIndex="0" role="region" aria-label="Curiosity topics" onWheelCapture={onCuriosityWheel} onKeyDown={onCuriosityKey}><div className="insights-curiosity-track">{curiosity.map(([icon, title, text], index) => <Link className="insights-curiosity-card" key={title} href={`/blog?topic=${index}`}><div className="insights-card-head"><span className="insights-card-index">0{index + 1}</span><span className="insights-card-icon">{icon}</span></div><strong>{title}</strong><div className="insights-card-rule" /><small>{text}</small><span className="insights-explore">Explore <b>→</b></span></Link>)}</div></div>
      </div>
    </section>

    <section className="insights-built-section"><div className="insights-section-heading"><div><span>BUILT / INBUILT</span><small>Exploring ideas that should — or shouldn&apos;t — exist.</small></div><Link href="/projects">View all <b>→</b></Link></div><div className="insights-built-grid"><article className="insights-built-card insights-built"><div className="insights-built-copy"><span className="insights-status insights-status-built">BUILT</span><h3>AI-Powered Placement Intelligence Platform</h3><p>Helping colleges predict, track and improve student placement outcomes with data and AI.</p><Link href="/projects">View case study <b>→</b></Link></div><div className="insights-dashboard-art" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></article><article className="insights-built-card insights-inbuilt"><div className="insights-built-copy"><span className="insights-status">INBUILT</span><h3>A better way to evaluate student employability.</h3><p>Why existing assessments fail — and what a future-ready platform should look like.</p><Link href="/launchpad">Explore the idea <b>→</b></Link></div><div className="insights-unbuilt-art" aria-hidden="true"><i /><i /><i /><i /><i /></div></article></div></section>

    <section className="insights-newsletter"><div className="insights-newsletter-icon">✉</div><div className="insights-newsletter-copy"><h2>NEVER STOP QUESTIONING.</h2><p>Get curated insights, research and perspectives straight to your inbox.</p></div><form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" placeholder="Enter your email" aria-label="Email address" required /><button type="submit">{subscribed ? "Subscribed" : "Subscribe"} <span>→</span></button></form></section>
  </div>;
}
