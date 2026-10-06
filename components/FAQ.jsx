"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Reveal from "./Reveal";

const questions = [
  ["What does Builstry build?", "We build digital products, web & mobile apps, and scalable tech solutions for startups and businesses across industries."],
  ["Can you help from the first question through launch?", "Yes. We can help from discovery and strategy through design, build, launch and continued improvement."],
  ["Do you work with teams outside India?", "Yes. We work with ambitious teams wherever the right problem and the right people are."],
  ["What kinds of teams do you work with?", "We partner with founders, institutions, growing businesses and established teams looking for a sharper way forward."],
  ["How do we start a conversation?", "Bring the difficult question, rough idea or system that is not working yet. We will help you find the useful next move."],
  ["What’s happening on your side?", "Tell us what you are working through and we will help shape what comes next."],
];

function FAQIllustration() {
  return (
    <div className="faq-modern-illustration" aria-hidden="true">
      <span className="faq-modern-orbit faq-modern-orbit--one" />
      <span className="faq-modern-orbit faq-modern-orbit--two" />
      <span className="faq-modern-dot faq-modern-dot--one" />
      <span className="faq-modern-dot faq-modern-dot--two" />
      <span className="faq-modern-dot faq-modern-dot--three" />
      <span className="faq-modern-spark faq-modern-spark--one" />
      <span className="faq-modern-spark faq-modern-spark--two" />
      <span className="faq-modern-spark faq-modern-spark--three" />
      <span className="faq-modern-message faq-modern-message--back"><i /><i /><i /></span>
      <span className="faq-modern-message faq-modern-message--main">?</span>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(5);
  const [response, setResponse] = useState("");

  return (
    <section className="faq-section faq-modern" aria-labelledby="faq-title">
      <div className="faq-modern-intro">
        <Reveal>
          <div className="faq-modern-kicker"><span>FAQ</span><i /></div>
          <h2 id="faq-title" className="faq-modern-title"><span>QUESTIONS</span><span className="is-accent">WORTH</span><span className="is-accent">ASKING.</span></h2>
          <p className="faq-modern-lede">Start with the question. We will help shape what comes next.</p>
          <div className="faq-modern-subnote"><i /><span>FREQUENTLY ASKED<br />QUESTIONS</span></div>
        </Reveal>
        <FAQIllustration />
        <span className="faq-modern-corner-note">Got a question?<br />We&apos;re here to help!</span>
      </div>

      <div className="faq-modern-list" role="list">
        {questions.map(([question, answer], index) => {
          const isOpen = open === index;
          const isInputQuestion = index === 5;
          return (
            <Reveal key={question} delay={index * 0.04}>
              <article className={`faq-modern-item ${isOpen ? "is-open" : ""}`} role="listitem">
                <div className="faq-modern-trigger">
                  <span className="faq-modern-number">0{index + 1}</span>
                  <span className="faq-modern-question">{question}</span>
                  <button
                    className="faq-modern-icon"
                    type="button"
                    aria-label={isOpen ? `Collapse question ${index + 1}` : `Expand question ${index + 1}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </div>
                <div className="faq-modern-answer" aria-hidden={!isOpen}>
                  {isInputQuestion ? (
                    <div className="faq-modern-response">
                      <p className="faq-modern-response-note">Tell us what you are thinking and we&apos;ll help shape the next step.</p>
                      <textarea value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Tell us what you’re thinking…" aria-label="Your response" />
                    </div>
                  ) : <p>{answer}</p>}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
