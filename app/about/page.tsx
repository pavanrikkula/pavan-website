import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { BracketLink } from "@/components/bracket-link";

export const metadata: Metadata = {
  title: "About — Pavan Rikkula",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <h1 className="font-pixel text-lg leading-relaxed sm:text-xl">
          ABOUT
        </h1>

        <div className="mt-8 max-w-md space-y-5 text-sm leading-relaxed sm:text-base">
          <p>Pavan Rikkula.</p>
          <p>
            I write, I read, and I&rsquo;m generally trying to figure a few
            things out. This site is where some of that ends up.
          </p>
        </div>

        <div className="mt-10 flex gap-1">
          <BracketLink href="https://substack.com/@pavanrikkula" external>
            substack
          </BracketLink>
          <BracketLink href="https://x.com/pavan_rikkula" external>
            twitter
          </BracketLink>
        </div>
      </Reveal>
    </div>
  );
}
