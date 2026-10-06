"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, Text } from "@react-three/drei";
import Link from "./RouterLink";
import {
  ArrowRight,
  Clock3,
  Diamond,
  GraduationCap,
  Handshake,
  Lightbulb,
  Pencil,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

const principles = [
  { id: "clarity", title: "CLARITY", contrast: "OVER COMPLEXITY", description: "We choose simple, clear thinking over unnecessary complexity.", Icon: Target },
  { id: "evidence", title: "EVIDENCE", contrast: "OVER ASSUMPTIONS", description: "We rely on what’s real, not what’s assumed.", Icon: Lightbulb },
  { id: "useful", title: "USEFUL", contrast: "OVER IMPRESSIVE", description: "We build what creates real value, not what just looks good.", Icon: Diamond },
  { id: "long-term", title: "LONG-TERM", contrast: "OVER SHORT-TERM", description: "We care about lasting impact, not quick wins.", Icon: Clock3 },
  { id: "building", title: "BUILDING", contrast: "OVER TALKING", description: "We turn ideas into real solutions.", Icon: UsersRound },
];
const networkOrbitCards = [
  { title: "FOUNDERS", description: "Vision & leadership to spark what’s next.", color: "#F7F8FA", accent: "#C51F5D" },
  { title: "STUDENTS", description: "Ideas & energy to challenge the status quo.", color: "#F4B5CF", accent: "#243447" },
  { title: "BUILDERS", description: "Code & craft to turn ideas into reality.", color: "#D8E5F0", accent: "#C51F5D" },
  { title: "DESIGNERS", description: "Experience & aesthetics to make it human.", color: "#FFFFFF", accent: "#243447" },
  { title: "MENTORS & PARTNERS", description: "Guidance & reach to scale impact.", color: "#F7E4ED", accent: "#C51F5D" },
];

function updatePrincipleTilt(event) {
  if (event.pointerType && event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
  const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1);
  event.currentTarget.style.setProperty("--pointer-tilt-x", `${((0.5 - y) * 9).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--pointer-tilt-y", `${((x - 0.5) * 9).toFixed(2)}deg`);
}

function resetPrincipleTilt(event) {
  event.currentTarget.style.removeProperty("--pointer-tilt-x");
  event.currentTarget.style.removeProperty("--pointer-tilt-y");
}

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
    </svg>
  );
}

function PrinciplesOrbit() {
  return (
    <svg className="about-ref-principles-orbit" viewBox="0 0 900 520" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="principles-orbit-line" x1="94" y1="197" x2="822" y2="376" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9AA8BA" stopOpacity=".12" />
          <stop offset=".49" stopColor="#C51F5D" stopOpacity=".54" />
          <stop offset="1" stopColor="#7486A0" stopOpacity=".17" />
        </linearGradient>
        <filter id="principle-orbit-glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="493" cy="261" rx="377" ry="131" stroke="url(#principles-orbit-line)" strokeWidth="1.8" transform="rotate(-11 493 261)" />
      <ellipse cx="489" cy="264" rx="322" ry="177" stroke="#8695AA" strokeOpacity=".15" strokeWidth="1.25" transform="rotate(13 489 264)" />
      <ellipse cx="495" cy="265" rx="268" ry="91" stroke="#C51F5D" strokeOpacity=".18" strokeWidth="1.1" transform="rotate(-4 495 265)" />
      <path d="M116 277c95-112 224-111 377-13 145 93 242 97 349-5" stroke="url(#principles-orbit-line)" strokeWidth="1.5" />
      <circle cx="116" cy="277" r="7" fill="#C51F5D" fillOpacity=".78" />
      <circle cx="842" cy="259" r="7" fill="#71829C" fillOpacity=".8" />
      <circle cx="245" cy="393" r="4.5" fill="#C51F5D" fillOpacity=".68" />
      <circle cx="695" cy="385" r="5" fill="#C51F5D" fillOpacity=".62" />
      <circle cx="738" cy="120" r="3.5" fill="#8695AA" fillOpacity=".68" />
      <circle cx="311" cy="151" r="3" fill="#C51F5D" fillOpacity=".52" />
      <circle cx="493" cy="265" r="29" fill="#C51F5D" fillOpacity=".12" filter="url(#principle-orbit-glow)" />
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

function OrbitCard({ card, angle, index, activeIndex, interaction, orbitRef, onCardHover }) {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.getElapsedTime();
    const frontness = Math.max(0, Math.sin(angle + (orbitRef.current?.rotation.y || 0)));
    const target = [Math.cos(angle) * 1.86, Math.sin(elapsed * 0.78 + index * 1.7) * 0.12 + Math.sin(angle * 1.5) * 0.06 - frontness * 0.56, Math.sin(angle) * 1.86];
    const focused = activeIndex === index && interaction.current?.index === index;
    if (interaction.current?.index !== null && !focused) return;
    const focusAmount = focused ? (interaction.current.phase === "release" ? interaction.current.progress : interaction.current.progress) : 0;
    const ease = focusAmount * focusAmount * (3 - 2 * focusAmount);
    group.current.position.x += ((focused ? 0 : target[0]) - group.current.position.x) * 0.14;
    group.current.position.y += ((focused ? 0 : target[1]) - group.current.position.y) * 0.14;
    group.current.position.z += ((focused ? 0 : target[2]) - group.current.position.z) * 0.14;
    group.current.scale.setScalar(1 + ease * 0.14);
    group.current.rotation.x += ((focused ? 0 : Math.sin(elapsed * 0.52 + index) * 0.035 + frontness * 0.24) - group.current.rotation.x) * 0.12;
    group.current.rotation.z += ((focused ? 0 : Math.cos(elapsed * 0.42 + index) * 0.025) - group.current.rotation.z) * 0.12;
    group.current.rotation.y += ((focused ? 0 : 0) - group.current.rotation.y) * 0.12;
  });
  const focused = activeIndex === index;
  return (
    <group ref={group} onPointerEnter={(event) => { event.stopPropagation(); onCardHover?.(card); interaction.current?.start?.(index); }} onPointerDown={(event) => { event.stopPropagation(); onCardHover?.(card); interaction.current?.start?.(index); }}>
      <RoundedBox args={[1.42, 0.94, 0.14]} radius={0.12} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color={focused ? "#243447" : card.color} roughness={0.28} metalness={0.12} emissive={focused ? "#243447" : card.accent} emissiveIntensity={focused ? 0.12 : 0.08} />
      </RoundedBox>
      {[1, -1].map((side) => (
        <group key={side} rotation={[0, side === -1 ? Math.PI : 0, 0]}>
          <mesh position={[0, 0.18, 0.085]}>
            <planeGeometry args={[1.08, 0.045]} />
            <meshBasicMaterial color={card.accent} transparent opacity={0.8} />
          </mesh>
          <Text position={[0, 0.29, 0.09]} fontSize={0.115} color={focused ? "#F7F8FA" : "#243447"} anchorX="center" anchorY="middle" letterSpacing={0.02}>{card.title}</Text>
          <Text position={[0, 0.01, 0.09]} fontSize={0.068} color={focused ? "#DCE6EF" : "#526277"} maxWidth={1.12} lineHeight={1.15} textAlign="center" anchorX="center" anchorY="middle">{card.description}</Text>
          <Text position={[0, -0.33, 0.09]} fontSize={0.06} color={card.accent} anchorX="center" anchorY="middle" letterSpacing={0.1}>EXPLORE →</Text>
        </group>
      ))}
    </group>
  );
}

function CubeFaceMarks() {
  const faces = [
    { position: [0, 0, 0.805], rotation: [0, 0, 0] },
    { position: [0, 0, -0.805], rotation: [0, Math.PI, 0] },
    { position: [0.805, 0, 0], rotation: [0, Math.PI / 2, 0] },
    { position: [-0.805, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    { position: [0, 0.805, 0], rotation: [-Math.PI / 2, 0, 0] },
    { position: [0, -0.805, 0], rotation: [Math.PI / 2, 0, 0] },
  ];
  return faces.map((face, index) => (
    <Text key={index} position={face.position} rotation={face.rotation} fontSize={0.48} color="#F7F8FA" anchorX="center" anchorY="middle" outlineColor="#F7F8FA" outlineWidth={0.008}>B</Text>
  ));
}

function NetworkOrbitScene({ onCardHover }) {
  const cube = useRef(null);
  const orbit = useRef(null);
  const interaction = useRef({ index: null, phase: "idle", progress: 0, startedAt: 0, start: null });
  const [activeIndex, setActiveIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    if (cube.current && !paused) cube.current.rotation.y += delta * 0.36;
    if (orbit.current && !paused) {
      orbit.current.rotation.y -= delta * 0.17;
      orbit.current.position.y = Math.sin(elapsed * 0.48) * 0.03;
    }
    const current = interaction.current;
    if (current.index !== null) {
      const age = (performance.now() - current.startedAt) / 1000;
      if (current.phase === "focus") {
        current.progress = Math.min(1, age / 0.42);
        if (age >= 2.42) {
          current.phase = "release";
          current.startedAt = performance.now();
        }
      } else if (current.phase === "release") {
        current.progress = Math.max(0, 1 - age / 0.42);
        if (age >= 0.42) {
          current.index = null;
          current.phase = "idle";
          current.progress = 0;
          setActiveIndex(null);
          setPaused(false);
          onCardHover?.(null);
        }
      }
    }
  });
  interaction.current.start = (index) => {
    if (interaction.current.index !== null) return;
    interaction.current.index = index;
    interaction.current.phase = "focus";
    interaction.current.progress = 0;
    interaction.current.startedAt = performance.now();
    setActiveIndex(index);
    setPaused(true);
  };
  return (
    <>
      <ambientLight intensity={1.15} color="#F7F8FA" />
      <directionalLight castShadow position={[4, 6, 5]} intensity={3.2} color="#FFFFFF" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 1.5, 2]} intensity={8} distance={7} color="#C51F5D" />
      <pointLight position={[3, -1, -2]} intensity={4} distance={6} color="#8DB6D4" />
      <group ref={orbit}>
        {networkOrbitCards.map((card, index) => {
          const angle = (index / networkOrbitCards.length) * Math.PI * 2;
          return <OrbitCard card={card} angle={angle} index={index} activeIndex={activeIndex} interaction={interaction} orbitRef={orbit} onCardHover={onCardHover} key={card.title} />;
        })}
      </group>
      <group ref={cube}>
        <RoundedBox args={[1.56, 1.56, 1.56]} radius={0.24} smoothness={7} castShadow receiveShadow>
          <meshStandardMaterial color="#141D26" roughness={0.24} metalness={0.24} emissive="#0B1118" emissiveIntensity={0.12} />
        </RoundedBox>
        <CubeFaceMarks />
      </group>
      <ContactShadows position={[0, -1.1, 0]} opacity={0.42} scale={7} blur={2.8} far={4.5} resolution={512} color="#141D26" />
    </>
  );
}

export function NetworkShowcaseSection() {
  return (
    <section className="about-ref-showcase about-ref-network-showcase" aria-labelledby="about-network-heading">
      <div className="about-ref-network-copy">
        <span className="about-ref-showcase-kicker">THE NETWORK<i /></span>
        <h2 id="about-network-heading" className="about-ref-showcase-heading">
          <span>BUILSTRY</span>
          <span className="is-accent">IS BIGGER</span>
          <span>THAN</span>
          <span>ITS TEAM.</span>
        </h2>
        <p>We work with founders, mentors, researchers, students and partners to turn bold ideas into real impact.</p>
        <Link className="about-ref-showcase-cta" href="/careers">Join our journey <ArrowRight aria-hidden="true" size={20} /></Link>
        <div className="about-ref-showcase-rule" />
        <span className="about-ref-showcase-microcopy">MORE PERSPECTIVES.<br />BETTER POSSIBILITIES.</span>
      </div>

      <div className="about-ref-network-stage" aria-label="A sticky-card network journey across founders, partners, investors, and students">
        <svg className="about-ref-network-orbit" viewBox="0 0 980 620" fill="none" aria-hidden="true">
          <ellipse cx="490" cy="325" rx="410" ry="150" stroke="rgba(197, 31, 93, 0.28)" strokeWidth="2" transform="rotate(-15 490 325)" />
          <path d="M130 330C240 190 360 180 500 330C640 480 760 470 858 332" stroke="rgba(197, 31, 93, 0.24)" strokeWidth="1.5" fill="none" />
          <circle cx="130" cy="330" r="6" fill="#F3579E" />
          <circle cx="858" cy="332" r="7" fill="#F3579E" opacity="0.9" />
          <circle cx="350" cy="468" r="5" fill="#F3579E" opacity="0.7" />
          <circle cx="670" cy="220" r="5" fill="#F3579E" opacity="0.8" />
        </svg>

        <div className="about-ref-network-handnote">Different minds.<br />Same mission.</div>

        <div className="about-ref-network-stack" aria-label="Builstry network groups">
          <div className="about-ref-network-tile about-ref-network-tile--founders">
            <div className="about-ref-network-tile-icon"><UsersRound size={29} strokeWidth={1.8} /></div>
            <span>Founders</span>
            <small>Visionaries building what&apos;s next.</small>
            <button type="button" className="about-ref-network-tile-arrow" aria-label="Explore founders"><ArrowRight size={16} /></button>
          </div>
          <div className="about-ref-network-tile about-ref-network-tile--mentors">
            <div className="about-ref-network-tile-icon"><Handshake size={27} strokeWidth={1.8} /></div>
            <span>Mentors &amp;<br />Partners</span>
            <small>Guidance,<br />support, growth.</small>
            <button type="button" className="about-ref-network-tile-arrow" aria-label="Explore mentors and partners"><ArrowRight size={16} /></button>
          </div>
          <div className="about-ref-network-tile about-ref-network-tile--investors">
            <div className="about-ref-network-tile-icon"><TrendingUp size={27} strokeWidth={1.8} /></div>
            <span>Investors</span>
            <small>Fueling<br />opportunities.</small>
            <button type="button" className="about-ref-network-tile-arrow" aria-label="Explore investors"><ArrowRight size={16} /></button>
          </div>
          <div className="about-ref-network-tile about-ref-network-tile--designers">
            <div className="about-ref-network-tile-icon"><Pencil size={27} strokeWidth={1.8} /></div>
            <span>Designers</span>
            <small>Building<br />experiences.</small>
            <button type="button" className="about-ref-network-tile-arrow" aria-label="Explore designers"><ArrowRight size={16} /></button>
          </div>
          <div className="about-ref-network-tile about-ref-network-tile--students">
            <div className="about-ref-network-tile-icon"><GraduationCap size={27} strokeWidth={1.8} /></div>
            <span>Students</span>
            <small>Learning &amp;<br />creating tomorrow.</small>
            <button type="button" className="about-ref-network-tile-arrow" aria-label="Explore students"><ArrowRight size={16} /></button>
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
        <PrinciplesOrbit />
        <div className="about-ref-principles-nodes">
          {principles.map(({ id, title, contrast, description, Icon }, index) => {
            const active = hoveredPrinciple === null ? index === 0 : hoveredPrinciple === index;
            return (
              <article
                className={`about-ref-principle-node about-ref-principle-node--${id}${active ? " is-active" : ""}`}
                key={title}
                tabIndex={0}
                role="group"
                aria-label={`${title} ${contrast}: ${description}`}
                onMouseEnter={() => setHoveredPrinciple(index)}
                onMouseLeave={(event) => { setHoveredPrinciple(null); resetPrincipleTilt(event); }}
                onPointerMove={updatePrincipleTilt}
                onPointerLeave={(event) => { setHoveredPrinciple(null); resetPrincipleTilt(event); }}
                onFocus={() => setHoveredPrinciple(index)}
                onBlur={() => setHoveredPrinciple(null)}
              >
                <span className="about-ref-principle-icon"><Icon aria-hidden="true" size={25} strokeWidth={1.8} /></span>
                <strong>{title}</strong>
                <span className="about-ref-principle-contrast">{contrast}</span>
                <span className="about-ref-principle-description">{description}</span>
              </article>
            );
          })}
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
