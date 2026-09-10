"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrambleText } from "./scramble-text";
import { useSound } from "./sound-provider";

/**
 * A tiny footnote marker beside the homepage name. It drifts slightly
 * on its own — never far, never fast — and resolving it on hover or
 * focus reveals a fragment tied to what's actually on the shelf
 * (see lib/footnotes.ts), using the same decode effect as every other
 * link on the site. Picks a new fragment each time it's triggered, so
 * it reads a little like flipping through footnotes in a strange
 * document rather than a static label.
 */
export function WanderingFootnote({ pool }: { pool: string[] }) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState(pool[0] ?? "");
  const { play } = useSound();

  function pickNew() {
    if (pool.length === 0) return;
    setLabel(pool[Math.floor(Math.random() * pool.length)]);
    play("reveal");
  }

  return (
    <span className="relative inline-block align-top">
      <motion.sup
        tabIndex={0}
        role="note"
        aria-label={active ? `Footnote: ${label}` : "Footnote — hover to read"}
        className="ml-0.5 cursor-help font-mono text-[0.65em] text-fg-muted outline-none focus-visible:text-accent"
        animate={{ x: [0, 2, -1, 2, 0], y: [0, -2, 1, -1, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        onMouseEnter={() => {
          pickNew();
          setActive(true);
        }}
        onMouseLeave={() => setActive(false)}
        onFocus={() => {
          pickNew();
          setActive(true);
        }}
        onBlur={() => setActive(false)}
      >
        1
      </motion.sup>

      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute left-0 top-full z-10 mt-1 whitespace-nowrap font-mono text-xs text-fg-muted"
          >
            ¹ <ScrambleText text={label} active={active} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
