import React, { useEffect, useState } from "react";

export default function CtaModal({ mode = "inquiry", onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const isBooking = mode === "booking";

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="cta-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="cta-modal" role="dialog" aria-modal="true" aria-labelledby="cta-modal-title">
        <button type="button" className="cta-modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        {submitted ? (
          <div className="cta-success">
            <span className="section-kicker">BUILSTRY</span>
            <h2>Thank you.</h2>
            <p>We’ll be in touch shortly.</p>
            {isBooking && <small>This is a call request, not a calendar confirmation.</small>}
            <button type="button" className="button button-primary" onClick={onClose}>Close <span>→</span></button>
          </div>
        ) : (
          <>
            <span className="section-kicker">{isBooking ? "REQUEST A CALL" : "START A CONVERSATION"}</span>
            <h2 id="cta-modal-title">{isBooking ? <>LET'S <em>TALK.</em></> : <>WHAT SHOULD <em>EXIST?</em></>}</h2>
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
    </div>
  );
}
