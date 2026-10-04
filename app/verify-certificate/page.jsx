"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";

export default function VerifyCertificatePage() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return <div className="verify-page"><div className="verify-card"><BadgeCheck size={46} className="verify-icon" /><p className="eyebrow">BUILSTRY / VERIFY</p><h1>Check the signal.</h1><p>Enter a certificate reference to verify a Builstry program, workshop or collaboration.</p><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label htmlFor="certificate">Certificate ID</label><input id="certificate" value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. BUI-2026-001" required /><button className="button button-primary" type="submit">Verify certificate <ArrowRight size={16} /></button></form>{submitted && <p className="form-result">Reference <strong>{value}</strong> is queued for verification. Connect your verification API when ready.</p>}</div></div>;
}
