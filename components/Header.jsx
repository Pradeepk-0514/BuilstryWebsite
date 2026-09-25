"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, ChevronDown, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const buildLinks = [["Industry Solutions", "/industry-solutions"], ["Business & Product Strategy", "/business-product-strategy"], ["Innovation & Community", "/innovation-community"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const closeMenus = () => { setOpen(false); setBuildOpen(false); };
  return <header className="site-header">
    <Link className="brand" href="/" onClick={closeMenus} aria-label="Builstry home"><span className="brand-mark">B</span><span>BUILSTRY</span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link href="/" onClick={closeMenus}>Home</Link>
      <div className="nav-dropdown" onMouseEnter={() => setBuildOpen(true)} onMouseLeave={() => setBuildOpen(false)}>
        <button className="nav-dropdown-trigger" type="button" aria-expanded={buildOpen} onClick={() => setBuildOpen(!buildOpen)}>What We Do <ChevronDown size={14} className={buildOpen ? "is-rotated" : ""} /></button>
        <AnimatePresence>{buildOpen && <motion.div className="nav-dropdown-menu" initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }} transition={{ duration: .18 }}>{buildLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<ArrowUpRight size={14} /></Link>)}</motion.div>}</AnimatePresence>
      </div>
      <Link href="/products" onClick={closeMenus}>Insights</Link>
      <Link href="/about" onClick={closeMenus}>About</Link>
      <Link href="/verify-certificate" onClick={closeMenus}>Verify certificate</Link>
      <Link className="nav-cta" href="/contact" onClick={closeMenus}><Sparkles size={15} /> Start a Conversation</Link>
    </nav>
    <button className="mobile-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <Link href="/" onClick={closeMenus}>Home<ArrowUpRight size={14} /></Link>
      <button className="mobile-build-toggle" type="button" onClick={() => setBuildOpen(!buildOpen)}>What We Do <ChevronDown size={14} className={buildOpen ? "is-rotated" : ""} /></button>
      {buildOpen && <div className="mobile-subnav">{buildLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<ArrowUpRight size={14} /></Link>)}</div>}
      <Link href="/products" onClick={closeMenus}>Insights<ArrowUpRight size={14} /></Link>
      <Link href="/about" onClick={closeMenus}>About<ArrowUpRight size={14} /></Link>
      <Link href="/verify-certificate" onClick={closeMenus}>Verify certificate<ArrowUpRight size={14} /></Link>
    </motion.div>}</AnimatePresence>
  </header>;
}
