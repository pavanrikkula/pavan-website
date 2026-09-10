import { HeroText } from "@/components/hero-text";
import { Reveal } from "@/components/reveal";
import { ArrowLink } from "@/components/arrow-link";
import { HoverLink } from "@/components/hover-link";
import { WanderingFootnote } from "@/components/wandering-footnote";
import { WanderButton } from "@/components/wander-button";
import { DynamicalSystem } from "@/components/dynamical-system";
import { getSubstackPosts } from "@/lib/substack";
import { getFootnotePool } from "@/lib/footnotes";
import { books } from "@/data/books";

export default async function Home() {
  const posts = await getSubstackPosts();
  const recentPosts = posts.slice(0, 2);
  const currentlyReading = books.filter((b) => b.status === "reading").slice(0, 3);
  const footnotePool = getFootnotePool();

  return (
    <div className="mx-auto max-w-2xl px-6 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32">
      <HeroText
        lines={[
          <h1
            key="name"
            className="font-pixel text-[clamp(1.35rem,5vw,2.5rem)] leading-relaxed"
          >
            Pavan Rikkula
            <WanderingFootnote pool={footnotePool} />
          </h1>,
          <p key="tagline" className="mt-6 text-base text-fg-muted sm:text-lg">
            I write about things I find interesting.
            <span className="terminal-cursor" aria-hidden="true" />
          </p>,
          <p key="wander" className="mt-4 text-xs text-fg-muted">
            <WanderButton
              bookSlugs={books.map((b) => b.slug)}
              externalLinks={posts.map((p) => p.link)}
            />
          </p>,
          <div key="system" className="mt-10">
            <DynamicalSystem />
          </div>,
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
                <HoverLink href={post.link} external>
                  {post.title}
                </HoverLink>
              </li>
            ))}
          </ul>
          <ArrowLink href="/writing">more</ArrowLink>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="text-xs text-fg-muted">reading /</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {currentlyReading.length === 0 && (
              <li className="text-fg-muted">the shelf&rsquo;s all caught up</li>
            )}
            {currentlyReading.map((book) => (
              <li key={book.slug}>
                <HoverLink href={`/reading?book=${book.slug}`} className="block">
                  {book.title}
                </HoverLink>
                {book.author && (
                  <span className="text-xs text-fg-muted">{book.author}</span>
                )}
              </li>
            ))}
          </ul>
          <ArrowLink href="/reading">the shelf</ArrowLink>
        </Reveal>
      </div>
    </div>
  );
}
