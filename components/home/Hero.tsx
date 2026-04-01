"use client";

import Link from "next/link";
import { motion, type MotionProps } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

const fadeUp = (
  delay = 0,
): Pick<MotionProps, "initial" | "animate" | "transition"> => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut", delay },
});

const Hero = () => {
  const lenis = useLenis();
  return (
  <section className="relative px-8 pt-[clamp(5rem,12vw,9rem)] pb-[clamp(4rem,8vw,7rem)] max-w-215 mx-auto">
    <motion.div {...fadeUp(0.1)} className="mb-3">
      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-accent uppercase">
        Zackary Overend · Software Developer
      </span>
    </motion.div>

    <motion.h1
      {...fadeUp(0.2)}
      className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.06] tracking-[-0.03em] font-semibold text-primary mb-7"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      A resume that
      <br />
      <span className="accent-text italic">adapts</span> to the role.
    </motion.h1>

    <motion.p
      {...fadeUp(0.3)}
      className="text-[1.05rem] text-dim max-w-110 leading-[1.75] mb-10"
    >
      Paste a job description. The AI rewrites every bullet point — precise,
      relevant, downloadable as a PDF.
    </motion.p>

    <motion.div {...fadeUp(0.4)} className="flex gap-3.5 flex-wrap">
      <a
        href="#how-it-works"
        onClick={(e) => { e.preventDefault(); lenis?.scrollTo("#how-it-works"); }}
        className="btn-secondary inline-block px-6 py-[0.7rem] border border-surface text-muted no-underline text-[0.85rem] rounded transition-[border-color,color] duration-150"
      >
        How it works ↓
      </a>
      <Link
        href="/demo"
        className="inline-block px-6 py-[0.7rem] bg-linear-to-br from-accent to-vivid text-white no-underline text-[0.85rem] font-semibold rounded"
      >
        Try the Demo →
      </Link>
    </motion.div>
  </section>
  );
};

export default Hero;
