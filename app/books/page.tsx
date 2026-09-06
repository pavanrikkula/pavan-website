import type { Metadata } from "next";
import { books } from "@/data/books";
import { Bookshelf } from "@/components/bookshelf";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Books — Pavan Rikkula",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <h1 className="font-pixel text-lg leading-relaxed sm:text-xl">
          BOOKS
        </h1>
      </Reveal>

      <div className="mt-10">
        <Reveal>
          <Bookshelf books={books} />
        </Reveal>
      </div>
    </div>
  );
}
