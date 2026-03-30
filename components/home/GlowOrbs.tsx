"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const GlowOrbs = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mx1 = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const my1 = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const mx2 = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const my2 = useSpring(mouseY, { stiffness: 30, damping: 25 });

  const { scrollY } = useScroll();
  const sy1 = useTransform(scrollY, [0, 800], [0, -200]);
  const sy2 = useTransform(scrollY, [0, 800], [0, 120]);

  const orb1Y = useTransform(
    [my1, sy1],
    ([m, s]) => (m as number) + (s as number),
  );
  const orb2Y = useTransform(
    [my2, sy2],
    ([m, s]) => -(m as number) * 0.7 + (s as number),
  );
  const orb1X = useTransform(mx1, (v) => v);
  const orb2X = useTransform(mx2, (v) => -v * 0.7);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 300);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 300);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute z-0 inset-0 pointer-events-none">
      <motion.div
        className="absolute"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-15vw",
          right: "-10vw",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 15%, transparent) 0%, transparent 70%)",
          x: orb1X,
          y: orb1Y,
        }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "45vw",
          height: "45vw",
          top: "15vw",
          left: "-10vw",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-vivid) 15%, transparent) 0%, transparent 70%)",
          x: orb2X,
          y: orb2Y,
        }}
      />
    </div>
  );
};

export default GlowOrbs;
