"use client";

import { useState } from "react";
import Link from "next/link";


export default function InsightsPage() {
  const [subscribed, setSubscribed] = useState(false);
  return <div className="insights-page">
    <section className="insights-opening" aria-label="Insights introduction and featured insight">
      <div className="insights-opening-visual" aria-hidden="true"><div className="insights-opening-frame"><span className="insights-art-kicker">BUILSTRY / SIGNALS</span><div className="insights-art-grid" /><div className="insights-art-orbit insights-art-orbit-one" /><div className="insights-art-orbit insights-art-orbit-two" /><div className="insights-art-cube"><i /><i /><i /></div><span className="insights-art-index">01 — 02</span></div></div>
      <div className="insights-opening-copy">
        <article className="insights-opening-panel"><div className="insights-opening-inner"><span className="insights-opening-index">01 / 02</span><div className="insights-eyebrow">BUILSTRY / <span>INSIGHTS</span></div><h1>THINKING<br />BEFORE<br /><em>BUILDING.</em></h1><p>Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next.</p></div></article>
        <article className="insights-opening-panel insights-featured-panel"><div className="insights-opening-inner"><span className="insights-opening-index">02 / 02</span><span className="insights-tag">FEATURED INSIGHT</span><h2 className="insights-featured-title"><span>WHY MOST RECRUITMENT</span><span>SYSTEMS OPTIMIZE</span><span>FOR VOLUME INSTEAD</span><span>OF <em>QUALITY TO.</em></span></h2><p>An in-depth analysis of the hidden flaws in today&apos;s hiring systems — and what needs to change.</p><div className="insights-featured-meta"><span>◷ &nbsp;8 min read</span><b>•</b><span>Builstry Research</span></div><Link className="insights-button" href="/blog/recruitment-systems">Read the Insight <span>→</span></Link><span className="insights-category">QUALITY OVER VOLUME <b>SIGNAL 01</b></span></div></article>
      </div>
    </section>

    <section className="insights-built-section"><div className="insights-section-heading"><div><span>BUILT / INBUILT</span><small>Exploring ideas that should — or shouldn&apos;t — exist.</small></div><Link href="/projects">View all <b>→</b></Link></div><div className="insights-built-grid"><article className="insights-built-card insights-built"><div className="insights-built-copy"><span className="insights-status insights-status-built">BUILT</span><h3>AI-Powered Placement Intelligence Platform</h3><p>Helping colleges predict, track and improve student placement outcomes with data and AI.</p><Link href="/projects">View case study <b>→</b></Link></div><div className="insights-dashboard-art" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></article><article className="insights-built-card insights-inbuilt"><div className="insights-built-copy"><span className="insights-status">INBUILT</span><h3>A better way to evaluate student employability.</h3><p>Why existing assessments fail — and what a future-ready platform should look like.</p><Link href="/launchpad">Explore the idea <b>→</b></Link></div><div className="insights-unbuilt-art" aria-hidden="true"><i /><i /><i /><i /><i /></div></article></div></section>

    <section className="insights-newsletter"><div className="insights-newsletter-icon">✉</div><div className="insights-newsletter-copy"><h2>NEVER STOP QUESTIONING.</h2><p>Get curated insights, research and perspectives straight to your inbox.</p></div><form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" placeholder="Enter your email" aria-label="Email address" required /><button type="submit">{subscribed ? "Subscribed" : "Subscribe"} <span>→</span></button></form></section>
  </div>;
}
