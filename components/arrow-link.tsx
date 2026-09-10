"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrambleText } from "./scramble-text";

/**
 * The plainer content-link style (underline, not brackets) — "more →",
 * "the shelf →", etc. Shares the same decode-on-hover language as
 * BracketLink; the arrow itself stays put so the motion reads as the
 * word resolving, not the whole line jittering.
 */
export function ArrowLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: string;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="arrow-link"
    >
      <ScrambleText text={children} active={hovering} /> <span aria-hidden="true">→</span>
    </Link>
  );
}
