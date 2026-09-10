"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrambleText } from "./scramble-text";

/**
 * A plain content link (Substack post titles, etc) with the same
 * decode-on-hover text as every other link on the site, but no
 * bracket or arrow decoration — just the underline it already had.
 */
export function HoverLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
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
      className={className ?? "hover:underline"}
    >
      <ScrambleText text={children} active={hovering} />
    </Link>
  );
}
