import type { Metadata } from "next";
import { getSubstackPosts } from "@/lib/substack";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Writing — Pavan Rikkula",
};

const ARCHIVE_URL = "https://ergodicantilibrary.substack.com/archive";

export default async function WritingPage() {
  const posts = await getSubstackPosts(12);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <h1 className="font-pixel text-lg leading-relaxed sm:text-xl">
          WRITING
        </h1>
      </Reveal>

      <div className="mt-10">
        {posts.length === 0 && (
          <Reveal>
            <p className="text-fg-muted">
              Couldn&rsquo;t load recent posts just now — read everything
              directly on{" "}
              <a href={ARCHIVE_URL} className="arrow-link">
                Substack
              </a>
              .
            </p>
          </Reveal>
        )}

        <ul className="space-y-8">
          {posts.map((post, i) => (
            <Reveal key={post.link} delay={Math.min(i * 0.03, 0.18)}>
              <li>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-sm sm:text-base"
                >
                  <span className="text-fg-muted">
                    [{post.date ? post.date.slice(0, 10) : "----"}]
                  </span>
                  <span className="group-hover:underline">{post.title}</span>
                  <span aria-hidden="true" />
                  <span className="text-fg-muted">
                    {post.description} <span aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>

        {posts.length > 0 && (
          <Reveal delay={0.1}>
            <a
              href={ARCHIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link mt-10 inline-block text-sm"
            >
              more →
            </a>
          </Reveal>
        )}
      </div>
    </div>
  );
}
