import Link from "../components/RouterLink";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import CubeStructure from "../components/CubeStructure";
import CapabilitiesScroll from "../components/CapabilitiesScroll";
import ImpactStats from "../components/ImpactStats";
import FAQ from "../components/FAQ";
import CuriositySection from "../components/CuriositySection";
import IntentSection from "../components/IntentSection";
import HomeConceptScene from "../components/HomeConceptScene";
import "../components/HomeApproachSections.css";

export default function HomePage() {
  return <div className="page-shell home-page">
    <section className="hero-section"><div className="hero-grid" /><CubeStructure /><div className="hero-content"><Reveal><p className="eyebrow"><span className="pulse-dot" /> Practical growth ecosystem</p><h1><span>WE BUILD</span><span>WHAT</span><span>SHOULD</span><span className="hero-accent">EXIST.</span></h1><p className="hero-lede">We bring strategy, design, technology and innovation together around meaningful problems.</p><div className="hero-actions"><Link className="button button-primary" href="/contact">Start a conversation <ArrowUpRight size={17} /></Link><Link className="button button-ghost" href="#verticals">Explore the system <ArrowDownRight size={17} /></Link></div></Reveal></div><div className="hero-side-note">01 / 04<br /><span>FIND · THINK · BUILD · MOVE</span></div></section>

    <section id="about" className="light-section split-section"><Reveal><p className="eyebrow dark">OUR CAPABILITIES</p><h2 className="editorial-heading ideas-heading"><span>IDEAS GET</span><span>STRONGER WHEN</span><span>THE LOOP</span><span className="heading-accent">STAYS OPEN.</span></h2></Reveal><Reveal delay={.1}><p className="large-copy">We are a team of strategists, designers, technologists and builders. We turn ambiguity into useful direction, then turn direction into work people can use.</p><p className="muted-copy">From the first question to the final system, we keep the right people in the room.</p></Reveal></section>

    <CapabilitiesScroll />

    <CuriositySection />

    <section className="marquee-section"><div className="marquee-track">A PRACTICAL GROWTH ECOSYSTEM <span>✦</span> SMARTER AI SYSTEMS <span>✦</span> BRANDS THAT STAND OUT <span>✦</span> LEARN. BUILD. MOVE. <span>✦</span></div></section>

    <ImpactStats />

    <FAQ />

    <IntentSection />

    <section id="connect" className="cta-section home-end-cta" aria-labelledby="home-connect-title"><div className="home-connect-copy"><h2 id="home-connect-title" className="home-connect-title"><span>GOT A <em>PROBLEM</em></span><span>WORTH <em>SOLVING?</em></span></h2><p>Let&apos;s figure out what should exist.</p><div className="home-connect-actions"><Link className="home-connect-link primary" href="/contact">Start a Conversation <ArrowRight size={17} aria-hidden="true" /></Link><Link className="home-connect-link secondary" href="/contact?mode=booking">Book a Call <ArrowRight size={17} aria-hidden="true" /></Link></div></div><HomeConceptScene /><p className="home-connect-note">BUILD WHAT SHOULD EXIST</p></section>
  </div>;
}
