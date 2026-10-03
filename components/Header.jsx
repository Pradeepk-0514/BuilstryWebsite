"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Sparkles, ChevronDown, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const buildLinks = [["Industry Solutions", "/industry-solutions"], ["Business & Product Strategy", "/business-product-strategy"], ["Innovation & Community", "/innovation-community"]];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  const closeMenus = () => { setOpen(false); setBuildOpen(false); };
  const activeClass = (href) => pathname === href ? "nav-active" : undefined;

  useEffect(() => {
    let previousY = window.scrollY;
    let directionTravel = 0;
    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY;
      previousY = currentY;

      if (currentY <= 24 || openRef.current) {
        directionTravel = 0;
        setHidden(false);
        return;
      }

      directionTravel += delta;
      if (directionTravel >= 8 && currentY > 96) {
        setHidden(true);
        directionTravel = 0;
      } else if (directionTravel <= -8) {
        setHidden(false);
        directionTravel = 0;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  return <header className={`site-header${hidden ? " is-hidden" : ""}`}>
    <Link className="brand" href="/" onClick={closeMenus} aria-label="Builstry home"><span className="brand-mark">B</span><span>BUILSTRY</span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link className={activeClass("/")} aria-current={pathname === "/" ? "page" : undefined} href="/" onClick={closeMenus}>Home</Link>
      <div className="nav-dropdown" onMouseEnter={() => setBuildOpen(true)} onMouseLeave={() => setBuildOpen(false)}>
        <button className="nav-dropdown-trigger" type="button" aria-expanded={buildOpen} aria-controls="desktop-build-menu" onClick={() => setBuildOpen((isOpen) => !isOpen)}>What We Do <ChevronDown size={14} className={buildOpen ? "is-rotated" : ""} /></button>
        <AnimatePresence>{buildOpen && <motion.div id="desktop-build-menu" className="nav-dropdown-menu" initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }} transition={{ duration: .18 }}>{buildLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<ArrowUpRight size={14} /></Link>)}</motion.div>}</AnimatePresence>
      </div>
      <Link className={activeClass("/products")} aria-current={pathname === "/products" ? "page" : undefined} href="/products" onClick={closeMenus}>Insights</Link>
      <Link className={activeClass("/about")} aria-current={pathname === "/about" ? "page" : undefined} href="/about" onClick={closeMenus}>About</Link>
      <Link className={activeClass("/verify-certificate")} aria-current={pathname === "/verify-certificate" ? "page" : undefined} href="/verify-certificate" onClick={closeMenus}>Verify certificate</Link>
      <Link className="nav-cta" href="/contact" onClick={closeMenus}><Sparkles size={15} /> Start a Conversation</Link>
    </nav>
    <button className="mobile-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <Link className={activeClass("/")} aria-current={pathname === "/" ? "page" : undefined} href="/" onClick={closeMenus}>Home<ArrowUpRight size={14} /></Link>
      <button className="mobile-build-toggle" type="button" onClick={() => setBuildOpen(!buildOpen)}>What We Do <ChevronDown size={14} className={buildOpen ? "is-rotated" : ""} /></button>
      {buildOpen && <div className="mobile-subnav">{buildLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<ArrowUpRight size={14} /></Link>)}</div>}
      <Link className={activeClass("/products")} aria-current={pathname === "/products" ? "page" : undefined} href="/products" onClick={closeMenus}>Insights<ArrowUpRight size={14} /></Link>
      <Link className={activeClass("/about")} aria-current={pathname === "/about" ? "page" : undefined} href="/about" onClick={closeMenus}>About<ArrowUpRight size={14} /></Link>
      <Link className={activeClass("/verify-certificate")} aria-current={pathname === "/verify-certificate" ? "page" : undefined} href="/verify-certificate" onClick={closeMenus}>Verify certificate<ArrowUpRight size={14} /></Link>
    </motion.div>}</AnimatePresence>
  </header>;
}
