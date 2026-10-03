"use client";

import { Lightbulb, TrendingUp, Zap } from "lucide-react";

function updateSpotlight(event) {
  if (event.pointerType === "touch") return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

  card.style.setProperty("--spot-x", `${x * 100}%`);
  card.style.setProperty("--spot-y", `${y * 100}%`);
  card.style.setProperty("--pointer-tilt-x", `${((0.5 - y) * 2.4).toFixed(2)}deg`);
  card.style.setProperty("--pointer-tilt-y", `${((x - 0.5) * 2.4).toFixed(2)}deg`);
}

function resetCardMotion(event) {
  if (event.pointerType === "touch") return;
  const card = event.currentTarget;
  card.style.setProperty("--pointer-tilt-x", "0deg");
  card.style.setProperty("--pointer-tilt-y", "0deg");
}

export default function HomeConceptScene() {
  return (
    <div className="home-concept-scene" aria-hidden="true">
      <svg className="home-concept-orbits" viewBox="0 0 560 300" fill="none" preserveAspectRatio="none">
        <path className="home-concept-orbit orbit-a" d="M18 208C70 145 125 48 215 45c87-3 77 78 159 90 77 11 126-39 168-83" />
        <path className="home-concept-orbit orbit-b" d="M12 112c74 30 86 124 178 139 105 17 117-79 203-82 68-2 108 48 154 66" />
        <path className="home-concept-orbit orbit-c" d="M42 267c41-61 105-106 168-95 69 12 70 71 143 66 61-4 103-66 167-118" />
        <circle className="orbit-anchor anchor-a" cx="18" cy="208" r="4" />
        <circle className="orbit-anchor anchor-b" cx="542" cy="52" r="4" />
        <circle className="orbit-anchor anchor-c" cx="12" cy="112" r="3.5" />
        <circle className="orbit-anchor anchor-d" cx="547" cy="235" r="4" />
      </svg>

      <span className="home-concept-node node-one" />
      <span className="home-concept-node node-two" />
      <span className="home-concept-node node-three" />
      <span className="home-concept-node node-four" />

      <div className="home-concept-card concept-card-idea" onPointerMove={updateSpotlight} onPointerLeave={resetCardMotion}>
        <span className="home-concept-icon"><Lightbulb size={18} strokeWidth={1.8} /></span>
        <span className="home-concept-card-copy">
          <strong>IDEA</strong>
          <small>Insight into possibility</small>
          <span className="home-concept-card-lines"><i /><i /></span>
        </span>
        <span className="home-concept-card-mark">✦</span>
      </div>

      <div className="home-concept-card concept-card-automation" onPointerMove={updateSpotlight} onPointerLeave={resetCardMotion}>
        <span className="home-concept-icon"><Zap size={17} strokeWidth={1.9} /></span>
        <span className="home-concept-card-copy">
          <strong>AUTOMATION</strong>
          <small>Make better work flow</small>
          <span className="home-concept-card-lines"><i /><i /></span>
        </span>
        <span className="home-concept-card-mark">↗</span>
      </div>

      <div className="home-concept-card concept-card-growth" onPointerMove={updateSpotlight} onPointerLeave={resetCardMotion}>
        <span className="home-concept-icon"><TrendingUp size={18} strokeWidth={1.8} /></span>
        <span className="home-concept-card-copy">
          <strong>GROWTH</strong>
          <small>Turn momentum into impact</small>
          <span className="home-concept-card-lines"><i /><i /></span>
        </span>
        <span className="home-concept-card-mark">✧</span>
      </div>
    </div>
  );
}
