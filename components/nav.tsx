"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BracketLink } from "./bracket-link";

const sectionLinks = [
  { href: "/writing", label: "writing" },
  { href: "/books", label: "books" },
  { href: "/about", label: "about" },
];

const socialLinks = [
  { href: "https://substack.com/@pavanrikkula", label: "substack" },
  { href: "https://x.com/pavan_rikkula", label: "twitter" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-hairline">
      <nav className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-6 sm:px-8">
        <Link href="/" className="text-sm tracking-tight">
          Pavan Rikkula
        </Link>

        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {sectionLinks.map((link) => (
            <BracketLink
              key={link.href}
              href={link.href}
              active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
            >
              {link.label}
            </BracketLink>
          ))}

          <span className="mx-2 text-fg-muted" aria-hidden="true">
            /
          </span>

          {socialLinks.map((link) => (
            <BracketLink key={link.href} href={link.href} external>
              {link.label}
            </BracketLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
