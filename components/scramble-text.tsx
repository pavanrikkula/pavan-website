"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

const FRAMES = 8;
const FRAME_MS = 28;

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * The site's one recurring link interaction, alongside the bracket
 * tighten/brighten in globals.css: on hover or focus, the label
 * decodes in from noise, left to right, like a cursor resolving a
 * garbled transmission. Leaving just snaps back — no reverse
 * scramble, to keep it quick and un-gimmicky.
 *
 * Controlled by the parent (`active`) rather than managing its own
 * pointer/focus state, so it stays in sync with a parent Link's own
 * :hover/:focus-visible (which drives the bracket animation) even
 * though focus lands on the Link, not this inner span.
 */
export function ScrambleText({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  // Only holds a value while actively scrambling. Whenever we're not
  // active (or the user prefers reduced motion), the real `text` is
  // rendered directly below — no effect needed to "reset" anything.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animating = active && !reducedMotion;

  useEffect(() => {
    if (!animating) return;

    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.ceil((frame / FRAMES) * text.length);

      setScrambled(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            return i < revealCount ? char : randomChar();
          })
          .join(""),
      );

      if (frame >= FRAMES) {
        window.clearInterval(id);
        setScrambled(null);
      }
    }, FRAME_MS);

    return () => window.clearInterval(id);
  }, [animating, text]);

  return <span aria-hidden="true">{animating ? (scrambled ?? text) : text}</span>;
}
