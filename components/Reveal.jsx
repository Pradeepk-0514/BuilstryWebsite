"use client";

import { motion } from "framer-motion";

export default function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}
