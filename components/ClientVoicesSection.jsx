"use client";

import { useEffect, useRef, useState } from "react";
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
const reviewCards = [...communityReviews, ...featuredReviews];

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

export default function ClientVoicesSection() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState(1);
  const [rotationPaused, setRotationPaused] = useState(false);
  const rotationHover = useRef(false);
  const rotationFocus = useRef(false);
  const reviewTrack = useRef(null);
  const reviewDrag = useRef(null);
  const suppressReviewClick = useRef(false);
  const reviewClickTimer = useRef(0);
  const reviewHover = useRef(false);
  const reviewInteraction = useRef(false);
  const reviewResumeTimer = useRef(0);
  const current = featuredReviews[featuredIndex];
  const previous = featuredReviews[(featuredIndex + featuredReviews.length - 1) % featuredReviews.length];
  const next = featuredReviews[(featuredIndex + 1) % featuredReviews.length];

  useEffect(() => {
    if (rotationPaused) return undefined;
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % featuredReviews.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [rotationPaused]);

  useEffect(() => () => {
    if (reviewClickTimer.current) window.clearTimeout(reviewClickTimer.current);
    if (reviewResumeTimer.current) window.clearTimeout(reviewResumeTimer.current);
  }, []);

  const stepFeatured = (direction) => setFeaturedIndex((index) => (index + direction + featuredReviews.length) % featuredReviews.length);
  const syncRotationPause = () => setRotationPaused(rotationHover.current || rotationFocus.current);
  const pauseReviewMarquee = () => {
    reviewInteraction.current = true;
    if (reviewResumeTimer.current) window.clearTimeout(reviewResumeTimer.current);
  };
  const resumeReviewMarquee = () => {
    if (reviewResumeTimer.current) window.clearTimeout(reviewResumeTimer.current);
    reviewResumeTimer.current = window.setTimeout(() => {
      reviewInteraction.current = false;
      reviewResumeTimer.current = 0;
    }, 1200);
  };
  const selectReview = (index) => {
    const selectedIndex = index % reviewCards.length;
    setSelectedReview(selectedIndex);
    const featuredIndex = featuredReviews.findIndex((review) => review.name === reviewCards[selectedIndex].name);
    if (featuredIndex !== -1) setFeaturedIndex(featuredIndex);
    const card = reviewTrack.current?.querySelector(`[data-review-index="${selectedIndex}"]:not(.is-duplicate)`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    pauseReviewMarquee();
    resumeReviewMarquee();
  };
  const stepReviews = (direction) => {
    selectReview((selectedReview + direction + reviewCards.length) % reviewCards.length);
  };
  const handleReviewWheel = (event) => {
    const track = reviewTrack.current;
    if (!track || track.scrollWidth <= track.clientWidth) return;
    pauseReviewMarquee();
    resumeReviewMarquee();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    event.preventDefault();
    track.scrollLeft += delta;
  };
  useEffect(() => {
    const track = reviewTrack.current;
    if (!track) return undefined;
    track.addEventListener("wheel", handleReviewWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleReviewWheel);
  }, []);
  useEffect(() => {
    const track = reviewTrack.current;
    if (!track) return undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let loopWidth = 0;
    const measureLoop = () => {
      const firstCard = track.querySelector(".cv-small-card:not(.is-duplicate)");
      const duplicateCard = track.querySelector(".cv-small-card.is-duplicate");
      loopWidth = firstCard && duplicateCard ? duplicateCard.offsetLeft - firstCard.offsetLeft : 0;
    };
    const observer = "ResizeObserver" in window ? new ResizeObserver(measureLoop) : null;
    observer?.observe(track);
    measureLoop();
    const update = (time) => {
      frame = 0;
      if (motionPreference.matches) {
        track.classList.remove("is-auto-scrolling");
        track.classList.remove("is-paused");
        lastTime = 0;
        return;
      }
      if (reviewHover.current || reviewInteraction.current) {
        track.classList.remove("is-auto-scrolling");
        track.classList.add("is-paused");
        lastTime = time;
        frame = window.requestAnimationFrame(update);
        return;
      }
      track.classList.remove("is-paused");
      if (!track.classList.contains("is-auto-scrolling")) track.classList.add("is-auto-scrolling");
      if (lastTime) {
        if (loopWidth > 0) {
          track.scrollLeft += Math.min(time - lastTime, 48) * 0.032;
          if (track.scrollLeft >= loopWidth) track.scrollLeft %= loopWidth;
        }
      }
      lastTime = time;
      frame = window.requestAnimationFrame(update);
    };
    const handleMotionChange = () => {
      if (motionPreference.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        track.classList.remove("is-auto-scrolling", "is-paused");
        lastTime = 0;
      } else {
        lastTime = 0;
        if (!frame) frame = window.requestAnimationFrame(update);
      }
    };
    motionPreference.addEventListener("change", handleMotionChange);
    if (!motionPreference.matches) frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      motionPreference.removeEventListener("change", handleMotionChange);
      observer?.disconnect();
      track.classList.remove("is-auto-scrolling");
      track.classList.remove("is-paused");
    };
  }, []);
  const startReviewDrag = (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0) || !reviewTrack.current) return;
    pauseReviewMarquee();
    reviewDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: reviewTrack.current.scrollLeft,
      dragging: false,
    };
  };
  const moveReviewDrag = (event) => {
    const drag = reviewDrag.current;
    const track = reviewTrack.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    if (!drag.dragging && Math.abs(deltaX) < 6) return;
    if (!drag.dragging) {
      drag.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
    }
    event.preventDefault();
    track.scrollLeft = drag.startScroll - deltaX;
  };
  const finishReviewDrag = (event) => {
    const drag = reviewDrag.current;
    if (!drag || (event && drag.pointerId !== event.pointerId)) return;
    reviewDrag.current = null;
    reviewTrack.current?.classList.remove("is-dragging");
    resumeReviewMarquee();
    if (drag.dragging) {
      suppressReviewClick.current = true;
      if (reviewClickTimer.current) window.clearTimeout(reviewClickTimer.current);
      reviewClickTimer.current = window.setTimeout(() => {
        suppressReviewClick.current = false;
        reviewClickTimer.current = 0;
      }, 400);
    }
  };
  const handleReviewScroll = (event) => {
    const track = event.currentTarget;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closestIndex = selectedReview;
    let closestDistance = Infinity;
    track.querySelectorAll("[data-review-index]").forEach((card) => {
      const distance = Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = Number(card.dataset.reviewIndex) % reviewCards.length;
      }
    });
    setSelectedReview((index) => index === closestIndex ? index : closestIndex);
    if (reviewInteraction.current || reviewHover.current) {
      const featuredIndex = featuredReviews.findIndex((review) => review.name === reviewCards[closestIndex].name);
      if (featuredIndex !== -1) setFeaturedIndex(featuredIndex);
    }
  };
  const handleReviewKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    pauseReviewMarquee();
    resumeReviewMarquee();
    reviewTrack.current?.scrollBy({ left: event.key === "ArrowRight" ? 280 : -280, behavior: "smooth" });
  };
  const renderReviewCard = (review, index, duplicate = false) => (
    <article
      key={`${duplicate ? "duplicate-" : ""}${review.name}`}
      data-review-index={index}
      className={`cv-small-card${selectedReview === index ? " is-selected" : ""}${duplicate ? " is-duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      onClick={duplicate ? undefined : () => selectReview(index)}
    >
      <div className="cv-small-reviewer"><ReviewerAvatar initials={review.initials} small/><span><b>{review.name}</b><small>{review.role}<br/>{review.date}</small></span></div>
      <div className="cv-small-rating"><Stars compact/><span>5.0</span></div>
      <p>“{review.quote}”</p>
      <SourceMark type={review.sourceType} label={review.source}/>
    </article>
  );

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

        <div className="cv-featured-carousel" aria-label="Featured client reviews" onMouseEnter={() => { rotationHover.current = true; syncRotationPause(); }} onMouseLeave={() => { rotationHover.current = false; syncRotationPause(); }} onFocusCapture={() => { rotationFocus.current = true; syncRotationPause(); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { rotationFocus.current = false; syncRotationPause(); } }}>
          <button className="cv-carousel-arrow cv-arrow-left" type="button" onClick={() => stepFeatured(-1)} aria-label="Previous featured review"><ArrowLeft size={18}/></button>
          <article key={`left-${previous.name}`} className="cv-feature-card cv-feature-card--left" aria-hidden="true">
            <div className="cv-reviewer"><ReviewerAvatar initials={previous.initials} small/><span><b>{previous.name}</b><small>{previous.role}<i/> {previous.date}</small></span></div>
            <Stars compact/><span className="cv-score-small">5.0</span><span className="cv-quote-mark">“</span><p>{previous.quote}</p><SourceMark type={previous.sourceType} label={previous.source}/>
          </article>
          <article key={`active-${current.name}`} className="cv-feature-card cv-feature-card--active" aria-live="polite" aria-label={`Review by ${current.name}`}>
            <div className="cv-reviewer cv-reviewer--active"><ReviewerAvatar initials={current.initials}/><span><b>{current.name}</b><small>{current.role}<i/> {current.date}</small></span></div>
            <div className="cv-rating-line"><Stars/><span>5.0</span></div>
            <span className="cv-quote-mark">“</span>
            <p className="cv-feature-quote">{current.quote}</p>
            <SourceMark type={current.sourceType} label={current.source}/>
            <button className="cv-card-next" type="button" onClick={() => stepFeatured(1)} aria-label="Next featured review"><ArrowRight size={18}/></button>
          </article>
          <article key={`right-${next.name}`} className="cv-feature-card cv-feature-card--right" aria-hidden="true">
            <div className="cv-reviewer"><ReviewerAvatar initials={next.initials} small/><span><b>{next.name}</b><small>{next.role}<i/> {next.date}</small></span></div>
            <Stars compact/><span className="cv-score-small">5.0</span><span className="cv-quote-mark">“</span><p>{next.quote}</p><SourceMark type={next.sourceType} label={next.source}/>
          </article>
          <div className="cv-handnote" aria-hidden="true">Real stories.<br/>Real growth.<svg viewBox="0 0 54 55"><path d="M8 9c22-8 38 5 34 22-2 8-7 14-15 18m0 0 2-12m-2 12 12-3"/></svg></div>
          <div className="cv-feature-dots" role="group" aria-label="Select featured review">{featuredReviews.map((review, index) => <button key={review.name} type="button" aria-label={`Show ${review.name}'s review`} aria-current={index === featuredIndex ? "true" : undefined} onClick={() => setFeaturedIndex(index)} />)}</div>
          <button className="cv-carousel-arrow cv-arrow-right" type="button" onClick={() => stepFeatured(1)} aria-label="Next featured review"><ArrowRight size={18}/></button>
        </div>
      </div>

      <div className="cv-review-row-heading"><span>FROM LEARNERS &amp; PARTNERS</span><div className="cv-row-controls"><button type="button" aria-label="Previous client review" onClick={() => stepReviews(-1)}><ArrowLeft size={16}/></button><button type="button" aria-label="Next client review" onClick={() => stepReviews(1)}><ArrowRight size={16}/></button></div></div>
      <div className="cv-review-grid" id="client-review-cards" ref={reviewTrack} role="region" tabIndex={0} aria-label="More client reviews" onMouseEnter={() => { reviewHover.current = true; }} onMouseLeave={() => { reviewHover.current = false; }} onKeyDown={handleReviewKeyDown} onScroll={handleReviewScroll} onPointerDown={startReviewDrag} onPointerMove={moveReviewDrag} onPointerUp={finishReviewDrag} onPointerCancel={finishReviewDrag} onLostPointerCapture={finishReviewDrag} onPointerLeave={() => { if (!reviewDrag.current?.dragging) reviewDrag.current = null; }} onClickCapture={(event) => { if (suppressReviewClick.current) { event.preventDefault(); event.stopPropagation(); suppressReviewClick.current = false; if (reviewClickTimer.current) window.clearTimeout(reviewClickTimer.current); reviewClickTimer.current = 0; } }}>
        {reviewCards.map((review, index) => renderReviewCard(review, index))}
        {reviewCards.map((review, index) => renderReviewCard(review, index, true))}
      </div>
      <div className="cv-review-pagination" aria-label="Review cards">{reviewCards.map((review, index) => <button key={review.name} type="button" aria-label={`Select review ${index + 1}`} aria-current={index === selectedReview ? "true" : undefined} onClick={() => selectReview(index)} />)}</div>
      <span className="cv-corner-orb cv-corner-orb--left" aria-hidden="true"/><span className="cv-corner-orb cv-corner-orb--right" aria-hidden="true"/>
    </div>
  </section>;
}
