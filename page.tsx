import Link from "next/link";
import { HeroText } from "@/components/hero-text";
import { Reveal } from "@/components/reveal";
import { getSubstackPosts } from "@/lib/substack";
import { books } from "@/data/books";

export default async function Home() {
  const recentPosts = await getSubstackPosts(2);
  const recentBooks = [...books]
    .filter((b) => b.dateRead)
    .sort((a, b) => ((a.dateRead ?? "") < (b.dateRead ?? "") ? 1 : -1))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32">
      <HeroText
        lines={[
          <h1
            key="name"
            className="font-pixel text-[clamp(1.35rem,5vw,2.5rem)] leading-relaxed"
          >
            Pavan Rikkula
          </h1>,
          <p key="tagline" className="mt-6 text-base text-fg-muted sm:text-lg">
            I write about things I find interesting.
            <span className="terminal-cursor" aria-hidden="true" />
          </p>,
        ]}
      />

      <div className="mt-24 grid grid-cols-1 gap-14 sm:mt-32 sm:grid-cols-2 sm:gap-10">
        <Reveal>
          <h2 className="text-xs text-fg-muted">writing /</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recentPosts.length === 0 && (
              <li className="text-fg-muted">nothing loaded yet</li>
            )}
            {recentPosts.map((post) => (
              <li key={post.link}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/writing"
            className="arrow-link mt-5 inline-block text-xs text-fg-muted"
          >
            more →
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="text-xs text-fg-muted">reading /</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recentBooks.map((book) => (
              <li key={book.slug}>
                <span className="block">{book.title}</span>
                <span className="text-xs text-fg-muted">{book.author}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/books"
            className="arrow-link mt-5 inline-block text-xs text-fg-muted"
          >
            the shelf →
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
