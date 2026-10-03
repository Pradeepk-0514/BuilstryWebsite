"use client";

import { useState } from "react";
import { Brain, Search, TrendingUp, Wrench, Zap } from "lucide-react";

const mindsets = [
  { number: "01", title: "CURIOUS", description: "We ask questions before making assumptions.", Icon: Search },
  { number: "02", title: "RESTLESS", description: "We don’t accept that “that’s how it’s always been done.”", Icon: Zap },
  { number: "03", title: "PRACTICAL", description: "A beautiful idea means little if it cannot work.", Icon: Wrench },
  { number: "04", title: "EXPERIMENTAL", description: "We prototype, test and learn continuously.", Icon: Brain },
  { number: "05", title: "LONG-TERM", description: "We care about what happens after launch.", Icon: TrendingUp },
];

export function MindsetInMotionSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="about-ref-mindset-section" aria-labelledby="about-ref-mindset-title">
      <header className="about-ref-mindset-copy">
        <span className="about-ref-mindset-kicker">THE MINDSET</span>
        <h2 id="about-ref-mindset-title">HOW WE <span>THINK.</span></h2>
        <p>Our mindset shapes everything we build — from the questions we ask to the solutions we create.</p>
        <div className="about-ref-mindset-brush-note" aria-label="Curious minds, useful impact.">
          <span>Curious minds.<br />Useful impact.</span><i />
        </div>
      </header>

      <div className="about-ref-mindset-track" aria-label="Five principles that shape our mindset" onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(null);
      }}>
        {mindsets.map(({ number, title, description, Icon }, index) => (
          <article
            className={`about-ref-mindset-card${activeIndex === index ? " is-active" : ""}`}
            key={number}
            tabIndex={0}
            role="group"
            aria-label={`${number} ${title}: ${description}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
          >
            <span className="about-ref-mindset-icon"><Icon aria-hidden="true" size={17} strokeWidth={2} /></span>
            <small className="about-ref-mindset-number">{number}</small>
            <strong>{title}</strong>
            <span className="about-ref-mindset-description">{description}</span>
            <span className="about-ref-mindset-arrow" aria-hidden="true">→</span>
          </article>
        ))}
      </div>
    </section>
  );
}
