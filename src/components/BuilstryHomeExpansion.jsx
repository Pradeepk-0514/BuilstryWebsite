import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BuilstryHomeExpansion.css";

const verticals = [
  {
    index: "01",
    label: "SOLVE",
    title: "Industry solutions",
    text: "We find the pressure points inside real systems and build practical technology around them.",
    items: ["Discovery & problem framing", "AI and software systems", "Hardware and workflow design", "Launch and iteration"],
    tone: "light",
  },
  {
    index: "02",
    label: "SHARPEN",
    title: "Business & product strategy",
    text: "We turn uncertainty into a clearer product, a stronger proposition and a path people can act on.",
    items: ["Product direction", "Brand and experience strategy", "Operating models", "Growth experiments"],
    tone: "dark",
  },
  {
    index: "03",
    label: "SPARK",
    title: "Innovation & community",
    text: "We create the conditions for people, ideas and opportunities to move from potential into momentum.",
    items: ["Build sprints", "Learning programs", "Innovation spaces", "Founder and creator networks"],
    tone: "magenta",
  },
];

const benefits = [
  ["01", "Clarity before velocity", "A sharper question creates a better use of time, technology and attention."],
  ["02", "Useful by design", "Every system is shaped around the people who will live with it after launch."],
  ["03", "Momentum that compounds", "We build a rhythm of learning, shipping and improving—not a one-off moment."],
  ["04", "Future-ready thinking", "AI, community and craft come together to keep the next move possible."],
];

const faqs = [
  ["What kind of problems does Builstry take on?", "We work with ambitious problems across products, businesses, industries and communities—especially where the next answer is not obvious."],
  ["Can Builstry support both strategy and execution?", "Yes. We can help frame the opportunity, shape the direction and build the first useful version with your team."],
  ["Do you work with early-stage teams?", "We do. Early clarity, practical prototypes and a strong learning loop can change the trajectory of a young idea."],
  ["How do we start a conversation?", "Bring us the problem, the question or the rough idea. We will help identify the most useful next step."],
];

const partners = ["FOUNDERS", "BUILDERS", "DESIGNERS", "RESEARCHERS", "MENTORS", "COMMUNITIES"];
const team = [
  ["MK", "MUKESHKUMAR", "Product strategy"],
  ["R", "ROWFIN", "Growth and momentum"],
  ["DP", "DESIGN PARTNER", "Experience and interface"],
  ["TP", "TECH PARTNER", "Engineering and systems"],
];

export default function BuilstryHomeExpansion() {
  const [activeVertical, setActiveVertical] = useState(0);
  const [openVerticalItem, setOpenVerticalItem] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const active = verticals[activeVertical];

  return (
    <div className="home-expansion">
      <section className="home-expansion-section expansion-capabilities" aria-labelledby="expanded-capabilities-title">
        <div className="expansion-kicker">BUILSTRY / CAPABILITIES</div>
        <div className="expansion-capabilities-grid">
          <div>
            <h2 id="expanded-capabilities-title">A SHARPER<br />WAY TO<br />MOVE FROM<br />QUESTIONS TO<br /><em>POSSIBILITY.</em></h2>
          </div>
          <div className="expansion-capabilities-copy">
            <p>We combine strategic thinking, hands-on building and a community of curious people to make difficult work feel more actionable.</p>
            <div className="expansion-capability-stats"><span><b>01</b><small>SEE THE<br />SYSTEM</small></span><span><b>02</b><small>MAKE THE<br />MOVE</small></span><span><b>03</b><small>LEARN AS<br />WE GO</small></span></div>
          </div>
        </div>
      </section>

      <section className="home-expansion-section expansion-engine" aria-labelledby="engine-title">
        <div className="expansion-section-heading"><span className="expansion-kicker">THE CREATIVITY ENGINE</span><h2 id="engine-title">CONNECT.<br /><em>THINK. CREATE.</em></h2><p>Three modes of work, one continuous loop.</p></div>
        <div className="engine-track">
          {["CONNECT", "THINK", "CREATE"].map((title, index) => <article className="engine-step" key={title}><span className="engine-number">0{index + 1}</span><div className="engine-symbol" aria-hidden="true">{["⌁", "◇", "✦"][index]}</div><h3>{title}</h3><p>{["Decode the people, problem and possibility before reaching for an answer.", "Reframe assumptions and make the important trade-offs visible.", "Turn the direction into a system, prototype or experience that can move."][index]}</p></article>)}
        </div>
      </section>

      <section className="home-expansion-section expansion-ecosystem" aria-labelledby="ecosystem-title">
        <div className="ecosystem-copy"><span className="expansion-kicker">THE BUILSTRY ECOSYSTEM</span><h2 id="ecosystem-title">ONE STUDIO.<br /><em>MANY WAYS</em><br />FORWARD.</h2><p>Our work can begin with a difficult question, a product that needs a rethink, or a group of people ready to build what comes next.</p><Link className="expansion-link" to="/capabilities">Explore capabilities <span>↗</span></Link></div>
        <div className="ecosystem-orbit" aria-hidden="true"><span className="orbit-core">B</span><i className="orbit-ring orbit-ring-one" /><i className="orbit-ring orbit-ring-two" /><b className="orbit-label orbit-label-one">STRATEGY</b><b className="orbit-label orbit-label-two">SYSTEMS</b><b className="orbit-label orbit-label-three">PEOPLE</b></div>
      </section>

      <section className="home-expansion-section expansion-verticals" aria-labelledby="verticals-title">
        <div className="expansion-section-heading verticals-heading"><span className="expansion-kicker">THREE WAYS TO WORK TOGETHER</span><h2 id="verticals-title">CHOOSE THE<br /><em>PRESSURE POINT</em></h2><p>Each vertical is a different entry into the same Builstry way of working.</p></div>
        <div className="verticals-layout"><nav className="verticals-nav" aria-label="Builstry service categories">{verticals.map((item, index) => <button type="button" className={index === activeVertical ? "is-active" : ""} onClick={() => { setActiveVertical(index); setOpenVerticalItem(0); }} key={item.index}><span>{item.index}</span>{item.label}<b>↗</b></button>)}</nav><article className="vertical-detail" key={active.index}><div><span className="vertical-detail-index">{active.index} / 03</span><h3>{active.title}</h3><p>{active.text}</p><Link className="expansion-link" to="/contact">Start with this direction <span>↗</span></Link></div><ul>{active.items.map((item, index) => <li className={openVerticalItem === index ? "is-open" : ""} key={item}><button type="button" aria-expanded={openVerticalItem === index} onClick={() => setOpenVerticalItem(openVerticalItem === index ? -1 : index)}><span>+</span><strong>{item}</strong><b>{openVerticalItem === index ? "−" : "↗"}</b></button>{openVerticalItem === index && <p>{item} becomes a focused Builstry workstream: clear enough to act on, flexible enough to evolve with the problem.</p>}</li>)}</ul></article></div>
      </section>

      <section className="home-expansion-section expansion-benefits" aria-labelledby="benefits-title"><div className="expansion-benefits-intro"><span className="expansion-kicker">WHAT CHANGES</span><h2 id="benefits-title">THE BENEFIT<br />IS NOT JUST<br /><em>THE OUTPUT</em></h2><p>It is the new ability to see, decide and build with more confidence.</p></div><div className="benefits-list">{benefits.map(([index, title, text]) => <article className="benefit-item" key={index}><span>{index}</span><div><h3>{title}</h3><p>{text}</p></div><b>↗</b></article>)}</div></section>

      <section className="home-expansion-section expansion-growth" aria-labelledby="growth-title">
        <div className="growth-star growth-star-one" aria-hidden="true">✦</div>
        <div className="growth-star growth-star-two" aria-hidden="true">✦</div>
        <div className="growth-panel">
          <div className="growth-copy">
            <span className="expansion-kicker">A PRACTICAL GROWTH<br />ECOSYSTEM</span>
            <h2 id="growth-title">IDEAS<br />BECOME<br />STRONGER<br />WHEN<br />THE LOOP<br /><em>STAYS OPEN.</em></h2>
          </div>
          <div className="growth-loop" aria-label="The open growth loop">
            {[
              ["QUESTION", "↗", "Start with the signal worth following."],
              ["PROTOTYPE", "⚙", "Make the possibility tangible."],
              ["LEARN", "♧", "Notice what the work is teaching you."],
              ["MOVE", "♢", "Carry the useful idea forward."],
            ].map(([title, icon, text], index) => (
              <React.Fragment key={title}>
                <article className="growth-card">
                  <div className="growth-card-icon" aria-hidden="true">{icon}</div>
                  <div className="growth-card-content"><h3>{title}</h3><p>{text}</p></div>
                </article>
                {index < 3 && <span className="growth-card-arrow" aria-hidden="true">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="home-expansion-section expansion-impact" aria-labelledby="impact-title"><div className="expansion-section-heading"><span className="expansion-kicker">THE WORK IN NUMBERS</span><h2 id="impact-title">SMALL SIGNALS.<br /><em>REAL MOVEMENTS.</em></h2></div><div className="impact-grid"><span><b>12+</b><small>INDUSTRIES<br />EXPLORED</small></span><span><b>05</b><small>LAB DIRECTIONS<br />IN MOTION</small></span><span><b>∞</b><small>QUESTIONS<br />WORTH ASKING</small></span><span><b>01</b><small>SHARED<br />PURPOSE</small></span></div></section>

      <section className="home-expansion-section expansion-partners" aria-labelledby="partners-title"><div className="partners-copy"><span className="expansion-kicker">THE NETWORK AROUND THE WORK</span><h2 id="partners-title">BUILT WITH<br />MORE THAN<br />ONE POINT<br /><em>OF VIEW.</em></h2><p>Founders, builders, designers, researchers and communities make the work more useful.</p></div><div className="partner-marquee" aria-label="Builstry collaborators">{partners.map((partner, index) => <span key={`${partner}-${index}`}>{partner}<i>✦</i></span>)}</div></section>

      <section className="home-expansion-section expansion-team" aria-labelledby="team-title"><div className="expansion-team-head"><span className="expansion-kicker">THE PEOPLE BEHIND THE POSSIBILITY</span><h2 id="team-title">A SMALL<br />TEAM WITH<br /><em>A WIDE LENS.</em></h2><Link className="expansion-link" to="/about">Meet the people <span>↗</span></Link></div><div className="expansion-team-grid">{team.map(([initials, name, role]) => <article key={name}><span>{initials}</span><h3>{name}</h3><p>{role}</p></article>)}</div></section>

      <section className="home-expansion-section expansion-faq" aria-labelledby="faq-title"><div className="faq-heading"><span className="expansion-kicker">QUESTIONS WE HEAR</span><h2 id="faq-title">START WITH<br />A GOOD<br /><em>QUESTION.</em></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={openFaq === index ? "is-open" : ""} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>0{index + 1}</span><strong>{question}</strong><b>{openFaq === index ? "−" : "+"}</b></button><p>{answer}</p></article>)}</div></section>

    </div>
  );
}
