"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { Lightbulb, Rocket, UsersRound, Sparkles, ArrowDown, ArrowRight } from "lucide-react";
import { milestones } from "./journeyData";

const milestoneIcons = [Lightbulb, Rocket, UsersRound, Sparkles];

/** @typedef {{id:string, year:string, title:string, description:string, phase:string}} JourneyMilestone */

function MilestoneCard({ item, index, total, progress, activeIndex, Icon }) {
  const start = index / total;
  const revealEnd = Math.min(1, start + 0.18);
  const nextStart = (index + 1) / total;
  const nextEnd = Math.min(1, nextStart + 0.18);
  const reveal = useTransform(progress, [start, revealEnd], [0, 1]);
  const y = useTransform(reveal, [0, 1], [42, 0]);
  const opacity = index === total - 1
    ? useTransform(progress, [start, revealEnd], [0, 1])
    : useTransform(progress, [start, revealEnd, nextStart, nextEnd], [0, 1, .9, .08]);
  const scale = index === total - 1
    ? useTransform(progress, [start, revealEnd], [.94, 1])
    : useTransform(progress, [start, revealEnd, nextStart, nextEnd], [.94, 1, .98, .94]);
  const rotateX = useTransform(reveal, [0, 1], [5, 0]);
  const isCurrent = activeIndex === index;

  return (
    <motion.li
      className={`journey-modern-item journey-modern-item--${index % 2 ? "right" : "left"}${isCurrent ? " is-current" : ""}`}
      style={{ opacity: isCurrent ? opacity : 0, y: isCurrent ? y : 22 }}
      aria-current={isCurrent ? "step" : undefined}
    >
      <motion.article
        className="journey-modern-card"
        style={{ scale, rotateX, transformPerspective: 1000 }}
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="journey-modern-card-topline">
          <span className="journey-modern-badge" aria-hidden="true"><Icon size={19} strokeWidth={1.8} /></span>
          <span className="journey-modern-year">{item.year}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <footer><i aria-hidden="true" />{item.phase}<ArrowRight size={14} aria-hidden="true" /></footer>
      </motion.article>
    </motion.li>
  );
}

/**
 * Scroll-driven, accessible milestone timeline for the About page.
 * @param {{items?: JourneyMilestone[]}} props
 */
export function JourneyTimeline({ items = milestones }) {
  const sectionRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: .35 });
  const reducedProgress = useSpring(1, { stiffness: 180, damping: 30 });
  const lineScale = useTransform(progress, [0, 1], [0, 1]);
  const orbX = useTransform(progress, [0, 1], ["8%", "82%"]);
  const orbY = useTransform(progress, [0, 1], ["78%", "15%"]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    if (reducedMotion) return;
    setActiveIndex(Math.min(items.length - 1, Math.floor(value * items.length)));
  });

  const activeLabel = useMemo(() => items[activeIndex]?.year ?? items[0]?.year, [activeIndex, items]);

  return (
    <section ref={sectionRef} id="our-journey" className="journey-modern-section" aria-labelledby="journey-modern-title">
      <div className="journey-modern-sticky">
        <motion.div className="journey-modern-orb" style={{ left: orbX, top: orbY }} aria-hidden="true" />
        <header className="journey-modern-intro">
          <span className="journey-modern-kicker">THE MILESTONES<i aria-hidden="true" /></span>
          <h2 id="journey-modern-title">OUR <span>JOURNEY</span> SO FAR<span className="journey-modern-dot">.</span></h2>
          <p>From a simple idea to real solutions — here’s how we’ve grown, step by step, with people who believe in what we build.</p>
          <div className="journey-modern-promise"><i aria-hidden="true" />MORE TO SOLVE.<br />A BRIGHTER TOMORROW.</div>
          <div className="journey-modern-scroll-cue"><ArrowDown size={15} aria-hidden="true" />SCROLL TO EXPLORE</div>
        </header>

        <div className="journey-modern-rail" aria-hidden="true">
          <span className="journey-modern-rail-base" />
          <motion.span className="journey-modern-rail-progress" style={{ scaleY: reducedMotion ? 1 : lineScale }} />
          {items.map((item, index) => {
            const reached = activeIndex >= index;
            return <span className={`journey-modern-node${reached ? " is-reached" : ""}${activeIndex === index ? " is-current" : ""}`} style={{ top: `${(index / Math.max(items.length - 1, 1)) * 100}%` }} key={item.id}><span>{item.year}</span></span>;
          })}
        </div>

        <ol className="journey-modern-list" aria-label="Builstry journey milestones">
          {items.map((item, index) => {
            const Icon = milestoneIcons[index % milestoneIcons.length];
            return <MilestoneCard key={item.id} item={item} index={index} total={items.length} progress={reducedMotion ? reducedProgress : progress} activeIndex={activeIndex} Icon={Icon} />;
          })}
        </ol>

        <div className="journey-modern-status" aria-live="polite"><span>{activeLabel}</span><i />{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
        <div className="journey-modern-endnote" aria-hidden="true"><i />HIGHER IDEAS.<br />BRIGHTER TOMORROWS.</div>
      </div>
    </section>
  );
}

export function OurJourneySection() {
  return <JourneyTimeline items={milestones} />;
}

export default OurJourneySection;
