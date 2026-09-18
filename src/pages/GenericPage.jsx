import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CtaModal from "../components/CtaModal";

const content = {
  about: { label: "BUILSTRY / ABOUT", heading: "BUILD WITH PURPOSE.", blocks: [["WHY WE EXIST", "The right technology starts with the right problem. Builstry brings strategy, design and technology together to create useful things that move people and businesses forward."], ["OUR PHILOSOPHY", "Find the real problem. Understand the people behind it. Reframe the opportunity. Design with intent. Build carefully. Keep evolving."]] },
  capabilities: { label: "BUILSTRY / CAPABILITIES", heading: "FROM PROBLEM TO POSSIBILITY.", blocks: [["STRATEGY", "Business and product strategy that clarifies where to go next."], ["TECHNOLOGY", "Digital products, AI systems and practical technology built around real needs."], ["INNOVATION", "Workshops, research and experimentation that turn uncertainty into direction."]] },
  "ai-forge": { label: "BUILSTRY / AI FORGE", heading: "MAKE AI USEFUL.", blocks: [["AI STRATEGY", "Find the workflows where intelligent systems can create measurable value."], ["AI PRODUCTS", "Design and build focused AI products, assistants and intelligent interfaces."], ["AUTOMATION", "Connect people, data and processes into faster, more capable systems."]] },
  "brand-studio": { label: "BUILSTRY / BRAND STUDIO", heading: "MAKE THE IDEA MATTER.", blocks: [["BRAND STRATEGY", "Positioning and narratives that give a business a clear reason to exist."], ["EXPERIENCE", "Identity, UX and visual systems that make brands feel coherent."], ["CREATIVE", "Content, motion and creative direction that turn attention into connection."]] },
};

function usePageReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".inner-page [data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
      else entry.target.classList.remove("is-visible");
    }), { threshold: 0.16 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

export default function GenericPage({ title, intro, path, notFound }) {
  usePageReveal();
  const [ctaMode, setCtaMode] = useState(null);
  if (notFound) return <section className="page-404" data-reveal><span className="eyebrow">404 / NOT FOUND</span><h1>THIS PAGE<br /><em>DOESN'T EXIST.</em></h1><p>{intro}</p><Link className="button button-primary" to="/">Back Home <span>→</span></Link></section>;

  const data = content[path];
  const blocks = data?.blocks || [["A PRACTICAL APPROACH", "This page is ready for the final Builstry-approved content. Keep the structure, replace only the copy and imagery supplied by the client."], ["CONTENT TO BE PROVIDED BY BUILSTRY", "No client facts, statistics, testimonials, leadership details or results are invented here."], ["START A CONVERSATION", "If there is a problem worth solving, let's figure out what should exist."]];

  return <div className="inner-page">
    <section className="inner-hero" data-reveal><div className="inner-hero-orbit" aria-hidden="true" /><div className="eyebrow">{data?.label || `BUILSTRY / ${title.toUpperCase()}`}</div><h1>{data?.heading || `${title.toUpperCase()}.`}</h1><p>{intro}</p><div className="hero-meta"><span>01 — DISCOVER</span><span>02 — BUILD</span><span>03 — MOVE FORWARD</span></div></section>
    <section className="inner-content">{blocks.map(([heading, text], index) => <article className="content-block" key={heading} data-reveal style={{ "--delay": `calc(var(--page-stagger-step) * ${index})` }}><div className="content-index">0{index + 1}</div><span>{heading}</span><h2>{text}</h2><i aria-hidden="true">↗</i></article>)}</section>
    <section className={`inner-cta ${path === "contact" ? "contact-final-cta" : ""}`} data-reveal><div><span className="eyebrow">BUILSTRY / NEXT</span><h2>HAVE A PROBLEM<br /><em>WORTH SOLVING?</em></h2></div>{path === "contact" ? <div className="contact-cta-actions"><button type="button" className="button button-primary" onClick={() => setCtaMode("inquiry")}>Start a Conversation <span>→</span></button><button type="button" className="button button-secondary" onClick={() => setCtaMode("booking")}>Book a Call <span>→</span></button></div> : <Link className="button button-primary" to="/contact">Start a Conversation <span>→</span></Link>}</section>
    {ctaMode && <CtaModal mode={ctaMode} onClose={() => setCtaMode(null)} />}
  </div>;
}
