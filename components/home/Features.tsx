"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    num: "01",
    title: "Browse",
    desc: "View the full resume — experience, education, projects, and skills — as-is.",
  },
  {
    num: "02",
    title: "Tailor",
    desc: "Paste any job description. Pick a model. The AI rewrites every bullet for the role.",
  },
  {
    num: "03",
    title: "Download",
    desc: "Export a polished PDF tailored to the position, ready to send.",
  },
];

const Features = () => (
  <section className="px-8 py-[clamp(4rem,8vw,6rem)] max-w-215 mx-auto">
    <div className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))]">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.num}
          className="border-t border-accent/12 pt-8 pb-8 pr-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.12 }}
        >
          <div className="font-mono text-[0.6rem] text-accent tracking-[0.15em] mb-5">
            {f.num}
          </div>
          <h3 className="text-[1rem] text-secondary font-medium mb-2.5 tracking-[-0.01em]">
            {f.title}
          </h3>
          <p className="text-[0.82rem] text-faint leading-[1.75]">
            {f.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Features;
