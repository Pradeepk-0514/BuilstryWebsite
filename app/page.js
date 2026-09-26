import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Bot, Sparkles } from "lucide-react";
import Reveal from "../components/Reveal";
import Carousel from "../components/Carousel";
import CubeStructure from "../components/CubeStructure";
import CapabilitiesScroll from "../components/CapabilitiesScroll";
import ImpactStats from "../components/ImpactStats";
import FAQ from "../components/FAQ";
import BuildPillars from "../components/BuildPillars";
import { benefits } from "../lib/content";

export default function HomePage() {
  return <div className="page-shell">
    <section className="hero-section"><div className="hero-grid" /><CubeStructure /><div className="hero-content"><Reveal><p className="eyebrow"><span className="pulse-dot" /> Practical growth ecosystem</p><h1><span>WE BUILD</span><span>WHAT</span><span>SHOULD</span><span className="hero-accent">EXIST.</span></h1><p className="hero-lede">We bring strategy, design, technology and innovation together around meaningful problems.</p><div className="hero-actions"><Link className="button button-primary" href="/contact">Start a conversation <ArrowUpRight size={17} /></Link><Link className="button button-ghost" href="#verticals">Explore the system <ArrowDownRight size={17} /></Link></div></Reveal></div><div className="hero-side-note">01 / 04<br /><span>FIND · THINK · BUILD · MOVE</span></div><div className="hero-scroll">Scroll to explore <ArrowDownRight size={16} /></div></section>

    <section id="about" className="light-section split-section"><Reveal><p className="eyebrow dark">OUR CAPABILITIES</p><h2 className="editorial-heading ideas-heading"><span>IDEAS GET</span><span>STRONGER WHEN</span><span>THE LOOP</span><span className="heading-accent">STAYS OPEN.</span></h2></Reveal><Reveal delay={.1}><p className="large-copy">We are a team of strategists, designers, technologists and builders. We turn ambiguity into useful direction, then turn direction into work people can use.</p><p className="muted-copy">From the first question to the final system, we keep the right people in the room.</p></Reveal></section>

    <CapabilitiesScroll />

    <BuildPillars />

    <section className="marquee-section"><div className="marquee-track">A PRACTICAL GROWTH ECOSYSTEM <span>✦</span> SMARTER AI SYSTEMS <span>✦</span> BRANDS THAT STAND OUT <span>✦</span> LEARN. BUILD. MOVE. <span>✦</span></div></section>

    <section className="light-section benefits-section"><div className="section-heading"><div><p className="eyebrow dark">OUR CORE BENEFITS</p><h2 className="editorial-heading benefits-heading"><span>USEFUL WORK <span className="heading-accent inline-accent">COMPOUNDS.</span></span></h2></div><Sparkles className="accent-icon" /></div><Reveal><Carousel items={benefits} /></Reveal></section>

    <ImpactStats />

    <FAQ />

    <section id="connect" className="cta-section"><Reveal><p className="eyebrow">LET&apos;S CONNECT</p><h2 className="editorial-heading cta-heading"><span>GOT A PROBLEM</span><span className="heading-accent">WORTH SOLVING?</span></h2><p>Bring the difficult question, the rough idea or the system that is not working yet.</p><div className="cta-actions"><Link className="button button-primary" href="/contact">Start a Conversation <ArrowUpRight size={17} /></Link><Link className="button cta-secondary" href="/contact?mode=booking">Book a Call <ArrowUpRight size={17} /></Link></div></Reveal><div className="cta-mark"><Bot size={82} strokeWidth={1} /></div></section>
  </div>;
}
