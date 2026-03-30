"use client";

import { motion } from "framer-motion";

const BulletDemo = () => (
  <section className="border-t border-b border-accent/10 bg-tinted py-14 px-8">
    <div className="max-w-170 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-ghost uppercase">
          What it does
        </span>
      </motion.div>

      <div className="font-mono text-[0.82rem] leading-[1.9]">
        <div className="mb-1">
          <span className="text-[0.6rem] tracking-[0.15em] text-ghost mr-4">
            BEFORE
          </span>
        </div>

        <motion.div
          className="text-faint relative inline-block"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          • Responsible for managing team projects and coordinating tasks across
          departments
          <motion.span
            className="absolute top-1/2 left-0 h-px bg-accent"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          />
        </motion.div>

        <div className="mt-7 mb-1">
          <span className="text-[0.6rem] tracking-[0.15em] text-accent mr-4">
            AFTER
          </span>
        </div>

        <motion.div
          className="text-secondary"
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
        >
          • Led cross-functional delivery of 4 concurrent initiatives, cutting
          time-to-ship by 38%
          <motion.span
            className="text-accent ml-0.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.7, duration: 0 }}
            animate={{ opacity: [1, 0, 1] }}
          >
            ▋
          </motion.span>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BulletDemo;
