"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CtaStrip = () => (
  <section className="border-t border-accent/10 py-16 px-8 text-center">
    <motion.p
      className="text-[clamp(1.4rem,3vw,2rem)] text-secondary mb-8 tracking-[-0.02em] italic"
      style={{ fontFamily: "Georgia, serif" }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      See it in action.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      <Link
        href="/demo"
        className="inline-block px-9 py-3.5 bg-linear-to-br from-accent to-vivid text-white no-underline text-[0.875rem] font-semibold rounded"
      >
        Open Demo →
      </Link>
    </motion.div>
  </section>
);

export default CtaStrip;
