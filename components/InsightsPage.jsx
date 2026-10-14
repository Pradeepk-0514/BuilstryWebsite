"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "./RouterLink";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Search, Sparkles } from "lucide-react";
import "./InsightsEditorial.css";

const topics = [
  { title: "AI & Automation", short: "AI / AUTOMATION", description: "How intelligent systems are changing the way teams work, decide, and grow.", spotlight: "Beyond automation: building businesses that think ahead.", count: "12 signals" },
  { title: "Business & Product Strategy", short: "STRATEGY", description: "Sharper choices for products, businesses, and the people they serve.", spotlight: "Build for the problem, not the trend.", count: "08 signals" },
  { title: "Data & Intelligence", short: "DATA / INTELLIGENCE", description: "Turning disconnected information into confident, useful decisions.", spotlight: "From raw data to decisions that move.", count: "06 signals" },
  { title: "Digital Products", short: "DIGITAL PRODUCTS", description: "The craft of making digital experiences useful, trusted, and hard to leave.", spotlight: "The small details behind products people love.", count: "09 signals" },
  { title: "Innovation & Future Thinking", short: "WHAT'S NEXT", description: "Signals, shifts, and questions that could shape the next generation of work.", spotlight: "The next useful idea may look a little strange.", count: "05 signals" },
];

const articles = [
  { tag: "AI & AUTOMATION", topic: 0, date: "OCT 10, 2026", time: "6 MIN READ", title: "The real impact of AI agents in business", summary: "A practical look at where autonomous systems create value — and where a human decision still matters most.", slug: "ai-agents-in-business", art: "agent" },
  { tag: "PRODUCT STRATEGY", topic: 1, date: "OCT 04, 2026", time: "8 MIN READ", title: "Building products people actually use", summary: "Why the best product roadmaps start with observed behaviour, not a crowded feature list.", slug: "products-people-use", art: "product" },
  { tag: "DATA & INTELLIGENCE", topic: 2, date: "SEP 28, 2026", time: "5 MIN READ", title: "Turning data into better decisions", summary: "A clear operating model for moving from dashboards to shared understanding and action.", slug: "data-to-decisions", art: "data" },
  { tag: "AI & AUTOMATION", topic: 0, date: "SEP 19, 2026", time: "7 MIN READ", title: "What should businesses automate first?", summary: "A useful framework for finding the repetitive friction worth solving before buying another tool.", slug: "what-to-automate-first", art: "automation" },
  { tag: "DIGITAL PRODUCTS", topic: 3, date: "SEP 12, 2026", time: "9 MIN READ", title: "Designing trust into digital products", summary: "The interface choices that make a new service feel understandable, safe, and worth returning to.", slug: "designing-digital-trust", art: "trust" },
  { tag: "FUTURE THINKING", topic: 4, date: "AUG 30, 2026", time: "4 MIN READ", title: "A question before the next big thing", summary: "A field note on resisting novelty for its own sake and finding the human need underneath.", slug: "question-before-the-next-thing", art: "future" },
];

const questions = [
  "What should businesses automate first?",
  "How do you know an idea is worth building?",
  "What makes people trust a new product?",
  "Where can better data change a decision?",
];

function HeroWave() {
  const paths = [
    "M-15 244 C112 115 140 335 271 181 S455 204 604 77 S797 183 1042 -7",
    "M-22 263 C105 135 154 350 280 201 S465 221 616 92 S812 199 1060 10",
    "M-28 282 C97 154 167 364 289 221 S476 238 628 107 S826 214 1078 27",
    "M-32 302 C88 173 178 379 299 241 S488 255 641 123 S841 231 1094 44",
    "M-36 321 C80 194 190 394 309 260 S500 272 653 140 S856 246 1112 60",
    "M-40 340 C72 215 201 410 319 280 S512 290 666 156 S871 263 1128 77",
    "M-43 359 C65 235 212 426 329 301 S524 307 679 173 S886 279 1145 94",
    "M-45 378 C59 256 223 442 340 322 S536 325 692 190 S901 294 1162 111",
    "M-47 397 C53 277 235 458 350 343 S548 342 705 207 S916 310 1179 128",
    "M-49 416 C47 297 247 475 360 364 S560 360 718 224 S931 326 1196 145",
  ];
  return <div className="ie-hero-art" aria-hidden="true"><div className="ie-art-glow"/><div className="ie-art-halo ie-art-halo-one"/><div className="ie-art-halo ie-art-halo-two"/><svg viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid slice">{paths.map((path, index) => <path key={path} d={path} className={index % 3 === 0 ? "is-hot" : ""}/>)}<circle cx="630" cy="221" r="4"/><circle cx="474" cy="238" r="3"/><circle cx="800" cy="180" r="4"/><circle cx="352" cy="263" r="3"/></svg><span className="ie-floating-index">SIGNAL 01<span> / </span>05</span><i className="ie-orb ie-orb-a"/><i className="ie-orb ie-orb-b"/><i className="ie-orb ie-orb-c"/></div>;
}

function StoryArtwork({ variant, large = false }) {
  return <div className={`ie-story-art ie-art-${variant}${large ? " is-large" : ""}`} aria-hidden="true"><span className="ie-art-sun"/><span className="ie-art-grid"/><span className="ie-art-portal"><i/><i/></span><span className="ie-art-ridge ie-art-ridge-one"/><span className="ie-art-ridge ie-art-ridge-two"/><span className="ie-art-floor"/><span className="ie-art-figure"/><span className="ie-art-orbit"/></div>;
}

export default function InsightsPage() {
  const [activeTopic, setActiveTopic] = useState(0);
  const [activeFilter, setActiveFilter] = useState("ALL INSIGHTS");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll(".ie-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const filters = ["ALL INSIGHTS", ...new Set(articles.map((article) => article.tag))];
  const filteredArticles = useMemo(() => articles.filter((article) => {
    const matchesFilter = activeFilter === "ALL INSIGHTS" || article.tag === activeFilter;
    const needle = query.trim().toLowerCase();
    const matchesSearch = !needle || `${article.title} ${article.summary} ${article.tag}`.toLowerCase().includes(needle);
    return matchesFilter && matchesSearch;
  }), [activeFilter, query]);
  const visibleArticles = showAll || query || activeFilter !== "ALL INSIGHTS" ? filteredArticles : filteredArticles.slice(0, 3);

  const submitNewsletter = (event) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return <div className="insights-page insights-editorial">
    <section className="ie-hero" aria-labelledby="ie-hero-title">
      <div className="ie-hero-inner">
        <div className="ie-hero-copy">
          <span className="ie-eyebrow"><i/> BUILSTRY / INSIGHTS</span>
          <h1 id="ie-hero-title">Ideas for<br/>what comes <em>next.</em></h1>
          <p>Perspectives, research and questions for people building what should exist.</p>
          <a className="ie-hero-cta" href="#ie-latest">Explore the insights <ArrowDown size={16}/></a>
          <span className="ie-hero-side-label">FIELD NOTES <b>·</b> RESEARCH <b>·</b> PERSPECTIVES</span>
        </div>
        <HeroWave/>
        <div className="ie-hero-bottom"><span>THINK CLEARLY. BUILD WITH INTENT.</span><span>SCROLL TO EXPLORE <i/></span></div>
      </div>
    </section>

    <section className="ie-featured-section ie-reveal" aria-labelledby="ie-featured-title">
      <div className="ie-section-topline"><span>01 / FEATURED INSIGHT</span><span>BUILSTRY RESEARCH <i/></span></div>
      <article className="ie-featured-card">
        <StoryArtwork variant="automation" large/>
        <div className="ie-featured-copy"><span className="ie-category-label">AI &amp; AUTOMATION <i/> 6 MIN READ</span><h2 id="ie-featured-title">Beyond automation: building businesses that <em>think ahead.</em></h2><p>Automation made work faster. Intelligence is making it more thoughtful. Here’s how to build a company that learns as it moves.</p><div className="ie-feature-meta"><span><CalendarDays size={14}/> OCT 10, 2026</span><span><Clock3 size={14}/> 6 MIN READ</span></div><Link className="ie-button" href="/blog/beyond-automation">Read the insight <ArrowUpRight size={16}/></Link><span className="ie-feature-index">FEATURE / 001</span></div>
      </article>
    </section>

    <section className="ie-topics-section ie-reveal" aria-labelledby="ie-topics-title">
      <div className="ie-section-topline"><span>02 / EXPLORE BY TOPIC</span><span>FOLLOW THE QUESTIONS <i/></span></div>
      <div className="ie-topics-layout"><div className="ie-topics-intro"><span className="ie-eyebrow"><i/> THE SIGNALS</span><h2 id="ie-topics-title">A few ways<br/>to <em>look closer.</em></h2><p>Choose a thread. See what’s changing, what matters, and what might be worth building next.</p><span className="ie-topics-counter">0{activeTopic + 1}<b> / </b>05</span></div>
        <div className="ie-topic-panel"><div className="ie-topic-tabs" role="tablist" aria-label="Insight topics">{topics.map((topic, index) => <button key={topic.title} type="button" role="tab" id={`ie-topic-tab-${index}`} aria-selected={activeTopic === index} aria-controls="ie-topic-content" onClick={() => setActiveTopic(index)}><span>0{index + 1}</span>{topic.title}<ArrowRight size={15}/></button>)}</div><article className="ie-topic-content" id="ie-topic-content" role="tabpanel" aria-labelledby={`ie-topic-tab-${activeTopic}`}><span className="ie-topic-count">{topics[activeTopic].count}</span><span className="ie-category-label">{topics[activeTopic].short}</span><h3>{topics[activeTopic].spotlight}</h3><p>{topics[activeTopic].description}</p><Link href={`/blog?topic=${encodeURIComponent(topics[activeTopic].title.toLowerCase().replaceAll(" ", "-"))}`} className="ie-text-link">Explore the topic <ArrowRight size={15}/></Link><div className={`ie-topic-graphic ie-topic-graphic-${activeTopic}`} aria-hidden="true"><i/><i/><i/><i/><b/></div></article></div>
      </div>
    </section>

    <section className="ie-archive-section" id="ie-latest" aria-labelledby="ie-archive-title">
      <div className="ie-archive-wrap">
        <div className="ie-archive-header"><div><span className="ie-eyebrow"><i/> THE ARCHIVE</span><h2 id="ie-archive-title">Latest <em>thinking.</em></h2><p>Notes and ideas to take into your next conversation.</p></div><label className="ie-search"><Search size={17}/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search insights" aria-label="Search insights"/><kbd>↵</kbd></label></div>
        <div className="ie-filter-bar" role="group" aria-label="Filter insights by category">{filters.map((filter) => <button key={filter} type="button" className={activeFilter === filter ? "is-active" : ""} aria-pressed={activeFilter === filter} onClick={() => { setActiveFilter(filter); setShowAll(true); }}>{filter}</button>)}</div>
        {visibleArticles.length ? <div className="ie-article-grid">{visibleArticles.map((article, index) => <article className="ie-article-card" key={article.slug} style={{ "--ie-card-index": index }}><Link href={`/blog/${article.slug}`} className="ie-article-image-link" aria-label={`Read ${article.title}`}><StoryArtwork variant={article.art}/><span className="ie-image-arrow"><ArrowUpRight size={17}/></span></Link><div className="ie-article-copy"><span className="ie-category-label">{article.tag}</span><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3><p>{article.summary}</p><div className="ie-article-foot"><span>{article.date}</span><span>{article.time}</span></div></div></article>)}</div> : <div className="ie-empty-state"><Search size={22}/><p>No insights match that search. Try another phrase or clear the filter.</p><button type="button" onClick={() => { setQuery(""); setActiveFilter("ALL INSIGHTS"); }}>Clear search</button></div>}
        {!showAll && !query && activeFilter === "ALL INSIGHTS" && filteredArticles.length > 3 && <button type="button" className="ie-load-more" onClick={() => setShowAll(true)}>Load more insights <ArrowRight size={16}/></button>}
        {showAll && activeFilter === "ALL INSIGHTS" && !query && <button type="button" className="ie-load-more" onClick={() => setShowAll(false)}>Show fewer <ArrowDown size={15}/></button>}
      </div>
    </section>

    <section className="ie-question-section ie-reveal" aria-labelledby="ie-question-title"><div className="ie-question-wrap"><div className="ie-question-intro"><span className="ie-eyebrow"><i/> A QUESTION WORTH ASKING</span><h2 id="ie-question-title">What are we<br/>not asking <em>yet?</em></h2><p>Good work starts with a better question. Pick one to see where the thinking takes us.</p><span className="ie-question-note"><Sparkles size={15}/> Curiosity is a useful tool.</span></div><div className="ie-question-card"><span className="ie-question-label">QUESTION / 0{activeQuestion + 1}</span><blockquote>{questions[activeQuestion]}</blockquote><div className="ie-question-options" role="tablist" aria-label="Questions to explore">{questions.map((question, index) => <button type="button" role="tab" key={question} aria-selected={activeQuestion === index} onClick={() => setActiveQuestion(index)}><span>0{index + 1}</span><i>{activeQuestion === index ? <Check size={14}/> : <ArrowRight size={14}/>}</i></button>)}</div><Link className="ie-question-link" href={`/blog?question=${activeQuestion + 1}`}>Explore the question <ArrowRight size={15}/></Link><span className="ie-question-mark" aria-hidden="true">?</span></div></div></section>

    <section className="ie-newsletter-section ie-reveal" aria-labelledby="ie-newsletter-title"><div className="ie-newsletter-icon" aria-hidden="true"><span>✳</span></div><div className="ie-newsletter-copy"><span className="ie-eyebrow"><i/> NOTES FROM THE STUDIO</span><h2 id="ie-newsletter-title">Stay curious.<br/><em>Think ahead.</em></h2><p>One thoughtful note on ideas, products and what’s next. No noise.</p></div><div className="ie-newsletter-action">{subscribed ? <div className="ie-subscribed"><span><Check size={17}/></span><div><b>You’re on the list.</b><small>Watch your inbox for a little more signal.</small></div></div> : <form onSubmit={submitNewsletter}><label htmlFor="ie-newsletter-email">YOUR EMAIL ADDRESS</label><div className="ie-email-row"><input id="ie-newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required/><button type="submit" aria-label="Subscribe to insights"><ArrowRight size={18}/></button></div><small>By subscribing, you agree to receive occasional Builstry notes.</small></form>}</div><div className="ie-newsletter-index">B / NOTES</div></section>

    <section className="ie-cta-section"><div className="ie-cta-art" aria-hidden="true"><div/><span/><i/></div><div className="ie-cta-content"><span className="ie-eyebrow"><i/> YOUR NEXT CHAPTER</span><h2>Have a question<br/>worth <em>building around?</em></h2><p>Bring us the messy beginning. We’ll help find the useful next step.</p><Link className="ie-button ie-button-light" href="/contact">Start a conversation <ArrowUpRight size={16}/></Link></div><span className="ie-cta-coordinate">12°58' N / 77°35' E</span></section>
  </div>;
}
