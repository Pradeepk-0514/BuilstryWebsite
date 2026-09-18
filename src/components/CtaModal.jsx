import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CtaModal.css";

const CLOSE_ANIMATION_MS = 280;

export default function CtaModal({ mode = "inquiry", onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);
  const isBooking = mode === "booking";

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      Object.entries(previous).forEach(([property, value]) => {
        body.style[property] = value;
      });
      window.scrollTo(0, scrollY);
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
  }, []);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) requestClose();
  };

  return createPortal(
    <div
      className={`cta-modal-backdrop${isClosing ? " is-closing" : ""}`}
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="cta-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-modal-title"
        aria-describedby="cta-modal-description"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="cta-modal-close"
          onClick={requestClose}
          aria-label="Close dialog"
        >
          <span aria-hidden="true">×</span>
        </button>
        {submitted ? (
          <div className="cta-success">
            <span className="section-kicker">BUILSTRY</span>
            <h2>Thank you.</h2>
            <p id="cta-modal-description">We’ll be in touch shortly.</p>
            {isBooking && <small>This is a call request, not a calendar confirmation.</small>}
            <button type="button" className="button button-primary" onClick={requestClose}>Close <span>→</span></button>
          </div>
        ) : (
          <>
            <span className="section-kicker">{isBooking ? "REQUEST A CALL" : "START A CONVERSATION"}</span>
            <h2 id="cta-modal-title">{isBooking ? <>LET'S <em>TALK.</em></> : <>WHAT SHOULD <em>EXIST?</em></>}</h2>
            <p id="cta-modal-description" className="cta-modal-description">{isBooking ? "Tell us what you want to move forward." : "Share the problem, idea or opportunity you want to explore."}</p>
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label>Name *<input name="name" required autoComplete="name" /></label>
              <label>Work email *<input name="email" type="email" required autoComplete="email" /></label>
              <label>Company / Organization<input name="company" autoComplete="organization" /></label>
              {isBooking ? <>
                <label>What would you like to discuss? *<textarea name="discussion" required rows="3" /></label>
                <div className="cta-form-row"><label>Preferred date *<input name="date" type="date" required /></label><label>Preferred time *<input name="time" type="time" required /></label></div>
                <label>Time zone<input name="timezone" placeholder="e.g. IST (UTC+5:30)" /></label>
                <label>Additional notes (optional)<textarea name="notes" rows="3" /></label>
              </> : <>
                <label>What are you trying to build? *<input name="build" required /></label>
                <label>Tell us briefly about the problem or idea *<textarea name="problem" required rows="4" /></label>
                <label>Budget / investment range (optional)<input name="budget" /></label>
                <label>Timeline (optional)<input name="timeline" /></label>
              </>}
              <button type="submit" className="button button-primary">{isBooking ? "Request a Call" : "Start a Conversation"} <span>→</span></button>
            </form>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
