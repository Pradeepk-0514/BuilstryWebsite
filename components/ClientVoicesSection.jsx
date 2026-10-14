"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "./RouterLink";
import { ArrowLeft, ArrowRight, Star, UsersRound } from "lucide-react";

const featuredReviews = [
  {
    name: "Pradeep Kumar M", role: "UI/UX Designer", date: "Mar 2026", initials: "PK",
    quote: "GenLab provided a great learning environment. I had learnt GST taxation and more. The mentorship and guidance helped me build confidence and improve my skills. Highly recommended for anyone who wants to grow in their career.",
    source: "GenLab Intern", sourceType: "google", score: "5.0",
  },
  {
    name: "Sneha V", role: "Web Developer", date: "Apr 2026", initials: "SV",
    quote: "The internship gave me practical exposure to digital marketing and strategies. It is the best experience with GenLab.",
    source: "GenLab Intern", sourceType: "google", score: "5.0",
  },
  {
    name: "Rasmi", role: "Digital Marketer", date: "Jan 2026", initials: "RA",
    quote: "The sessions in GenLab are too useful for the placement preparation. My confidence has grown a lot through this internship. It helped me understand the real industry environment.",
    source: "GenLab Intern", sourceType: "google", score: "5.0",
  },
];

const communityReviews = [
  { name: "John Marshall", role: "Frontend Developer", date: "Mar 2026", initials: "JM", quote: "This internship was amazing and their teaching skills is also extraordinary. I learned a lot and gained confidence.", source: "Microsoft", sourceType: "microsoft" },
  { name: "Nandhini P", role: "Data Analyst", date: "Feb 2026", initials: "NP", quote: "Great learning experience. The mentors were always available and the support from the team was excellent.", source: "Meta", sourceType: "meta" },
  { name: "Karthikeyan M", role: "Full Stack Developer", date: "Feb 2026", initials: "KM", quote: "Very helpful and supportive team. The internship helped me understand the real industry and build practical skills.", source: "GenLab Intern", sourceType: "google" },
  { name: "Priya S", role: "UI/UX Designer", date: "Jan 2026", initials: "PS", quote: "The team is very supportive and always available. My confidence has grown a lot through this internship.", source: "GenLab Intern", sourceType: "google" },
  { name: "Saran K", role: "Digital Marketer", date: "Dec 2025", initials: "SK", quote: "A wonderful experience with GenLab. Learned a lot and got hands-on exposure to real projects.", source: "Microsoft", sourceType: "microsoft" },
];

function Stars({ compact = false }) {
  return <span className={`cv-stars${compact ? " is-compact" : ""}`} aria-label="Rated 5 out of 5">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={compact ? 12 : 15} fill="currentColor" strokeWidth={0} />)}</span>;
}

function SourceMark({ type, label }) {
  return <span className={`cv-source cv-source--${type}`} aria-label={label}>
    {type === "google" ? <b className="cv-google-g">G</b> : type === "meta" ? <b className="cv-meta-mark">∞</b> : <b className="cv-ms-mark"><i/><i/><i/><i/></b>}
    <span>{label}</span>
  </span>;
}

function ReviewerAvatar({ initials, small = false }) {
  return <span className={`cv-avatar${small ? " is-small" : ""}`} aria-hidden="true"><span>{initials}</span></span>;
}

function CommunityReviewCard({ review, index, selected = false, onSelect }) {
  return <article data-review-index={index} className={`cv-small-card${selected ? " is-selected" : ""}`} onClick={onSelect}>
    <div className="cv-small-reviewer"><ReviewerAvatar initials={review.initials} small/><span><b>{review.name}</b><small>{review.role}<br/>{review.date}</small></span></div>
    <div className="cv-small-rating"><Stars compact/><span>5.0</span></div>
    <p>“{review.quote}”</p>
    <SourceMark type={review.sourceType} label={review.source}/>
  </article>;
}

export default function ClientVoicesSection() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPhase, setFeaturedPhase] = useState("idle");
  const [selectedReview, setSelectedReview] = useState(1);
  const [reviewHoverPaused, setReviewHoverPaused] = useState(false);
  const reviewTrack = useRef(null);
  const reviewMotionTrack = useRef(null);
  const featuredTimers = useRef([]);
  const current = featuredReviews[featuredIndex];
  const previous = featuredReviews[(featuredIndex + featuredReviews.length - 1) % featuredReviews.length];
  const next = featuredReviews[(featuredIndex + 1) % featuredReviews.length];

  const transitionFeatured = useCallback((nextIndex) => {
    featuredTimers.current.forEach((timer) => window.clearTimeout(timer));
    setFeaturedPhase("exiting");
    featuredTimers.current = [window.setTimeout(() => {
      setFeaturedIndex((index) => typeof nextIndex === "function" ? nextIndex(index) : nextIndex);
      setFeaturedPhase("entering");
      featuredTimers.current = [window.setTimeout(() => setFeaturedPhase("idle"), 390)];
    }, 160)];
  }, []);

  const stepFeatured = useCallback((direction) => {
    transitionFeatured((index) => (index + direction + featuredReviews.length) % featuredReviews.length);
  }, [transitionFeatured]);

  const selectCommunityReview = (index) => {
    setSelectedReview(index);
    const card = reviewTrack.current?.querySelector(`.cv-review-loop:not([aria-hidden="true"]) [data-review-index="${index}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const stepReviews = (direction) => {
    const target = Math.max(0, Math.min(communityReviews.length - 1, selectedReview + direction));
    selectCommunityReview(target);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => stepFeatured(1), 2000);
    return () => window.clearInterval(timer);
  }, [stepFeatured]);

  useEffect(() => () => featuredTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    const track = reviewMotionTrack.current;
    const loop = track?.querySelector('.cv-review-loop:not([aria-hidden="true"])');
    if (!track || !loop) return undefined;
    const measureLoop = () => {
      const width = loop.getBoundingClientRect().width;
      if (width > 0) {
        track.style.setProperty("--cv-loop-distance", `-${width}px`);
        track.style.setProperty("--cv-loop-duration", `${width / 26}s`);
      }
    };
    measureLoop();
    const observer = new ResizeObserver(measureLoop);
    observer.observe(loop);
    return () => observer.disconnect();
  }, []);

  const pauseOnMouseHover = (event) => {
    if (event.pointerType === "mouse") setReviewHoverPaused(true);
  };
  const resumeAfterMouseHover = (event) => {
    if (event.pointerType === "mouse") setReviewHoverPaused(false);
  };
  const phaseClass = featuredPhase === "idle" ? "" : ` is-${featuredPhase}`;

  return <section className="client-voices-section" aria-labelledby="client-voices-title">
    <div className="cv-shell">
      <div className="cv-feature-row">
        <header className="cv-intro">
          <span className="cv-kicker">REVIEWS &amp; TESTIMONIALS<i /></span>
          <h2 id="client-voices-title">WHAT OUR<br /><em>CLIENTS</em><br />SAY</h2>
          <p>Real people. Real experiences. Here’s what our clients and partners have to say about their journey with us.</p>
          <div className="cv-trust-stats">
            <div className="cv-stat"><span className="cv-stat-icon"><Star fill="currentColor" size={20}/></span><span><b>4.8/5</b><small>Average rating</small></span></div>
            <i className="cv-stat-divider" />
            <div className="cv-stat"><span className="cv-stat-icon"><UsersRound size={21}/></span><span><b>120+</b><small>Happy clients</small></span></div>
          </div>
          <Link className="cv-read-link" href="#client-review-cards">Read more reviews <ArrowRight size={16}/></Link>
        </header>

        <div className="cv-featured-carousel" aria-label="Featured client reviews">
          <button className="cv-carousel-arrow cv-arrow-left" type="button" onClick={() => stepFeatured(-1)} aria-label="Previous featured review"><ArrowLeft size={18}/></button>
          <article className="cv-feature-card cv-feature-card--left" aria-hidden="true">
            <div className="cv-reviewer"><ReviewerAvatar initials={previous.initials} small/><span><b>{previous.name}</b><small>{previous.role}<i/> {previous.date}</small></span></div>
            <Stars compact/><span className="cv-score-small">5.0</span><span className="cv-quote-mark">“</span><p>{previous.quote}</p><SourceMark type={previous.sourceType} label={previous.source}/>
          </article>
          <article className={`cv-feature-card cv-feature-card--active${phaseClass}`} aria-live="polite" aria-label={`Review by ${current.name}`}>
            <div className="cv-reviewer cv-reviewer--active"><ReviewerAvatar initials={current.initials}/><span><b>{current.name}</b><small>{current.role}<i/> {current.date}</small></span></div>
            <div className="cv-rating-line"><Stars/><span>5.0</span></div>
            <span className="cv-quote-mark">“</span>
            <p className="cv-feature-quote">{current.quote}</p>
            <SourceMark type={current.sourceType} label={current.source}/>
            <button className="cv-card-next" type="button" onClick={() => stepFeatured(1)} aria-label="Next featured review"><ArrowRight size={18}/></button>
          </article>
          <article className="cv-feature-card cv-feature-card--right" aria-hidden="true">
            <div className="cv-reviewer"><ReviewerAvatar initials={next.initials} small/><span><b>{next.name}</b><small>{next.role}<i/> {next.date}</small></span></div>
            <Stars compact/><span className="cv-score-small">5.0</span><span className="cv-quote-mark">“</span><p>{next.quote}</p><SourceMark type={next.sourceType} label={next.source}/>
          </article>
          <div className="cv-handnote" aria-hidden="true">Real stories.<br/>Real growth.<svg viewBox="0 0 54 55"><path d="M8 9c22-8 38 5 34 22-2 8-7 14-15 18m0 0 2-12m-2 12 12-3"/></svg></div>
          <div className="cv-feature-dots" role="group" aria-label="Select featured review">{featuredReviews.map((review, index) => <button key={review.name} type="button" aria-label={`Show ${review.name}'s review`} aria-current={index === featuredIndex ? "true" : undefined} onClick={() => transitionFeatured(index)} />)}</div>
          <button className="cv-carousel-arrow cv-arrow-right" type="button" onClick={() => stepFeatured(1)} aria-label="Next featured review"><ArrowRight size={18}/></button>
        </div>
      </div>

      <div className="cv-review-row-heading"><span>FROM LEARNERS &amp; PARTNERS</span><div className="cv-row-controls"><button type="button" aria-label="Previous client review" onClick={() => stepReviews(-1)}><ArrowLeft size={16}/></button><button type="button" aria-label="Next client review" onClick={() => stepReviews(1)}><ArrowRight size={16}/></button></div></div>
      <div className={`cv-review-grid${reviewHoverPaused ? " is-hover-paused" : ""}`} id="client-review-cards" ref={reviewTrack} aria-label="More client reviews, continuously scrolling" onPointerEnter={pauseOnMouseHover} onPointerLeave={resumeAfterMouseHover}>
        <div className="cv-review-track" ref={reviewMotionTrack}>
          <div className="cv-review-loop">
            {communityReviews.map((review, index) => <CommunityReviewCard key={review.name} review={review} index={index} selected={selectedReview === index} onSelect={() => selectCommunityReview(index)} />)}
          </div>
          <div className="cv-review-loop" aria-hidden="true">
            {communityReviews.map((review, index) => <CommunityReviewCard key={`copy-${review.name}`} review={review} index={index} />)}
          </div>
        </div>
      </div>
      <div className="cv-review-pagination" aria-label="Review cards">{communityReviews.map((review, index) => <button key={review.name} type="button" aria-label={`Select review ${index + 1}`} aria-current={index === selectedReview ? "true" : undefined} onClick={() => selectCommunityReview(index)} />)}</div>
      <span className="cv-corner-orb cv-corner-orb--left" aria-hidden="true"/><span className="cv-corner-orb cv-corner-orb--right" aria-hidden="true"/>
    </div>
  </section>;
}
