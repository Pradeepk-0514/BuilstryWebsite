import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import "./CtaModal.css";

const CLOSE_ANIMATION_MS = 260;
const STEP_EXIT_MS = 140;
const STEP_ENTER_MS = 340;
const INQUIRY_INTERESTS = [
  "AI & Automation",
  "Business Systems",
  "Digital Product",
  "Data & Intelligence",
  "Website / Digital Experience",
  "Something else",
];
const BOOKING_TOPICS = [
  "AI & Automation",
  "Business Technology",
  "Digital Product",
  "Data & Intelligence",
  "Strategy",
  "Other",
];
const HOME_PROBLEM_PILLARS = [
  {
    id: "industry",
    number: "01",
    name: "Industry Solutions",
    description: "Problems related to industry-specific solutions, operations, workflows, and business challenges.",
    questions: [
      { heading: "WHAT INDUSTRY OR BUSINESS AREA ARE YOU WORKING IN?", label: "What industry or business area are you working in?", placeholder: "e.g., healthcare, manufacturing, or a team workflow", short: true },
      { heading: "WHAT PROBLEM ARE YOU FACING?", label: "What problem are you facing?", placeholder: "Describe the friction, constraint, or opportunity you have in mind." },
      { heading: "WHAT ARE YOU TRYING TO IMPROVE?", label: "Tell us a little more about what you’re trying to improve.", placeholder: "A rough outline of the outcome you want is enough." },
    ],
  },
  {
    id: "strategy",
    number: "02",
    name: "Business & Product Strategy",
    description: "Problems related to business direction, product ideas, strategy, validation, or growth.",
    questions: [
      { heading: "WHAT ARE YOU TRYING TO BUILD, IMPROVE, OR VALIDATE?", label: "What are you trying to build, improve, or validate?", placeholder: "Share the idea, product, or direction you’re exploring." },
      { heading: "WHERE ARE YOU CURRENTLY STUCK?", label: "Where are you currently stuck?", placeholder: "Tell us what feels uncertain or difficult to move forward." },
      { heading: "WHAT OPPORTUNITY ARE YOU EXPLORING?", label: "Tell us more about the opportunity you’re exploring.", placeholder: "Add any context that would help us understand the opportunity." },
    ],
  },
  {
    id: "innovation",
    number: "03",
    name: "Innovation & Community",
    description: "Ideas related to innovation, emerging opportunities, research, collaboration, or community.",
    questions: [
      { heading: "WHAT IDEA OR OPPORTUNITY ARE YOU EXPLORING?", label: "What idea or opportunity are you exploring?", placeholder: "Start with the idea, question, or signal that caught your attention." },
      { heading: "WHAT WOULD YOU LIKE TO MAKE POSSIBLE?", label: "What would you like to make possible?", placeholder: "Describe the change, experience, or outcome you imagine." },
      { heading: "TELL US MORE ABOUT THE IDEA.", label: "Tell us more about the idea.", placeholder: "Share any useful context, collaborators, or early thinking." },
    ],
  },
  {
    id: "other",
    number: "04",
    name: "Other",
    description: "For problems that don’t fit into the above three areas.",
    questions: [
      { heading: "WHAT PROBLEM ARE YOU TRYING TO SOLVE?", label: "What problem are you trying to solve?", placeholder: "Start wherever feels easiest; you don’t need to categorize it further." },
      { heading: "TELL US MORE ABOUT IT.", label: "Tell us more about it.", placeholder: "Anything that helps us understand the situation or what you hope to change." },
    ],
  },
];
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];
const TIME_ZONES = [
  ["Asia/Kolkata", "Asia/Kolkata · IST (UTC+5:30)"],
  ["UTC", "UTC (UTC+00:00)"],
  ["Asia/Dubai", "Asia/Dubai · GST (UTC+04:00)"],
  ["Europe/London", "Europe/London · UK time"],
  ["America/New_York", "America/New_York · Eastern time"],
  ["America/Los_Angeles", "America/Los_Angeles · Pacific time"],
];

function getToday() {
  const today = new Date();
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function displayDate(value) {
  if (!value) return "—";
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialForm() {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    interests: [],
    topic: "",
    message: "",
    date: "",
    time: "",
    timezone: "Asia/Kolkata",
  };
}

function getPrivacyCue(step) {
  if (step === 0) return "PRIVATE BY DEFAULT";
  if (step <= 2) return "CONFIDENTIAL CONVERSATION";
  return "YOUR DETAILS STAY IN THIS SESSION";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function SummaryRow({ label, children }) {
  return (
    <div className="cta-summary-row">
      <dt>{label}</dt>
      <dd>{children || "—"}</dd>
    </div>
  );
}

export default function CtaModal({ mode = "inquiry", onClose }) {
  const isBooking = mode === "booking";
  const isHomeProblem = mode === "home-problem";
  const [step, setStep] = useState(0);
  const [selectedPillarId, setSelectedPillarId] = useState("");
  const [homeAnswersByPillar, setHomeAnswersByPillar] = useState({});
  const [form, setForm] = useState(() => initialForm());
  const selectedPillar = HOME_PROBLEM_PILLARS.find((pillar) => pillar.id === selectedPillarId) || null;
  const homeAnswers = homeAnswersByPillar[selectedPillarId] || ["", "", ""];
  const homeQuestionCount = selectedPillar?.questions.length || 3;
  const lastStep = isBooking ? 4 : isHomeProblem ? homeQuestionCount + 4 : 5;
  const stepCount = lastStep + 1;
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [stepPhase, setStepPhase] = useState("idle");
  const [stepError, setStepError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const previouslyFocused = useRef(null);
  const closeTimer = useRef(null);
  const transitionTimer = useRef(null);
  const isClosingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const pendingScrollY = window.__builstryCtaScrollY;
    const scrollY = Number.isFinite(pendingScrollY) ? pendingScrollY : window.scrollY;
    delete window.__builstryCtaScrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const lenis = window.__builstryLenis;
    lenis?.stop?.();

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      Object.entries(previous).forEach(([property, value]) => {
        body.style[property] = value;
      });
      if (lenis) {
        lenis.resize?.();
        lenis.start?.();
        lenis.scrollTo?.(scrollY, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
      }
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
  }, []);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  }, [step, submitted]);

  const requestClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => onCloseRef.current?.(), CLOSE_ANIMATION_MS);
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    if (isHomeProblem && name.startsWith("homeAnswer")) {
      const index = Number(name.slice("homeAnswer".length));
      setHomeAnswersByPillar((current) => {
        const answers = current[selectedPillarId] || ["", "", ""];
        return {
          ...current,
          [selectedPillarId]: answers.map((answer, answerIndex) => answerIndex === index ? value : answer),
        };
      });
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
    if (stepError) setStepError("");
    if (invalidField) setInvalidField("");
  };

  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
    if (stepError) setStepError("");
    if (invalidField) setInvalidField("");
  };

  const validateCurrentStep = () => {
    if (isHomeProblem && step === 0 && !selectedPillar) {
      setStepError("Choose the area that feels closest to your problem.");
      return false;
    }
    if (isBooking && step === 0 && !form.topic) {
      setStepError("Choose the topic that feels closest.");
      return false;
    }
    if (!isBooking && !isHomeProblem && step === 3 && form.interests.length === 0) {
      setStepError("Select at least one area so we know where to begin.");
      return false;
    }
    const invalid = [...(formRef.current?.querySelectorAll("input, textarea, select") || [])]
      .find((field) => !field.checkValidity());
    if (invalid) {
      const messages = {
        name: "What name should we use?",
        email: invalid.validity.valueMissing ? "Where can we email you?" : "That email needs a quick check.",
        message: "A sentence or a rough idea is enough to start.",
        date: "Choose a date that could work for you.",
      };
      const homeAnswerIndex = invalid.name?.startsWith("homeAnswer") ? Number(invalid.name.slice("homeAnswer".length)) : -1;
      const homeQuestion = selectedPillar?.questions[homeAnswerIndex];
      setInvalidField(invalid.name);
      setStepError(homeQuestion ? "A short note is enough; share whatever feels useful." : messages[invalid.name] || "Give this detail a quick check before continuing.");
      invalid.focus();
      return false;
    }
    if (isBooking && step === 3 && !form.time) {
      setStepError("Choose a time that could work for you.");
      return false;
    }
    setStepError("");
    setInvalidField("");
    return true;
  };

  const transitionToStep = (nextStep) => {
    if (stepPhase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(nextStep);
      return;
    }
    setStepPhase("exit");
    transitionTimer.current = window.setTimeout(() => {
      setStep(nextStep);
      setStepPhase("enter");
      transitionTimer.current = window.setTimeout(() => setStepPhase("idle"), STEP_ENTER_MS);
    }, STEP_EXIT_MS);
  };

  const selectHomePillar = (pillar) => {
    if (stepPhase !== "idle") return;
    setSelectedPillarId(pillar.id);
    setStepError("");
    setInvalidField("");
    transitionToStep(1);
  };

  const handleContinue = () => {
    if (!validateCurrentStep()) return;
    transitionToStep(Math.min(lastStep, step + 1));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (step < lastStep) {
      handleContinue();
      return;
    }
    if (stepPhase !== "idle" || !isFinalStepValid) return;
    setSubmitted(true);
    setStepError("");
  };

  const toggleTopic = (topic) => {
    setForm((current) => ({ ...current, topic }));
    setStepError("");
    setInvalidField("");
  };

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) requestClose();
  };

  const renderHomeProblemStep = () => {
    if (step === 0) {
      return (
        <>
          <span className="cta-step-index">01 / CHOOSE YOUR AREA</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHAT ARE YOU LOOKING TO SOLVE?</h2>
          <p className="cta-step-copy">Choose the area that feels closest to your problem.<br />We&apos;ll tailor the conversation around it.</p>
          <div className="cta-pillar-list" role="group" aria-label="Choose the area closest to your problem">
            {HOME_PROBLEM_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                className={`cta-pillar-choice${selectedPillarId === pillar.id ? " is-selected" : ""}`}
                aria-pressed={selectedPillarId === pillar.id}
                onClick={() => selectHomePillar(pillar)}
              >
                <span className="cta-pillar-number">{pillar.number}</span>
                <span className="cta-pillar-copy"><strong>{pillar.name}</strong><span>{pillar.description}</span></span>
                <ArrowRight className="cta-pillar-arrow" size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      );
    }

    if (!selectedPillar) return null;

    const focusIndicator = (
      <div className="cta-focus-indicator" aria-label={`Selected focus: ${selectedPillar.name}`}>
        <span>YOUR FOCUS</span>
        <strong>{selectedPillar.name}</strong>
        <button type="button" className="cta-change-focus" onClick={() => { setStepError(""); setInvalidField(""); transitionToStep(0); }}>
          <ArrowLeft size={13} aria-hidden="true" /> Change focus
        </button>
      </div>
    );
    const questionCount = selectedPillar.questions.length;
    const nameStep = questionCount + 1;
    const contactStep = questionCount + 2;
    const finalMessageStep = questionCount + 3;

    if (step >= 1 && step <= questionCount) {
      const questionIndex = step - 1;
      const question = selectedPillar.questions[questionIndex];
      const answerName = `homeAnswer${questionIndex}`;
      return (
        <>
          {focusIndicator}
          <span className="cta-step-index">{String(step + 1).padStart(2, "0")} / {selectedPillar.name.toUpperCase()}</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">{step === 1 ? selectedPillar.name.toUpperCase() : question.heading}</h2>
          {step === 1
            ? <p className="cta-step-lede">Let&apos;s understand the problem you&apos;re trying to solve.</p>
            : <p className="cta-step-copy">One question at a time. A short note or rough outline is enough.</p>}
          <label className="cta-field">{question.label}
            {question.short ? (
              <input
                name={answerName}
                value={homeAnswers[questionIndex]}
                onChange={updateField}
                placeholder={question.placeholder}
                aria-invalid={invalidField === answerName}
                aria-describedby={invalidField === answerName ? "cta-step-error" : undefined}
                required
              />
            ) : (
              <textarea
                name={answerName}
                value={homeAnswers[questionIndex]}
                onChange={updateField}
                rows={4}
                placeholder={question.placeholder}
                aria-invalid={invalidField === answerName}
                aria-describedby={invalidField === answerName ? "cta-step-error" : undefined}
                required
              />
            )}
          </label>
        </>
      );
    }

    if (step === contactStep) {
      return (
        <>
          {focusIndicator}
          <span className="cta-step-index">{String(step + 1).padStart(2, "0")} / EMAIL & CONTACT</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHERE CAN WE REACH YOU?</h2>
          <p className="cta-step-copy">Share the best way to continue this conversation.</p>
          <label className="cta-field">Email address
            <input name="email" value={form.email} onChange={updateField} type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={invalidField === "email"} aria-describedby={invalidField === "email" ? "cta-step-error" : undefined} required />
          </label>
          <label className="cta-field">Phone / WhatsApp <span className="cta-optional">OPTIONAL</span>
            <input name="phone" value={form.phone} onChange={updateField} type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
          </label>
        </>
      );
    }

    if (step === nameStep) {
      return (
        <>
          {focusIndicator}
          <span className="cta-step-index">{String(step + 1).padStart(2, "0")} / YOUR NAME</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHO ARE WE SPEAKING WITH?</h2>
          <p className="cta-step-copy">What should we call you as we think this through together?</p>
          <label className="cta-field">Your name
            <input name="name" value={form.name} onChange={updateField} placeholder="Enter your name" autoComplete="name" aria-invalid={invalidField === "name"} aria-describedby={invalidField === "name" ? "cta-step-error" : undefined} required />
          </label>
        </>
      );
    }

    if (step === finalMessageStep) {
      return (
        <>
          {focusIndicator}
          <span className="cta-step-index">{String(step + 1).padStart(2, "0")} / FINAL MESSAGE</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">ANYTHING ELSE WE SHOULD KNOW?</h2>
          <p className="cta-step-copy">Add any final context that would help us understand your {selectedPillar.name.toLowerCase()} conversation. This is optional.</p>
          <label className="cta-field">Your final note <span className="cta-optional">OPTIONAL</span>
            <textarea name="message" value={form.message} onChange={updateField} rows={4} placeholder="Anything else you'd like to add?" />
          </label>
        </>
      );
    }

    if (step === lastStep) {
      return (
        <>
          {focusIndicator}
          <span className="cta-step-index">{String(step + 1).padStart(2, "0")} / CONFIRMATION</span>
          <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">READY TO START?</h2>
          <p className="cta-step-copy">Review your focus and what you shared. You can go back to make changes.</p>
          <dl className="cta-summary">
            <SummaryRow label="Focus">{selectedPillar.name}</SummaryRow>
            {selectedPillar.questions.map((question, index) => (
              <SummaryRow key={question.heading} label={question.summaryLabel || question.label}>
                <span className="cta-summary-message">{homeAnswers[index]}</span>
              </SummaryRow>
            ))}
            <SummaryRow label="Name">{form.name}</SummaryRow>
            <SummaryRow label="Email">{form.email}</SummaryRow>
            {form.phone && <SummaryRow label="Phone">{form.phone}</SummaryRow>}
            <SummaryRow label="Final message">{form.message || "No additional note."}</SummaryRow>
          </dl>
          <p className="cta-privacy-note"><LockKeyhole size={15} aria-hidden="true" /> This preview is not connected to message delivery; confirming will not send anything outside this page.</p>
        </>
      );
    }

    return null;
  };

  const renderInquiryStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <span className="cta-step-index">01 / WELCOME</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">LET&apos;S START WITH THE BASICS.</h2>
            <p className="cta-step-lede">Tell us a little about yourself.</p>
            <p className="cta-step-copy">Start with only what feels useful. You can go back and change anything.</p>
            <div className="cta-privacy-chip"><LockKeyhole size={15} aria-hidden="true" /> CONFIDENTIAL CONVERSATION</div>
          </>
        );
      case 1:
        return (
          <>
            <span className="cta-step-index">02 / YOUR NAME</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHAT&apos;S YOUR NAME?</h2>
            <p className="cta-step-copy">We&apos;ll use it to make this conversation feel more human.</p>
            <label className="cta-field">Your name
              <input name="name" value={form.name} onChange={updateField} placeholder="Enter your name" autoComplete="name" aria-invalid={invalidField === "name"} aria-describedby={invalidField === "name" ? "cta-step-error" : undefined} required />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <span className="cta-step-index">03 / CONTACT</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHERE CAN WE REACH YOU?</h2>
            <p className="cta-step-copy">Share the best email for a reply. A phone number is optional.</p>
            <label className="cta-field">Email address
              <input name="email" value={form.email} onChange={updateField} type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={invalidField === "email"} aria-describedby={invalidField === "email" ? "cta-step-error" : undefined} required />
            </label>
            <label className="cta-field">Phone / WhatsApp <span className="cta-optional">OPTIONAL</span>
              <input name="phone" value={form.phone} onChange={updateField} type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
            </label>
          </>
        );
      case 3:
        return (
          <>
            <span className="cta-step-index">04 / THE OPPORTUNITY</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHAT ARE YOU LOOKING TO SOLVE?</h2>
            <p className="cta-step-copy">Choose one or more starting points. You can add context next.</p>
            <div className="cta-choice-grid" aria-label="Areas you are interested in">
              {INQUIRY_INTERESTS.map((interest) => {
                const selected = form.interests.includes(interest);
                return (
                  <button key={interest} type="button" className={`cta-choice${selected ? " is-selected" : ""}`} aria-pressed={selected} onClick={() => toggleInterest(interest)}>
                    <span>{interest}</span><span className="cta-choice-mark" aria-hidden="true">{selected ? <Check size={14} /> : "+"}</span>
                  </button>
                );
              })}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <span className="cta-step-index">05 / YOUR CONTEXT</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">GIVE US THE BIGGER PICTURE.</h2>
            <p className="cta-step-copy">Share the part that matters most. A rough outline is more than enough.</p>
            <label className="cta-field">Tell us what you&apos;re thinking about.
              <textarea name="message" value={form.message} onChange={updateField} rows={5} placeholder="Anything else we should know? Share the problem, idea, or opportunity you’re exploring..." aria-invalid={invalidField === "message"} aria-describedby={invalidField === "message" ? "cta-step-error" : undefined} required />
            </label>
            <p className="cta-privacy-note"><ShieldCheck size={15} aria-hidden="true" /> Share as much or as little as feels useful.</p>
          </>
        );
      default:
        return (
          <>
            <span className="cta-step-index">06 / FINAL CONFIRMATION</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">READY TO START?</h2>
            <p className="cta-step-copy">Here&apos;s the outline of your confidential conversation.</p>
            <dl className="cta-summary">
              <SummaryRow label="Name">{form.name}</SummaryRow>
              <SummaryRow label="Email">{form.email}</SummaryRow>
              <SummaryRow label="Interest">{form.interests.join(", ")}</SummaryRow>
              <SummaryRow label="Message"><span className="cta-summary-message">{form.message}</span></SummaryRow>
            </dl>
            <p className="cta-privacy-note"><LockKeyhole size={15} aria-hidden="true" /> This preview does not send your details anywhere.</p>
          </>
        );
    }
  };

  const renderBookingStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <span className="cta-step-index">01 / THE TOPIC</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHAT SHOULD WE TALK ABOUT?</h2>
            <p className="cta-step-copy">Choose the conversation you&apos;d like to have.</p>
            <div className="cta-choice-grid" aria-label="Call topic">
              {BOOKING_TOPICS.map((topic) => (
                <button key={topic} type="button" className={`cta-choice${form.topic === topic ? " is-selected" : ""}`} aria-pressed={form.topic === topic} onClick={() => toggleTopic(topic)}>
                  <span>{topic}</span><span className="cta-choice-mark" aria-hidden="true">{form.topic === topic ? <Check size={14} /> : "+"}</span>
                </button>
              ))}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <span className="cta-step-index">02 / ABOUT YOU</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHO ARE WE SPEAKING WITH?</h2>
            <p className="cta-step-copy">A few details help us come prepared.</p>
            <label className="cta-field">Name
              <input name="name" value={form.name} onChange={updateField} placeholder="Your name" autoComplete="name" aria-invalid={invalidField === "name"} aria-describedby={invalidField === "name" ? "cta-step-error" : undefined} required />
            </label>
            <label className="cta-field">Work email
              <input name="email" value={form.email} onChange={updateField} type="email" placeholder="you@company.com" autoComplete="email" aria-invalid={invalidField === "email"} aria-describedby={invalidField === "email" ? "cta-step-error" : undefined} required />
            </label>
            <label className="cta-field">Who are you building this for? <span className="cta-optional">OPTIONAL</span>
              <input name="company" value={form.company} onChange={updateField} placeholder="A team, an organization, or yourself" autoComplete="organization" />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <span className="cta-step-index">03 / YOUR CONTEXT</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHAT ARE YOU TRYING TO BUILD, FIX OR IMPROVE?</h2>
            <p className="cta-step-copy">A short note is enough to give the conversation a useful starting point.</p>
            <label className="cta-field">Tell us what you&apos;re thinking about.
              <textarea name="message" value={form.message} onChange={updateField} rows={5} placeholder="Anything else we should know? Start wherever feels useful..." aria-invalid={invalidField === "message"} aria-describedby={invalidField === "message" ? "cta-step-error" : undefined} required />
            </label>
            <p className="cta-privacy-note"><LockKeyhole size={15} aria-hidden="true" /> Share only what feels useful to this conversation.</p>
          </>
        );
      case 3:
        return (
          <>
            <span className="cta-step-index">04 / PREFERRED TIME</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">WHEN WOULD YOU LIKE TO TALK?</h2>
            <p className="cta-step-copy">Choose a date and a window that could work. This is a preference, not a confirmed booking.</p>
            <label className="cta-field">Date
              <span className="cta-input-icon"><CalendarDays size={16} aria-hidden="true" /><input name="date" value={form.date} onChange={updateField} type="date" min={getToday()} aria-invalid={invalidField === "date"} aria-describedby={invalidField === "date" ? "cta-step-error" : undefined} required /></span>
            </label>
            <fieldset className="cta-time-fieldset">
              <legend>Preferred time</legend>
              <div className="cta-time-grid">
                {TIME_SLOTS.map((time) => (
                  <button key={time} type="button" className={`cta-time-slot${form.time === time ? " is-selected" : ""}`} aria-pressed={form.time === time} onClick={() => { setForm((current) => ({ ...current, time })); setStepError(""); setInvalidField(""); }}>
                    <Clock3 size={13} aria-hidden="true" />{time}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="cta-field">Time zone
              <select name="timezone" value={form.timezone} onChange={updateField}>
                {TIME_ZONES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
          </>
        );
      default: {
        const timezoneLabel = TIME_ZONES.find(([value]) => value === form.timezone)?.[1] || form.timezone;
        return (
          <>
            <span className="cta-step-index">05 / CONFIRMATION</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">YOUR CONVERSATION IS READY.</h2>
            <p className="cta-step-copy">Review the details you chose for this call request.</p>
            <dl className="cta-summary">
              <SummaryRow label="Topic">{form.topic}</SummaryRow>
              <SummaryRow label="Name">{form.name}</SummaryRow>
              <SummaryRow label="Date">{displayDate(form.date)}</SummaryRow>
              <SummaryRow label="Time">{form.time} · {timezoneLabel}</SummaryRow>
            </dl>
            <p className="cta-privacy-note"><ShieldCheck size={15} aria-hidden="true" /> This is a call request, not a calendar confirmation.</p>
          </>
        );
      }
    }
  };

  const stepLabel = String(step + 1).padStart(2, "0");
  const privacyCue = getPrivacyCue(step);
  const homeAnswersValid = Boolean(selectedPillar?.questions.every((_, index) => homeAnswers[index]?.trim()));
  const isFinalStepValid = isBooking
    ? Boolean(form.topic && form.name.trim() && isValidEmail(form.email) && form.message.trim() && form.date && form.time && form.timezone)
    : isHomeProblem
      ? Boolean(selectedPillar && homeAnswersValid && form.name.trim() && isValidEmail(form.email))
      : Boolean(form.name.trim() && isValidEmail(form.email) && form.interests.length > 0 && form.message.trim());

  return createPortal(
    <div
      className={`cta-modal-backdrop${isClosing ? " is-closing" : ""}`}
      data-cta-mode={mode}
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        ref={dialogRef}
        className={`cta-modal${isBooking ? " is-booking" : isHomeProblem ? " is-home-problem" : " is-inquiry"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-modal-title"
        aria-describedby="cta-modal-description"
        tabIndex={-1}
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

        {!submitted ? (
          <>
            <div className="cta-modal-topline">
              <span key={privacyCue} className="cta-modal-private" aria-live="polite"><LockKeyhole size={13} aria-hidden="true" /> {privacyCue}</span>
              <span className="cta-modal-step-count">STEP {stepLabel} <i>/</i> {String(stepCount).padStart(2, "0")}</span>
            </div>
            <ol className="cta-modal-stepper" aria-label={`Step ${step + 1} of ${stepCount}`}>
              {Array.from({ length: stepCount }, (_, index) => {
                const complete = index < step;
                const active = index === step;
                return (
                  <li key={index} className={`cta-stepper-item${complete ? " is-complete" : active ? " is-active" : " is-upcoming"}`}>
                    <span
                      className="cta-stepper-node"
                      aria-current={active ? "step" : undefined}
                      aria-label={`Step ${index + 1}${complete ? ", complete" : active ? ", current" : ", upcoming"}`}
                    >
                      {complete ? <Check size={12} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                    </span>
                    {index < stepCount - 1 && (
                      <span className="cta-stepper-line" aria-hidden="true">
                        <span style={{ width: complete ? "100%" : "0%" }} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="cta-modal-description" id="cta-modal-description">
              {isBooking ? "A thoughtful conversation, shaped around what matters." : isHomeProblem ? "A private space to think through one focused problem." : "A private space to think through what should come next."}
            </p>
            <form ref={formRef} className="cta-modal-form" onSubmit={handleFormSubmit} noValidate>
              <div key={`${mode}-${step}`} className="cta-modal-step" data-phase={stepPhase}>
                {isBooking ? renderBookingStep() : isHomeProblem ? renderHomeProblemStep() : renderInquiryStep()}
              </div>
              {stepError && <p id="cta-step-error" className="cta-step-error" role="alert">{stepError}</p>}
              {!(isHomeProblem && step === 0) && (
                <div className="cta-modal-actions">
                  {step > 0 ? (
                    <button type="button" className="cta-modal-back" disabled={stepPhase !== "idle"} onClick={() => { setStepError(""); setInvalidField(""); transitionToStep(Math.max(0, step - 1)); }}>
                      <ArrowLeft size={16} aria-hidden="true" /> Back
                    </button>
                  ) : <span />}
                  <button type="submit" className="cta-modal-primary" disabled={stepPhase !== "idle" || (step === lastStep && !isFinalStepValid)}>
                    {step === lastStep
                      ? isBooking
                        ? "Confirm My Call"
                        : isHomeProblem
                          ? <>CONFIRM &amp; SEND <ArrowRight size={16} aria-hidden="true" /></>
                          : <>Start the Conversation <ArrowRight size={16} aria-hidden="true" /></>
                      : <>Continue <ArrowRight size={16} aria-hidden="true" /></>
                    }
                  </button>
                </div>
              )}
            </form>
            <div className="cta-modal-footnote"><ShieldCheck size={14} aria-hidden="true" /> Share only what feels useful. You can go back without losing what you&apos;ve entered.</div>
          </>
        ) : (
          <div className="cta-success">
            <span className="cta-success-icon" aria-hidden="true"><Check size={23} /></span>
            <span className="cta-step-index">{isBooking ? "BUILSTRY / CALL REQUEST" : isHomeProblem ? "BUILSTRY / CONVERSATION NOTES" : "BUILSTRY / PRIVATE ENQUIRY"}</span>
            <h2 ref={titleRef} tabIndex={-1} id="cta-modal-title">{isBooking ? "CALL REQUEST READY." : "CONVERSATION READY."}</h2>
            {isBooking ? (
              <>
                <p className="cta-success-lede">Thanks, {form.name}. Your preferred time is noted in this session.</p>
                <p className="cta-success-copy" id="cta-modal-description">No calendar request has been sent, and this time is not reserved.</p>
              </>
            ) : isHomeProblem ? (
              <>
                <p className="cta-success-lede">Thanks for sharing, {form.name}. Your {selectedPillar?.name} focus is noted in this session.</p>
                <p className="cta-success-copy" id="cta-modal-description">Nothing from this preview has been sent outside this page.</p>
              </>
            ) : (
              <>
                <p className="cta-success-lede">Thanks for sharing, {form.name}.</p>
                <p className="cta-success-copy" id="cta-modal-description">Your note is ready here; nothing has been sent outside this page.</p>
              </>
            )}
            <div className="cta-success-privacy"><LockKeyhole size={15} aria-hidden="true" /><span><strong>PRIVATE BY DEFAULT</strong><br />{isBooking ? "No calendar details have been sent from this preview." : "Your details are held in this page session only."}</span></div>
            <button type="button" className="cta-modal-primary" onClick={requestClose}>Back to Builstry <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}
