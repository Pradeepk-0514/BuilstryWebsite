import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import CursorCubeTrail from "./CursorCubeTrail";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [whatWeBuildOpen, setWhatWeBuildOpen] = useState(false);
  const location = useLocation();
  const isInsights =
    location.pathname === "/blog" || location.pathname === "/insights";
  const isAbout = location.pathname === "/about";

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setWhatWeBuildOpen(false);
      }
    };
    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, []);

  const pillars = [
    [
      "Industry Solutions",
      "/industry-solutions",
      "Systems and solutions for real industry problems.",
    ],
    [
      "Business & Product Strategy",
      "/business-product-strategy",
      "Strategy and product thinking built around outcomes.",
    ],
    [
      "Innovation & Community",
      "/innovation-community",
      "Platforms and communities that help ideas move.",
    ],
  ];
  const isBuildSection = pillars.some(([, href]) => location.pathname === href);

  return (
    <div
      className={`site-shell${isInsights ? " insights-shell" : ""}${isAbout ? " about-shell" : ""}`}
    >
      <CursorCubeTrail />
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Builstry home">
          <span className="brand-mark">B</span>
          <span className="brand-name">BUILSTRY</span>
        </Link>

        <nav id="site-navigation" className={`desktop-nav ${open ? "mobile-open" : ""}`} aria-label="Primary navigation">
          <div
            className={`nav-dropdown ${whatWeBuildOpen ? "is-open" : ""} ${isBuildSection ? "is-current" : ""}`}
            onMouseEnter={() => setWhatWeBuildOpen(true)}
            onMouseLeave={() => setWhatWeBuildOpen(false)}
            onFocus={() => setWhatWeBuildOpen(true)}
          >
            <button
              type="button"
              className="nav-dropdown-trigger"
              aria-expanded={whatWeBuildOpen}
              aria-controls="what-we-build-menu"
              aria-haspopup="true"
              onClick={() => setWhatWeBuildOpen((value) => !value)}
            >
              What We Build <span className="nav-chevron">⌄</span>
            </button>
            <div id="what-we-build-menu" className="nav-dropdown-menu">
              {pillars.map(([label, href, description]) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => {
                    setWhatWeBuildOpen(false);
                    setOpen(false);
                  }}
                >
                  <span className="nav-pillar-title">{label}</span>
                  <small>{description}</small>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/" end className={({ isActive }) => isActive ? "is-current" : undefined}>Home</NavLink>
          <NavLink to="/insights" className={({ isActive }) => isActive ? "is-current" : undefined}>Insights</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "is-current" : undefined}>About</NavLink>

          <Link
            className="nav-cta"
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Start a Conversation <span>→</span>
          </Link>
        </nav>

        <button
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <Link to="/" className="footer-brand">
              <span className="brand-mark">B</span> BUILSTRY
            </Link>
            <p>Find. Think. Build.</p>
            <p className="muted">We build what should exist.</p>
            <div className="footer-socials" aria-label="Builstry social links">
              <a href="https://wa.me/" aria-label="WhatsApp" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7l-4.2 1.2 1.2-4.1A8 8 0 1 1 20 11.7Z"/><path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.2.7l-.5.5c.6 1.1 1.5 2 2.6 2.6l.5-.5c.2-.2.4-.3.7-.2l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.5.3-1.2.4-1.8.2-2.7-.8-4.8-2.9-5.8-5.8-.2-.6-.1-1.3.2-1.8Z"/></svg></a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.7H2.5V21h2.7V8.7ZM3.8 3A1.6 1.6 0 1 0 3.8 6.2 1.6 1.6 0 0 0 3.8 3ZM21.5 14c0-3.7-2-5.5-4.8-5.5-2.2 0-3.1 1.2-3.6 2v-1.8h-2.7V21h2.7v-6.1c0-1.6.3-3.2 2.3-3.2 2 0 2 1.8 2 3.3V21h2.7l.1-7Z"/></svg></a>
              <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.3" y="3.3" width="17.4" height="17.4" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.6" r="1" className="icon-fill"/></svg></a>
              <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.5v8h3.2Z"/></svg></a>
            </div>
          </div>

          <div className="footer-links">
          <div className="footer-col">
            <h4>What We Do</h4>
            <Link to="/capabilities">Capabilities</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/ai-forge">AI Forge</Link>
            <Link to="/brand-studio">Brand Studio</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/insights">Insights</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/events">Events</Link>
            <Link to="/hackathons">Hackathons</Link>
          </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Builstry. All rights reserved.
          </span>
          <span>
            <Link to="/privacy-policy">Privacy</Link> ·{" "}
            <Link to="/terms-and-conditions">Terms</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
