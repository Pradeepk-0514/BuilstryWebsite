import Link from "./RouterLink";
import { ArrowRight } from "lucide-react";
import HomeConceptScene from "./HomeConceptScene";

export default function ProblemCTA() {
  return <section className="cta-section home-end-cta page-problem-cta" aria-labelledby="problem-cta-title">
    <div className="home-connect-copy">
      <h2 id="problem-cta-title" className="home-connect-title"><span>GOT A <em>PROBLEM</em></span><span>WORTH <em>SOLVING?</em></span></h2>
      <p>Let&apos;s figure out what should exist.</p>
      <div className="home-connect-actions">
        <Link className="home-connect-link primary" ctaMode="home-problem" href="/contact">Start a Conversation <ArrowRight size={17} aria-hidden="true" /></Link>
        <Link className="home-connect-link secondary" href="/contact?mode=booking">Book a Call <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </div>
    <HomeConceptScene />
    <p className="home-connect-note">BUILD WHAT SHOULD EXIST</p>
  </section>;
}
