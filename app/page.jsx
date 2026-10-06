import Link from "../components/RouterLink";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import CubeStructure from "../components/CubeStructure";
import CapabilitiesScroll from "../components/CapabilitiesScroll";
import ImpactStats from "../components/ImpactStats";
import FAQ from "../components/FAQ";
import CuriositySection from "../components/CuriositySection";
import IntentSection from "../components/IntentSection";
import ProblemCTA from "../components/ProblemCTA";
import "../components/HomeApproachSections.css";

export default function HomePage() {
  return <div className="page-shell home-page">
    <section className="hero-section">
      <div className="hero-shell">
        <div className="hero-grid" />
        <div className="hero-release-wash" aria-hidden="true" />
        <CubeStructure />
        <div className="hero-content"><Reveal><p className="eyebrow"><span className="pulse-dot" /> Practical growth ecosystem</p><h1><span>WE BUILD</span><span>WHAT</span><span>SHOULD</span><span className="hero-accent">EXIST.</span></h1><p className="hero-lede">We bring strategy, design, technology and innovation together around meaningful problems.</p><div className="hero-actions"><Link className="button button-primary" href="/contact">Start a conversation <ArrowUpRight size={17} /></Link><Link className="button button-ghost" href="#verticals">Explore the system <ArrowDownRight size={17} /></Link></div></Reveal></div>
        <div className="hero-side-note"><span className="hero-state-count">01</span> / 04<br /><span>FIND · THINK · BUILD · MOVE</span></div>
      </div>
    </section>

    <section id="about" className="light-section split-section"><Reveal><p className="eyebrow dark">OUR CAPABILITIES</p><h2 className="editorial-heading ideas-heading"><span>IDEAS GET</span><span>STRONGER WHEN</span><span>THE LOOP</span><span className="heading-accent">STAYS OPEN.</span></h2></Reveal><Reveal delay={.1}><p className="large-copy">We are a team of strategists, designers, technologists and builders. We turn ambiguity into useful direction, then turn direction into work people can use.</p><p className="muted-copy">From the first question to the final system, we keep the right people in the room.</p></Reveal></section>

    <CapabilitiesScroll />

    <CuriositySection />

    <section className="marquee-section"><div className="marquee-track">A PRACTICAL GROWTH ECOSYSTEM <span>✦</span> SMARTER AI SYSTEMS <span>✦</span> BRANDS THAT STAND OUT <span>✦</span> LEARN. BUILD. MOVE. <span>✦</span></div></section>

    <ImpactStats />

    <FAQ />

    <IntentSection />

    <ProblemCTA />
    </div>;
}
