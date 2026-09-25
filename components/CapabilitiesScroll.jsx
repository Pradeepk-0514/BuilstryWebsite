"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BrainCircuit, Layers3, Sparkles, Workflow } from "lucide-react";
import Reveal from "./Reveal";

const items = [
  { eyebrow: "01 / DISCOVER", title: "Find the signal in the noise.", text: "We decode the problem, the people and the opportunity before the work begins. Clear questions create useful direction.", icon: Layers3 },
  { eyebrow: "02 / DESIGN", title: "Shape the useful direction.", text: "Strategy, product thinking and creative systems come together to make the next move feel obvious and ownable.", icon: Sparkles },
  { eyebrow: "03 / BUILD", title: "Make the idea real.", text: "From intelligent workflows to brand experiences, we turn decisions into things people can use, share and grow.", icon: Workflow },
  { eyebrow: "04 / MOVE", title: "Keep the loop open.", text: "We learn from what happens in the real world and keep improving the system long after launch.", icon: BrainCircuit },
];

export default function CapabilitiesScroll() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number(visible.target.dataset.index));
    }, { threshold: [0.35, 0.6, 0.85], rootMargin: "-18% 0px -36%" });
    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const ActiveIcon = items[active].icon;
  return <section className="capabilities-scroll" aria-labelledby="capabilities-scroll-title">
    <div className="capabilities-visual-column"><div className="capabilities-visual-sticky"><div className={`capabilities-visual capabilities-visual-${active + 1}`}><div className="capabilities-visual-grid" /><div className="capabilities-visual-ring capabilities-ring-one" /><div className="capabilities-visual-ring capabilities-ring-two" /><div className="capabilities-visual-core"><ActiveIcon size={42} strokeWidth={1.2} /></div><span className="capabilities-visual-index">0{active + 1} / 04</span></div><p className="capabilities-visual-caption">FIND · THINK · BUILD · MOVE</p></div></div>
    <div className="capabilities-content"><Reveal><p className="eyebrow dark">OUR CAPABILITIES</p><h2 id="capabilities-scroll-title" className="editorial-heading loop-heading"><span>A LOOP THAT</span><span>GETS STRONGER</span><span className="heading-accent">EVERY TIME</span><span className="heading-accent">AROUND.</span></h2><p className="capabilities-intro">We bring strategy, design, technology and innovation together around meaningful problems.</p></Reveal>{items.map((item, index) => <Reveal key={item.eyebrow} delay={index * .04}><article className={`capability-step ${active === index ? "is-active" : ""}`} data-index={index} ref={(element) => { itemRefs.current[index] = element; }}><span className="capability-step-number">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#connect">Start a conversation <ArrowUpRight size={15} /></a></article></Reveal>)}</div>
  </section>;
}
