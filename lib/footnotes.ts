import { books } from "@/data/books";

/**
 * A few examples given directly as the intended flavor for this
 * feature — kept verbatim rather than invented.
 */
const SEED_EXAMPLES = [
  "Jensen, 1906",
  "Brownian motion",
  "Apéry",
  "Mandelbrot",
  "probability",
];

const SOURCE_CATEGORIES = new Set([
  "Mathematics",
  "Physics & Science",
  "Finance & Economics",
]);

function cleanAuthor(author: string): string {
  return author
    .replace(/\(Ed\.\)/gi, "")
    .replace(/^trans\.\s*/i, "")
    .split("&")[0]
    .split(",")[0]
    .trim();
}

/**
 * Real authors from the shelf's math/physics/economics sections,
 * mixed in with the seed examples above — so the footnote mostly
 * resolves into something actually on the shelf rather than a fixed
 * hardcoded list.
 */
export function getFootnotePool(): string[] {
  const authors = new Set<string>();

  for (const book of books) {
    if (!book.author || !SOURCE_CATEGORIES.has(book.category)) continue;
    const cleaned = cleanAuthor(book.author);
    if (cleaned.length > 1 && cleaned.length < 24) {
      authors.add(cleaned);
    }
  }

  return [...SEED_EXAMPLES, ...authors];
}
