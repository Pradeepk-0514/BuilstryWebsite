"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Lightbulb, Rocket, Search, TrendingUp, UsersRound } from "lucide-react";

const milestones = [
  { year: "2024", title: "Builstry begins.", description: "A shared belief to solve real problems and build what matters.", phase: "IDEA", Icon: Lightbulb, x: "27%", y: "80%", kind: "orb" },
  { year: "2024", title: "First problems we chose to solve.", description: "Started working on real-world challenges with early partners and users.", phase: "EXPLORATION", Icon: Search, x: "40.4%", y: "68%", kind: "mountain" },
  { year: "2025", title: "First solutions built and launched.", description: "Turned ideas into working solutions and got them into the real world.", phase: "BUILD", Icon: Rocket, x: "53.8%", y: "56%", kind: "layers" },
  { year: "2025", title: "First businesses we partnered with.", description: "Collaborated with forward-thinking organizations to create real impact.", phase: "COLLABORATION", Icon: Building2, x: "67.2%", y: "44%", kind: "bubbles" },
  { year: "2026", title: "First hackathons and community.", description: "Brought together students, builders and innovators to solve, learn and grow.", phase: "COMMUNITY", Icon: UsersRound, x: "80.6%", y: "32%", kind: "cubes" },
  { year: "2026+", title: "Many more problems to solve. Many more to build.", description: "A bigger impact across industries, people and possibilities.", phase: "IMPACT", Icon: TrendingUp, x: "94%", y: "20%", kind: "summit" },
];
const milestoneThresholds = [0, 0.17, 0.34, 0.51, 0.68, 0.85];

function JourneyPath({ progress }) {
  return (
    <svg className="journey-path-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="journey-ribbon" x1="376" y1="693" x2="1504" y2="261" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D94F9A" stopOpacity=".12" />
          <stop offset=".38" stopColor="#D57FBD" stopOpacity=".35" />
          <stop offset=".72" stopColor="#B8AAE8" stopOpacity=".38" />
          <stop offset="1" stopColor="#E6A9D1" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id="journey-thread" x1="376" y1="693" x2="1504" y2="261" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DA4D9B" stopOpacity=".72" />
          <stop offset=".48" stopColor="#B784D4" stopOpacity=".72" />
          <stop offset="1" stopColor="#E24E9D" stopOpacity=".76" />
        </linearGradient>
        <radialGradient id="journey-node">
          <stop stopColor="#FFF" />
          <stop offset=".35" stopColor="#FFB7DD" />
          <stop offset=".75" stopColor="#EB62B2" />
          <stop offset="1" stopColor="#A65FD4" />
        </radialGradient>
        <filter id="journey-blur" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <path pathLength="1" className="journey-ribbon-shadow journey-progress-path" d="M432 720 C500 704 570 666 646 612 C716 580 790 540 861 504 C932 468 1006 432 1075 396 C1146 360 1220 324 1290 288 C1360 252 1435 212 1504 180" stroke="url(#journey-ribbon)" strokeWidth="44" strokeLinecap="round" filter="url(#journey-blur)" />
      <path pathLength="1" className="journey-progress-path" d="M432 720 C500 704 570 666 646 612 C716 580 790 540 861 504 C932 468 1006 432 1075 396 C1146 360 1220 324 1290 288 C1360 252 1435 212 1504 180" stroke="url(#journey-thread)" strokeOpacity=".22" strokeWidth="18" strokeLinecap="round" />
      <path pathLength="1" className="journey-progress-path" d="M432 720 C500 704 570 666 646 612 C716 580 790 540 861 504 C932 468 1006 432 1075 396 C1146 360 1220 324 1290 288 C1360 252 1435 212 1504 180" stroke="url(#journey-thread)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 6" />
      <path d="M426 742 C500 756 580 692 656 636 C724 602 796 566 873 538 C944 512 1018 480 1087 430 C1158 400 1232 368 1304 310 C1374 278 1446 236 1512 202" stroke="#B7A8E0" strokeOpacity=".28" strokeWidth="1.5" />
      <path d="M382 700 C420 674 454 646 486 620 M1265 302 C1350 268 1415 222 1470 192" stroke="#FFF" strokeOpacity=".74" strokeWidth="1" />
      <g className="journey-svg-nodes" fill="url(#journey-node)">
        {[ [432, 720], [646, 612], [861, 504], [1075, 396], [1290, 288], [1504, 180] ].map(([cx, cy], index) => <circle key={index} className={`journey-node journey-node--${index + 1}${progress >= milestoneThresholds[index] ? " is-reached" : ""}`} cx={cx} cy={cy} r={index === 5 ? 7 : index === 0 ? 6 : 5.5} />)}
      </g>
      <g stroke="#C982D2" strokeOpacity=".34" strokeWidth="1.5">
        <ellipse cx="432" cy="720" rx="88" ry="17" transform="rotate(-16 432 720)" />
        <ellipse cx="646" cy="612" rx="82" ry="16" transform="rotate(-16 646 612)" />
        <ellipse cx="861" cy="504" rx="77" ry="15" transform="rotate(-13 861 504)" />
        <ellipse cx="1075" cy="396" rx="83" ry="16" transform="rotate(-15 1075 396)" />
        <ellipse cx="1290" cy="288" rx="81" ry="15" transform="rotate(-17 1290 288)" />
        <ellipse cx="1504" cy="180" rx="83" ry="15" transform="rotate(-18 1504 180)" />
      </g>
      <path pathLength="1" className="journey-mobile-route journey-progress-path" d="M240 846 C445 820 835 805 1328 702 C1510 625 650 637 272 558 C0 474 890 490 1328 414 C1580 335 620 352 272 270 C10 187 940 202 1296 126 C1430 91 1447 61 1400 35" stroke="url(#journey-thread)" strokeWidth="3" strokeDasharray="3 7" strokeLinecap="round" />
    </svg>
  );
}

function Mountain({ summit = false }) {
  return <div className={`journey-mountain ${summit ? "journey-mountain--summit" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 160 100" role="presentation">
      <defs>
        <linearGradient id={summit ? "peak-glow" : "mountain-glow"} x1="25" y1="78" x2="113" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#CF64CB" /><stop offset=".53" stopColor="#E4B5FF" /><stop offset="1" stopColor="#F9F4FF" /></linearGradient>
        <linearGradient id={summit ? "peak-shade" : "mountain-shade"} x1="90" y1="30" x2="135" y2="89" gradientUnits="userSpaceOnUse"><stop stopColor="#C9A4F0" /><stop offset="1" stopColor="#E47BC2" /></linearGradient>
      </defs>
      <path d="M6 83 28 57 42 64 67 25 81 47 96 16 116 52 130 40 155 82Z" fill="url(#mountain-glow)" />
      <path d="m67 25 14 22-19 11 13 25H6l22-26 14 7Z" fill="#FAF6FF" fillOpacity=".86" />
      <path d="m81 47 15-31 20 36-14 8 18 22H75l-13-25Z" fill="url(#mountain-shade)" fillOpacity=".74" />
      <path d="m96 16 8 15-9-5-6 12-8 9Z" fill="#FFF" fillOpacity=".96" />
      <path d="M10 83h141" stroke="#FFF" strokeOpacity=".75" strokeWidth="2" />
    </svg>
    {summit && <span className="journey-flag" aria-hidden="true"><i /></span>}
  </div>;
}

function JourneyProp({ kind }) {
  if (kind === "orb") return <div className="journey-prop journey-prop--orb" aria-hidden="true"><i className="orb-ring" /><i className="orb-sphere" /><i className="orb-glint" /></div>;
  if (kind === "mountain") return <div className="journey-prop journey-prop--mountain" aria-hidden="true"><Mountain /></div>;
  if (kind === "layers") return <div className="journey-prop journey-prop--layers" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (kind === "bubbles") return <div className="journey-prop journey-prop--bubbles" aria-hidden="true"><i /><i /><i /><i /><i /><b /></div>;
  if (kind === "cubes") return <div className="journey-prop journey-prop--cubes" aria-hidden="true"><i className="journey-cube cube-one"><b /><b /><b /></i><i className="journey-cube cube-two"><b /><b /><b /></i><i className="journey-cube cube-three"><b /><b /><b /></i><i className="journey-cube cube-four"><b /><b /><b /></i></div>;
  return <div className="journey-prop journey-prop--summit" aria-hidden="true"><Mountain summit /></div>;
}

function JourneyMilestone({ milestone, index, active, reached, onActivate }) {
  const { year, title, description, phase, Icon, x, y, kind } = milestone;
  return (
    <article
      className={`journey-milestone journey-milestone--${index + 1}${active ? " is-active" : ""}${reached ? " is-reached" : ""}`}
      style={{ "--point-x": x, "--point-y": y }}
      tabIndex={0}
      role="group"
      aria-label={`${year}: ${title} ${description}`}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
    >
      <div className="journey-label">
        <span className="journey-icon"><Icon aria-hidden="true" size={18} strokeWidth={2.1} /></span>
        <small className="journey-year">{year}</small>
        <strong>{title}</strong>
        <span className="journey-description">{description}</span>
        <span className="journey-phase">{phase}</span>
      </div>
      <span className="journey-platform" aria-hidden="true"><i /><b /></span>
      <JourneyProp kind={kind} />
      <span className="journey-point-light" aria-hidden="true" />
    </article>
  );
}

export function OurJourneySection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollRange = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
        section.style.setProperty("--journey-parallax", `${(0.5 - progress) * 20}px`);
        section.style.setProperty("--journey-progress", progress);
        setScrollProgress(progress);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return (
    <section ref={sectionRef} className="about-ref-journey-scroll-section" aria-labelledby="about-ref-journey-title">
      <div className="about-ref-journey-section" onMouseLeave={() => setActiveIndex(null)}>
        <header className="about-ref-journey-copy">
        <span className="about-ref-journey-kicker">THE MILESTONES<i /></span>
        <h2 id="about-ref-journey-title">OUR<br /><span>JOURNEY</span><br />SO FAR<span className="journey-title-period">.</span></h2>
        <p>From a simple idea to real solutions — here’s how we’ve grown, step by step, with people who believe in what we build.</p>
        <div className="about-ref-journey-promise"><i />MORE TO SOLVE.<br />A BRIGHTER TOMORROW.</div>
        </header>

        <div className="journey-map" aria-label="Builstry milestones from 2024 onward">
          <JourneyPath progress={scrollProgress} />
          <span className="journey-atmosphere journey-atmosphere--one" aria-hidden="true" />
          <span className="journey-atmosphere journey-atmosphere--two" aria-hidden="true" />
          <span className="journey-star journey-star--one" aria-hidden="true">✦</span>
          <span className="journey-star journey-star--two" aria-hidden="true">✧</span>
          <span className="journey-star journey-star--three" aria-hidden="true">✦</span>
          {milestones.map((milestone, index) => <JourneyMilestone key={`${milestone.year}-${milestone.phase}`} milestone={milestone} index={index} active={activeIndex === index} reached={scrollProgress >= milestoneThresholds[index]} onActivate={setActiveIndex} />)}
        </div>
        <div className="about-ref-journey-footnote"><i />HIGHER IDEAS.<br />BRIGHTER TOMORROWS.</div>
      </div>
    </section>
  );
}
