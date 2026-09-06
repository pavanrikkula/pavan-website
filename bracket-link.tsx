import Link from "next/link";
import type { ReactNode } from "react";

export function BracketLink({
  href,
  external,
  active,
  children,
}: {
  href: string;
  external?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={active ? "page" : undefined}
      className={`bracket-link text-sm ${active ? "text-fg" : "text-fg-muted"}`}
    >
      {children}
    </Link>
  );
}
