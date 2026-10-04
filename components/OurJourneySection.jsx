"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones } from "./journeyData";

const JourneyScene = lazy(() => import("./JourneyScene"));

export function OurJourneySection() {
  const sectionRef = useRef(null);
  const scrollProgress = useRef(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.("change", updatePreference);
    return () => preference.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    scrollProgress.current = 0;
    const routeDriver = { progress: 0 };
    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          toggleActions: "play none none reverse",
        },
      })
        .fromTo(".journey3d-kicker", { y: 13, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.46, ease: "power2.out" })
        .fromTo(".journey3d-title", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, ease: "power3.out" }, "<0.05")
        .fromTo(".journey3d-copy-text, .journey3d-promise", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" }, "<0.08");

      gsap.to(routeDriver, {
        progress: 1,
        ease: "none",
        onUpdate: () => { scrollProgress.current = routeDriver.progress; },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const multiplier = window.innerWidth <= 760 ? 1.35 : window.innerWidth <= 1024 ? 1.55 : 1.9;
            return `+=${Math.round(window.innerHeight * multiplier)}`;
          },
          pin: true,
          pinSpacing: true,
          // Camera damping supplies the cinematic ease; keep reveals in sync with actual scroll.
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (trigger) => { scrollProgress.current = trigger.progress; },
        },
      });
    }, section);

    return () => {
      context.revert();
      scrollProgress.current = 0;
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="our-journey"
      className="journey3d-section"
      aria-labelledby="journey3d-title"
    >
      <div className="journey3d-canvas-layer" aria-label="Interactive Builstry milestone landscape">
        <Suspense fallback={<div className="journey3d-loading" aria-hidden="true" />}>
          <JourneyScene
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            progressRef={scrollProgress}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>

      <header className="journey3d-editorial">
        <span className="journey3d-kicker">THE MILESTONES<i aria-hidden="true" /></span>
        <h2 id="journey3d-title" className="journey3d-title">OUR <br className="journey3d-title-mobile-break" /><span className="journey3d-title-accent">JOURNEY</span><br />SO FAR<span className="journey3d-period">.</span></h2>
        <p className="journey3d-copy-text">From a simple idea to real solutions — here’s how we’ve grown, step by step, with people who believe in what we build.</p>
        <div className="journey3d-promise"><i aria-hidden="true" />MORE TO SOLVE.<br />A BRIGHTER TOMORROW.</div>
      </header>

      <div className="journey3d-endnote" aria-hidden="true"><i />HIGHER IDEAS.<br />BRIGHTER TOMORROWS.</div>

      <ol className="journey3d-sr-only" aria-label="Builstry journey milestones">
        {milestones.map((item) => (
          <li key={item.id}>
            <span>{item.year}</span> — <strong>{item.title}</strong>. {item.description}
          </li>
        ))}
      </ol>
    </section>
  );
}
