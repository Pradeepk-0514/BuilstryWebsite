"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BrainCircuit, Layers3, Sparkles, Workflow } from "lucide-react";
import Reveal from "./Reveal";
import { useCtaModal } from "../src/components/CtaModalContext";

const items = [
  { eyebrow: "01 / DISCOVER", title: "Find the signal in the noise.", text: "We decode the problem, the people and the opportunity before the work begins. Clear questions create useful direction.", icon: Layers3 },
  { eyebrow: "02 / DESIGN", title: "Shape the useful direction.", text: "Strategy, product thinking and creative systems come together to make the next move feel obvious and ownable.", icon: Sparkles },
  { eyebrow: "03 / BUILD", title: "Make the idea real.", text: "From intelligent workflows to brand experiences, we turn decisions into things people can use, share and grow.", icon: Workflow },
  { eyebrow: "04 / MOVE", title: "Keep the loop open.", text: "We learn from what happens in the real world and keep improving the system long after launch.", icon: BrainCircuit },
];

export default function CapabilitiesScroll() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const contentWindowRef = useRef(null);
  const mobileStageRef = useRef(null);
  const ctaModal = useCtaModal();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (window.matchMedia("(max-width: 720px)").matches) return;
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number(visible.target.dataset.index));
    }, { threshold: [0.35, 0.6, 0.85], rootMargin: "-40% 0px -40%" });
    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = mobileStageRef.current;
    const content = contentRef.current;
    const contentWindow = contentWindowRef.current;
    if (!section || !stage || !content || !contentWindow) return undefined;

    const mobile = window.matchMedia("(max-width: 720px)");
    let frame = 0;
    let top = 0;
    let distance = 0;
    let stickyTop = 0;

    const update = () => {
      frame = 0;
      if (!mobile.matches) return;
      const progress = distance > 0 ? Math.max(0, Math.min(1, (window.scrollY - top) / distance)) : 0;
      content.style.transform = `translate3d(0, ${-distance * progress}px, 0)`;
      const center = contentWindow.getBoundingClientRect().top + contentWindow.clientHeight / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const itemCenter = item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2;
        const itemDistance = Math.abs(itemCenter - center);
        if (itemDistance < nearestDistance) {
          nearestDistance = itemDistance;
          nearestIndex = index;
        }
      });
      setActive((current) => current === nearestIndex ? current : nearestIndex);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (!mobile.matches) {
        section.style.removeProperty("height");
        content.style.removeProperty("transform");
        stage.style.removeProperty("--capabilities-sticky-top");
        return;
      }

      const fixedHeader = [...document.querySelectorAll("header")].find((header) => getComputedStyle(header).position === "fixed");
      const headerTop = fixedHeader ? Number.parseFloat(getComputedStyle(fixedHeader).top) || 0 : 0;
      stickyTop = fixedHeader ? Math.max(8, Math.ceil(headerTop + fixedHeader.offsetHeight)) : 8;
      stage.style.setProperty("--capabilities-sticky-top", `${stickyTop}px`);
      stage.style.height = `calc(100svh - ${stickyTop}px)`;
      const stageHeight = stage.getBoundingClientRect().height;
      distance = Math.max(0, content.scrollHeight - contentWindow.clientHeight);
      top = section.getBoundingClientRect().top + window.scrollY - stickyTop;
      section.style.height = `${Math.ceil(stageHeight + distance + stickyTop)}px`;
      update();
    };

    const observer = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    observer?.observe(stage);
    observer?.observe(content);
    observer?.observe(contentWindow);
    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.visualViewport?.addEventListener("resize", measure, { passive: true });
    mobile.addEventListener?.("change", measure);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      mobile.removeEventListener?.("change", measure);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      section.style.removeProperty("height");
      content.style.removeProperty("transform");
      stage.style.removeProperty("height");
      stage.style.removeProperty("--capabilities-sticky-top");
    };
  }, []);

  const ActiveIcon = items[active].icon;
  return <section className="capabilities-scroll" ref={sectionRef} aria-labelledby="capabilities-scroll-title">
    <div className="capabilities-mobile-stage" ref={mobileStageRef}>
      <div className="capabilities-visual-column"><div className="capabilities-visual-sticky"><div className={`capabilities-visual capabilities-visual-${active + 1}`}><div className="capabilities-visual-grid" /><div className="capabilities-visual-ring capabilities-ring-one" /><div className="capabilities-visual-ring capabilities-ring-two" /><div className="capabilities-visual-core"><ActiveIcon size={42} strokeWidth={1.2} /></div><span className="capabilities-visual-index">0{active + 1} / 04</span></div><p className="capabilities-visual-caption">FIND · THINK · BUILD · MOVE</p></div></div>
      <div className="capabilities-content-window" ref={contentWindowRef}>
        <div className="capabilities-content" ref={contentRef}><Reveal><p className="eyebrow dark">OUR CAPABILITIES</p><h2 id="capabilities-scroll-title" className="editorial-heading loop-heading"><span>A LOOP THAT</span><span>GETS STRONGER</span><span className="heading-accent">EVERY TIME</span><span className="heading-accent">AROUND.</span></h2><p className="capabilities-intro">We bring strategy, design, technology and innovation together around meaningful problems.</p></Reveal>{items.map((item, index) => <Reveal key={item.eyebrow} delay={index * .04}><article className={`capability-step ${active === index ? "is-active" : ""}`} data-index={index} ref={(element) => { itemRefs.current[index] = element; }}><span className="capability-step-number">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#connect" onClick={(event) => { event.preventDefault(); ctaModal?.openCta("inquiry"); }}>Start a conversation <ArrowUpRight size={15} /></a></article></Reveal>)}</div>
      </div>
    </div>
  </section>;
}
