import type { Book } from "./book-types";
import { mathematicsBooks } from "./library/mathematics";
import { physics_scienceBooks } from "./library/physics-science";
import { finance_economicsBooks } from "./library/finance-economics";
import { history_politicsBooks } from "./library/history-politics";
import { philosophy_religionBooks } from "./library/philosophy-religion";
import { computer_scienceBooks } from "./library/computer-science";
import { fictionBooks } from "./library/fiction";
import { psychologyBooks } from "./library/psychology";
import { poetryBooks } from "./library/poetry";
import { biography_memoirBooks } from "./library/biography-memoir";
import { referenceBooks } from "./library/reference";
import { otherBooks } from "./library/other";

export type { Book, BookCategory, BookStatus } from "./book-types";
export { CATEGORIES } from "./book-types";

/**
 * THE canonical book list — the only place `@/data/books` can ever
 * resolve to. This file deliberately lives at data/books.ts (a single
 * file, not a data/books/ directory) so that copying a new version of
 * this project over an existing checkout always overwrites whatever
 * was at this exact path before, rather than leaving a stale sibling
 * file or directory around for the module resolver to pick between.
 * (That ambiguity — an old data/books.ts left over from before this
 * redesign, sitting next to a new data/books/ directory — is what
 * caused the "two Book types" build failure.)
 *
 * The actual data is still split one file per category under
 * data/library/ (matching the source spreadsheet's sheets) so a shelf
 * of hundreds of books stays easy to hand-edit — this file just
 * combines them.
 *
 * Catalogued from photographed shelves in September 2026. Ratings and
 * reviews are intentionally blank across the board — add them
 * yourself as you go; nothing here is invented.
 *
 * Cover images are NOT baked in here — see lib/open-library.ts, which
 * resolves them at request/build time on whatever server runs the
 * site, so this file never needs a separate fetch step run against it.
 */
export const books: Book[] = [
  ...mathematicsBooks,
  ...physics_scienceBooks,
  ...finance_economicsBooks,
  ...history_politicsBooks,
  ...philosophy_religionBooks,
  ...computer_scienceBooks,
  ...fictionBooks,
  ...psychologyBooks,
  ...poetryBooks,
  ...biography_memoirBooks,
  ...referenceBooks,
  ...otherBooks,
];
