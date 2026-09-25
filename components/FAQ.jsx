"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const questions = [
  ["What does Builstry build?", "We bring strategy, design, technology and innovation together to build useful products, intelligent systems, brands and programs."],
  ["Can you help from the first question through launch?", "Yes. We can start with discovery and strategy, shape the right direction, build the experience and keep improving it after launch."],
  ["Do you work with teams outside India?", "Yes. Builstry works with ambitious teams wherever the right problem and the right people are."],
  ["What kinds of teams do you work with?", "We partner with founders, institutions, growing businesses and established teams looking for a sharper way forward."],
  ["How do we start a conversation?", "Bring the difficult question, rough idea or system that is not working yet. We will help you find the useful next move."],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="faq-section" aria-labelledby="faq-title"><div className="faq-heading"><Reveal><p className="eyebrow dark">FAQ</p><h2 id="faq-title" className="editorial-heading faq-title"><span>QUESTIONS</span><span>WORTH</span><span className="heading-accent">ASKING.</span></h2><p>Start with the question. We will help shape what comes next.</p></Reveal></div><div className="faq-list">{questions.map(([question, answer], index) => <Reveal key={question} delay={index * .04}><div className={`faq-item ${open === index ? "is-open" : ""}`}><button className="faq-trigger" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}><span><b>0{index + 1}</b>{question}</span><ChevronDown size={18} /></button><div className="faq-answer" aria-hidden={open !== index}><p>{answer}</p></div></div></Reveal>)}</div></section>;
}
