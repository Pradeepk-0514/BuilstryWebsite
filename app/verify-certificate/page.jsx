"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, CircleAlert, LoaderCircle } from "lucide-react";
import "./page.css";

function VerificationOption({ number, title, description, label, placeholder, lookupKey }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const statusId = `verify-${lookupKey}-status`;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setStatus("invalid");
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      // This project currently has no certificate lookup API or record database.
      // Do not infer validity or display certificate details without a real response.
      setStatus("unavailable");
    }, 700);
  };

  const handleChange = (event) => {
    window.clearTimeout(timerRef.current);
    setValue(event.target.value);
    setStatus("idle");
  };

  return (
    <section className="verify-method-card" aria-labelledby={`verify-${lookupKey}-title`}>
      <div className="verify-method-topline">
        <span className="verify-method-number">{number}</span>
        <BadgeCheck size={23} aria-hidden="true" />
      </div>

      <h2 id={`verify-${lookupKey}-title`}>{title}</h2>
      <p className="verify-method-description">{description}</p>

      <form className="verify-method-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`verify-${lookupKey}-input`}>{label}</label>
        <input
          ref={inputRef}
          id={`verify-${lookupKey}-input`}
          name={lookupKey}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={status === "invalid"}
          aria-describedby={status !== "idle" ? statusId : undefined}
          disabled={status === "loading"}
        />

        {status === "invalid" && (
          <p className="verify-status is-invalid" id={statusId} role="alert">
            <CircleAlert size={16} aria-hidden="true" /> Enter your {label.toLowerCase()} to continue.
          </p>
        )}
        {status === "loading" && (
          <p className="verify-status is-loading" id={statusId} role="status">
            <LoaderCircle size={16} aria-hidden="true" /> Preparing verification check…
          </p>
        )}
        {status === "unavailable" && (
          <div className="verify-status is-unavailable" id={statusId} role="status">
            <CircleAlert size={17} aria-hidden="true" />
            <span><strong>Unable to verify right now.</strong> This site is not connected to a certificate verification service yet, so no record was checked.</span>
          </div>
        )}

        <button className="verify-submit" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Checking…" : "Verify Certificate"}
          {!status.includes("loading") && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
    </section>
  );
}

export default function VerifyCertificatePage() {
  return (
    <div className="verify-page verify-certificate-page">
      <div className="verify-certificate-shell">
        <header className="verify-certificate-heading">
          <p className="verify-certificate-eyebrow">BUILSTRY / CERTIFICATE CHECK</p>
          <h1>VERIFY YOUR CERTIFICATE</h1>
          <p>Verify the authenticity of your certificate.</p>
        </header>

        <div className="verify-method-grid">
          <VerificationOption
            number="01"
            lookupKey="certificate-id"
            title="VERIFY BY CERTIFICATE ID"
            description="Enter the certificate ID provided on your certificate to verify its authenticity."
            label="Certificate ID"
            placeholder="Enter Certificate ID"
          />
          <VerificationOption
            number="02"
            lookupKey="student-register-number"
            title="VERIFY BY STUDENT REGISTER NUMBER"
            description="Enter your student register number to verify certificates associated with your student record."
            label="Student Register Number"
            placeholder="Enter Student Register Number"
          />
        </div>
      </div>
    </div>
  );
}
