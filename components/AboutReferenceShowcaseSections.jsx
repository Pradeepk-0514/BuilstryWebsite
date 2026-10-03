"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Code2,
  Diamond,
  GraduationCap,
  Handshake,
  Lightbulb,
  PencilRuler,
  Target,
  UsersRound,
} from "lucide-react";

const networkCards = [
  { key: "founders", title: "FOUNDERS", description: "Vision & leadership to spark what’s next.", Icon: UsersRound },
  { key: "students", title: "STUDENTS", description: "Ideas & energy to challenge the status quo.", Icon: GraduationCap },
  { key: "builders", title: "BUILDERS", description: "Code & craft to turn ideas into reality.", Icon: Code2 },
  { key: "designers", title: "DESIGNERS", description: "Experience & aesthetics to make it human.", Icon: PencilRuler },
  { key: "partners", title: "MENTORS & PARTNERS", description: "Guidance & reach to scale impact.", Icon: Handshake },
];

const principles = [
  { title: "CLARITY", contrast: "OVER COMPLEXITY", description: "We choose simple, clear thinking over unnecessary complexity.", Icon: Target },
  { title: "EVIDENCE", contrast: "OVER ASSUMPTIONS", description: "We rely on what’s real, not what’s assumed.", Icon: Lightbulb },
  { title: "USEFUL", contrast: "OVER IMPRESSIVE", description: "We build what creates real value, not what just looks good.", Icon: Diamond },
  { title: "LONG-TERM", contrast: "OVER SHORT-TERM", description: "We care about lasting impact, not quick wins.", Icon: Clock3 },
  { title: "BUILDING", contrast: "OVER TALKING", description: "We turn ideas into real solutions.", Icon: UsersRound },
];

function ScrollCue() {
  return (
    <div className="about-ref-showcase-scroll" aria-hidden="true">
      <span>SCROLL</span>
      <i className="about-ref-showcase-scroll-line" />
      <span className="about-ref-showcase-mouse"><i /></span>
    </div>
  );
}

function NetworkOrbit() {
  return (
    <svg className="about-ref-network-orbit" viewBox="0 0 900 620" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="network-orbit-line" x1="105" y1="255" x2="795" y2="442" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C51F5D" stopOpacity=".12" />
          <stop offset=".48" stopColor="#C51F5D" stopOpacity=".74" />
          <stop offset="1" stopColor="#6D7DAB" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id="network-cube-top" x1="344" y1="260" x2="560" y2="348" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity=".92" />
          <stop offset=".62" stopColor="#F7C4D9" stopOpacity=".82" />
          <stop offset="1" stopColor="#C51F5D" stopOpacity=".72" />
        </linearGradient>
        <linearGradient id="network-cube-left" x1="340" y1="320" x2="451" y2="482" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F8FA" stopOpacity=".88" />
          <stop offset="1" stopColor="#C51F5D" stopOpacity=".58" />
        </linearGradient>
        <linearGradient id="network-cube-right" x1="450" y1="320" x2="570" y2="478" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7C6" stopOpacity=".76" />
          <stop offset="1" stopColor="#8D1648" stopOpacity=".64" />
        </linearGradient>
        <filter id="network-cube-glow" x="260" y="190" width="390" height="380" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>
      <ellipse cx="450" cy="333" rx="354" ry="119" stroke="url(#network-orbit-line)" strokeWidth="2" transform="rotate(-12 450 333)" />
      <ellipse cx="450" cy="333" rx="315" ry="167" stroke="#7E8CA8" strokeOpacity=".16" strokeWidth="1.5" transform="rotate(14 450 333)" />
      <ellipse cx="450" cy="333" rx="260" ry="84" stroke="#C51F5D" strokeOpacity=".2" strokeWidth="1" transform="rotate(4 450 333)" />
      <path d="M112 343C226 208 341 193 450 333s225 126 338-9" stroke="url(#network-orbit-line)" strokeWidth="1.5" />
      <circle cx="119" cy="339" r="7" fill="#C51F5D" fillOpacity=".8" />
      <circle cx="776" cy="405" r="8" fill="#E17AA4" />
      <circle cx="256" cy="473" r="5" fill="#9AA5BD" />
      <circle cx="664" cy="211" r="6" fill="#C51F5D" fillOpacity=".7" />
      <circle cx="603" cy="465" r="4" fill="#C51F5D" fillOpacity=".65" />
      <path d="M350 263 450 205l101 58-101 59-100-59Z" fill="#C51F5D" fillOpacity=".22" filter="url(#network-cube-glow)" />
      <g className="about-ref-network-cube">
        <path d="m450 225 112 64-112 64-112-64 112-64Z" fill="url(#network-cube-top)" stroke="#FFFFFF" strokeOpacity=".96" strokeWidth="5" />
        <path d="m338 289 112 64v131l-112-65V289Z" fill="url(#network-cube-left)" stroke="#FFFFFF" strokeOpacity=".76" strokeWidth="4" />
        <path d="m562 289-112 64v131l112-65V289Z" fill="url(#network-cube-right)" stroke="#FFFFFF" strokeOpacity=".78" strokeWidth="4" />
        <path d="m396 289 54-31 55 31-55 32-54-32Z" fill="#C51F5D" fillOpacity=".82" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="3" />
        <path d="m450 321 55-32v65l-55 33v-66Z" fill="#A5164E" fillOpacity=".76" />
      </g>
    </svg>
  );
}

function PrinciplesOrbit() {
  return (
    <svg className="about-ref-principles-orbit" viewBox="0 0 900 430" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="principles-orbit-line" x1="126" y1="285" x2="781" y2="302" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8793AE" stopOpacity=".12" />
          <stop offset=".47" stopColor="#C51F5D" stopOpacity=".72" />
          <stop offset="1" stopColor="#C51F5D" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="principles-cube-top" x1="344" y1="185" x2="568" y2="278" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity=".94" />
          <stop offset=".58" stopColor="#F7B6D0" stopOpacity=".82" />
          <stop offset="1" stopColor="#C51F5D" stopOpacity=".68" />
        </linearGradient>
        <linearGradient id="principles-cube-left" x1="340" y1="244" x2="450" y2="385" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F8FA" stopOpacity=".9" />
          <stop offset="1" stopColor="#C51F5D" stopOpacity=".58" />
        </linearGradient>
        <linearGradient id="principles-cube-right" x1="450" y1="244" x2="565" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7C6" stopOpacity=".78" />
          <stop offset="1" stopColor="#861547" stopOpacity=".66" />
        </linearGradient>
        <filter id="principles-cube-glow" x="245" y="126" width="410" height="340" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="25" />
        </filter>
      </defs>
      <ellipse cx="450" cy="294" rx="365" ry="100" stroke="url(#principles-orbit-line)" strokeWidth="2" transform="rotate(-11 450 294)" />
      <ellipse cx="450" cy="294" rx="310" ry="135" stroke="#8793AE" strokeOpacity=".18" strokeWidth="1.4" transform="rotate(12 450 294)" />
      <path d="M140 300c94-97 193-97 310 0s207 102 310 0" stroke="url(#principles-orbit-line)" strokeWidth="1.5" />
      <circle cx="146" cy="304" r="7" fill="#C51F5D" fillOpacity=".82" />
      <circle cx="744" cy="298" r="8" fill="#D55B8A" fillOpacity=".72" />
      <circle cx="285" cy="392" r="5" fill="#9BA7BF" />
      <circle cx="642" cy="383" r="5" fill="#C51F5D" fillOpacity=".68" />
      <path d="m349 199 101-59 101 59-101 60-101-60Z" fill="#C51F5D" fillOpacity=".2" filter="url(#principles-cube-glow)" />
      <g className="about-ref-principles-cube">
        <path d="m450 166 108 62-108 63-108-63 108-62Z" fill="url(#principles-cube-top)" stroke="#FFFFFF" strokeOpacity=".96" strokeWidth="5" />
        <path d="m342 228 108 63v122l-108-63V228Z" fill="url(#principles-cube-left)" stroke="#FFFFFF" strokeOpacity=".76" strokeWidth="4" />
        <path d="m558 228-108 63v122l108-63V228Z" fill="url(#principles-cube-right)" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="4" />
        <path d="m399 228 51-30 54 30-54 32-51-32Z" fill="#C51F5D" fillOpacity=".82" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="3" />
        <path d="m450 260 54-32v63l-54 31v-62Z" fill="#9F174C" fillOpacity=".78" />
      </g>
    </svg>
  );
}

function HandwrittenNote({ variant = "network" }) {
  if (variant === "principles") {
    return (
      <div className="about-ref-handnote about-ref-handnote--principles" aria-label="Ideas to impact">
        <span>Ideas <i>→</i><br />Impact</span>
        <svg viewBox="0 0 104 54" fill="none" aria-hidden="true"><path d="M8 40C28 15 59 8 89 16M78 7l13 9-12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    );
  }
  return (
    <div className="about-ref-handnote about-ref-handnote--network" aria-label="Different minds. Same mission.">
      <span>Different minds.<br />Same mission.</span>
      <svg viewBox="0 0 78 70" fill="none" aria-hidden="true"><path d="M10 62C12 26 34 8 66 13M55 5l12 8-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

export function NetworkShowcaseSection() {
  const [hoveredPillar, setHoveredPillar] = useState(null);

  return (
    <section className="about-ref-showcase about-ref-network-showcase" aria-labelledby="about-network-heading">
      <div className="about-ref-network-copy">
        <span className="about-ref-showcase-kicker">THE NETWORK<i /></span>
        <h2 id="about-network-heading" className="about-ref-showcase-heading">
          <span>BUILSTRY</span><span className="is-accent">IS BIGGER</span><span>THAN</span><span>ITS TEAM.</span>
        </h2>
        <p>We work with founders, mentors, researchers, students and partners to turn bold ideas into real impact.</p>
        <Link className="about-ref-showcase-cta" href="/careers">Join our journey <ArrowRight aria-hidden="true" size={20} /></Link>
        <div className="about-ref-showcase-rule" />
        <span className="about-ref-showcase-microcopy">MORE PERSPECTIVES.<br />BETTER POSSIBILITIES.</span>
      </div>

      <div className="about-ref-network-stage">
        <NetworkOrbit />
        <HandwrittenNote />
        <div className="about-ref-network-cards">
          <div className="about-ref-network-orbit-ring">
            {networkCards.map(({ key, title, description, Icon }, index) => {
              const hovered = hoveredPillar === index;
              const muted = hoveredPillar !== null && !hovered;
              return (
                <Link
                  className={`about-ref-network-card about-ref-network-card--${key}${hovered ? " is-hovered" : ""}${muted ? " is-muted" : ""}`}
                  href="/capabilities"
                  key={key}
                  aria-label={`Explore ${title}: ${description}`}
                  onMouseEnter={() => setHoveredPillar(index)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  onFocus={() => setHoveredPillar(index)}
                  onBlur={() => setHoveredPillar(null)}
                >
                  <span className="about-ref-network-card-icon"><Icon aria-hidden="true" size={23} strokeWidth={1.9} /></span>
                  <strong>{title}</strong>
                  <span className="about-ref-network-card-description">{description}</span>
                  <span className="about-ref-network-card-explore">EXPLORE <ArrowRight aria-hidden="true" size={15} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

export function PrinciplesShowcaseSection() {
  const [hoveredPrinciple, setHoveredPrinciple] = useState(null);

  return (
    <section className="about-ref-showcase about-ref-principles-showcase" aria-labelledby="about-principles-heading">
      <div className="about-ref-principles-copy">
        <span className="about-ref-showcase-kicker">OUR STANDARD<i /></span>
        <h2 id="about-principles-heading" className="about-ref-showcase-heading">
          <span>WHAT WE</span><span className="is-accent">REFUSE</span><span>TO</span><span>COMPROMISE</span><span>ON.</span>
        </h2>
        <p>These principles guide every idea, product and partnership we build — now and always.</p>
        <div className="about-ref-showcase-note"><i /> <span>HIGHER STANDARDS.<br />BRIGHTER OUTCOMES.</span></div>
      </div>

      <div className="about-ref-principles-stage">
        <HandwrittenNote variant="principles" />
        <svg className="about-ref-principles-wires" viewBox="0 0 900 460" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M25 191C133 214 206 163 304 191s199 40 296 8 173-19 275 13" stroke="#C51F5D" strokeOpacity=".27" strokeWidth="1.5" />
          <path d="M106 354c98-78 203-76 344 1s245 72 348-3" stroke="#8C98B0" strokeOpacity=".22" strokeWidth="1.2" />
          {[92, 267, 450, 632, 808].map((x) => <circle key={x} cx={x} cy="197" r="5.5" fill="#F7F8FA" stroke="#C51F5D" strokeOpacity=".55" strokeWidth="2" />)}
        </svg>
        <div className="about-ref-principles-card-row">
          {principles.map(({ title, contrast, description, Icon }, index) => {
            const hovered = hoveredPrinciple === index;
            const muted = hoveredPrinciple !== null && !hovered;
            return (
              <article
                className={`about-ref-principle-card${index === 0 ? " about-ref-principle-card--first" : ""}${hovered ? " is-hovered" : ""}${muted ? " is-muted" : ""}`}
                key={title}
                tabIndex={0}
                role="group"
                aria-label={`${title} ${contrast}: ${description}`}
                onMouseEnter={() => setHoveredPrinciple(index)}
                onMouseLeave={() => setHoveredPrinciple(null)}
                onFocus={() => setHoveredPrinciple(index)}
                onBlur={() => setHoveredPrinciple(null)}
              >
                <small className="about-ref-principle-number">{String(index + 1).padStart(2, "0")}</small>
                <span className="about-ref-principle-icon"><Icon aria-hidden="true" size={25} strokeWidth={1.8} /></span>
                <strong>{title}</strong>
                <span className="about-ref-principle-contrast">{contrast}</span>
                <p>{description}</p>
                <i className="about-ref-principle-accent" />
              </article>
            );
          })}
        </div>
        <PrinciplesOrbit />
      </div>

      <ScrollCue />
    </section>
  );
}
