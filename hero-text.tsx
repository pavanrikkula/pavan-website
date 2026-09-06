"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const line = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroText({ lines }: { lines: ReactNode[] }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {lines.map((content, i) => (
        <motion.div key={i} variants={line}>
          {content}
        </motion.div>
      ))}
    </motion.div>
  );
}
