import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroWebGLVisual from "./HeroWebGLVisual";

gsap.registerPlugin(ScrollTrigger);

export default function CubeStructure() {
  const rootRef = useRef(null);
  const motionRef = useRef({ progress: 0 });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const section = root.closest(".hero-section");
    if (!section) return undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const states = gsap.utils.toArray(".hero-visual-state");
      const lightOne = root.querySelector(".hero-light-one");
      const lightTwo = root.querySelector(".hero-light-two");
      const scene = root.querySelector(".hero-visual-scene");
      const labels = gsap.utils.toArray(".hero-state-label");
      const headlineLines = Array.from(section.querySelectorAll(".hero-content h1 span"));
      const stateCount = section.querySelector(".hero-state-count");
      const releaseWash = section.querySelector(".hero-release-wash");
      if (states.length !== 4 || labels.length !== 4 || headlineLines.length !== 4 || !releaseWash) {
        console.error("Builstry hero animation requires four visual states, four labels, four headline lines, and a release wash.");
        return undefined;
      }

      if (prefersReducedMotion) return undefined;

      gsap.set(states, { opacity: 0, scale: 0.88, filter: "blur(8px)" });
      gsap.set(states[0], { opacity: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(labels, { opacity: 0, y: 8, filter: "blur(5px)" });
      gsap.set(labels[0], { opacity: 1, y: 0, filter: "blur(0px)" });

      let activeIndex = 0;
      const updateStateCount = (index) => {
        if (!stateCount) return 0;
        stateCount.textContent = String(activeIndex + 1).padStart(2, "0");
        stateCount.parentElement?.setAttribute("aria-label", `Visual state ${activeIndex + 1} of ${states.length}`);
        return index;
      };
      const labelSwitchPoints = [0.26, 0.59, 0.92];

      const timeline = gsap.timeline({
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const nextIndex = labelSwitchPoints.reduce(
            (index, switchPoint) => (progress >= switchPoint ? index + 1 : index),
            0,
          );
          if (nextIndex === activeIndex) return;
          activeIndex = nextIndex;
          updateStateCount(activeIndex);
          gsap.set(labels, { opacity: 0, y: 8, filter: "blur(5px)" });
          gsap.fromTo(
            labels[activeIndex],
            { opacity: 0, y: 8, filter: "blur(5px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, overwrite: true },
          );
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(motionRef.current, { progress: 1, duration: 3 }, 0)
        .to(states[0], { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: 0.3 }, 0.78)
        .fromTo(states[1], { opacity: 0, scale: 0.9, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3 }, 0.78)
        .to(labels[0], { opacity: 0, y: -6, filter: "blur(5px)", duration: 0.2 }, 0.78)
        .fromTo(labels[1], { opacity: 0, y: 8, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 }, 0.78)
        .to(states[1], { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: 0.3 }, 1.77)
        .fromTo(states[2], { opacity: 0, scale: 0.9, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3 }, 1.77)
        .to(labels[1], { opacity: 0, y: -6, filter: "blur(5px)", duration: 0.2 }, 1.78)
        .fromTo(labels[2], { opacity: 0, y: 8, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 }, 1.78)
        .to(states[2], { opacity: 0, scale: 1.08, filter: "blur(10px)", duration: 0.3 }, 2.76)
        .fromTo(states[3], { opacity: 0, scale: 0.9, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3 }, 2.76)
        .to(labels[2], { opacity: 0, y: -6, filter: "blur(5px)", duration: 0.2 }, 2.78)
        .fromTo(labels[3], { opacity: 0, y: 8, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 }, 2.78)
        .to(lightOne, { x: 120, y: -28, scale: 1.15, duration: 1 }, 0)
        .to(lightTwo, { x: -90, y: 42, scale: 1.18, duration: 1 }, 0)
        .to(scene, { y: 18, rotationX: 8, rotationY: -8, duration: 1 }, 0)
        .to(scene, { scale: 0.88, opacity: 0.66, duration: 0.7 }, 2.3)
        .to(headlineLines[0], { y: -4, duration: 3 }, 0)
        .to(headlineLines[1], { y: 3, duration: 3 }, 0)
        .to(headlineLines[2], { y: -2, duration: 3 }, 0)
        .to(headlineLines[3], { y: 5, duration: 3 }, 0)
        .to(releaseWash, { opacity: 0.62, duration: 0.7 }, 2.3);
      return timeline;
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-visual-stage" ref={rootRef} aria-hidden="true">
      <div className="hero-light hero-light-one" />
      <div className="hero-light hero-light-two" />
      <div className="hero-visual-scene">
        <HeroWebGLVisual stageRef={rootRef} motionRef={motionRef} />
        <div className="hero-webgl-labels" aria-hidden="true">
          <span className="hero-state-label">01 / INDUSTRY SOLUTIONS</span>
          <span className="hero-state-label">02 / BUSINESS &amp; PRODUCT STRATEGY</span>
          <span className="hero-state-label">03 / DIGITAL PRODUCTS</span>
          <span className="hero-state-label">04 / INNOVATION &amp; AI</span>
        </div>
        <div className="hero-visual-state hero-state-01 is-active">
          <span className="state-tag">01 / INDUSTRY</span>
          <div className="state-layer state-layer-grid" />
          <div className="state-block state-block-a" />
          <div className="state-block state-block-b" />
          <div className="state-arch state-arch-a" />
          <div className="state-arch state-arch-b" />
          <div className="state-line state-line-a" />
          <div className="state-line state-line-b" />
        </div>
        <div className="hero-visual-state hero-state-02">
          <span className="state-tag">02 / STRATEGY</span>
          <div className="state-layer state-layer-grid" />
          <div className="state-panel state-panel-a" />
          <div className="state-panel state-panel-b" />
          <div className="state-panel state-panel-c" />
          <div className="state-ring" />
        </div>
        <div className="hero-visual-state hero-state-03">
          <span className="state-tag">03 / DIGITAL</span>
          <div className="state-layer state-layer-grid" />
          <div className="state-slab state-slab-a" />
          <div className="state-slab state-slab-b" />
          <div className="state-slab state-slab-c" />
          <div className="state-node state-node-a" />
          <div className="state-node state-node-b" />
          <div className="state-node state-node-c" />
        </div>
        <div className="hero-visual-state hero-state-04">
          <span className="state-tag">04 / FUTURE</span>
          <div className="state-layer state-layer-grid" />
          <div className="state-orbit state-orbit-a" />
          <div className="state-orbit state-orbit-b" />
          <div className="state-sphere" />
          <div className="state-trace state-trace-a" />
          <div className="state-trace state-trace-b" />
        </div>
      </div>
    </div>
  );
}
