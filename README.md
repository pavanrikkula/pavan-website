# Pavan Rikkula — personal site

A minimal, old-web personal site: a homepage, writing pulled live from
Substack, a bookshelf, and an about page. Deep blue background, near-white
type, pixel/monospace typography, bracketed navigation. Built with
Next.js, TypeScript, and Tailwind CSS, meant to be deployed on Vercel.

This README assumes no prior experience with this codebase — just enough
to make the everyday edits without needing to understand Next.js.

---

## 1. Running it on your computer

You need [Node.js](https://nodejs.org) installed (version 20 or later).
Then, from this folder, in a terminal:

```bash
npm install     # one-time setup
npm run dev     # starts the site at http://localhost:3000
```

Leave that running and open http://localhost:3000. Edits to most files
show up automatically without restarting. Press `Ctrl+C` to stop it.

Run `npm run build` once before deploying to catch any errors early.

---

## 2. Adding your real books (important — do this first)

`data/books.ts` currently holds placeholder entries. Replace them with
your real list. Each book is one entry:

```ts
{
  slug: "flowers-for-algernon",   // unique, lowercase, hyphens instead of spaces
  title: "Flowers for Algernon",
  author: "Daniel Keyes",
  dateRead: "2026-07-15",          // optional — YYYY-MM-DD
  coverUrl: "https://...",         // optional — see note below
  note: "A short personal note.",  // optional, shown when the book is clicked
},
```

`coverUrl` and `note` are both optional. Leave `coverUrl` out and the
shelf shows a plain title/author card instead of a missing image — so
it's fine to add books incrementally as you track down covers. A
reasonable free source for cover images is the Open Library covers API:
`https://covers.openlibrary.org/b/isbn/<ISBN>-M.jpg`.

If you'd rather send me the spreadsheet, I can convert it and wire in
real cover images directly.

---

## 3. How the Writing page works

It's not manually maintained — `app/writing/page.tsx` fetches your
Substack RSS feed (`https://ergodicantilibrary.substack.com/feed`,
behind "Mandelbrot's Footnotes") on a one-hour cache and lists the most
recent posts, each linking straight out to the Substack article. The
homepage shows the two most recent.

If the feed is ever unreachable, the page shows a quiet fallback message
with a link to your Substack archive instead of breaking — you'll see
that fallback if you run this locally offline, that's expected.

If you ever rename the publication or move it to a different Substack
address, update the one URL near the top of `lib/substack.ts`.

---

## 4. Editing text

- **Homepage** name, tagline, and teaser sections: `app/page.tsx`
- **About page**: `app/about/page.tsx` — delete the dashed placeholder
  box once you've replaced the paragraphs below it
- **Nav labels / social links**: `components/nav.tsx`, the `sectionLinks`
  and `socialLinks` arrays near the top

---

## 5. Changing the design

- **Colors**: `app/globals.css`, under `:root` — four named values
  (`--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-hairline`).
  Change the hex values and the whole site updates.
- **Fonts**: `app/fonts.ts`. IBM Plex Mono carries everything you read;
  Press Start 2P is used only for the homepage name and page titles —
  deliberately, so the chunky pixel look stays a moment rather than a
  slog to read. Both are self-hosted via npm (`@fontsource/*`), so
  there's nothing to configure to keep them working.
- **The bracket-link hover effect**: `.bracket-link` in `globals.css` —
  this is the one recurring interaction (nav, socials). `.arrow-link` is
  the plainer style used for content links (the "more →" links).

---

## 6. Deploying to Vercel

1. Free account at [vercel.com](https://vercel.com), and a
   [GitHub](https://github.com) account if you don't have one.
2. Push this folder to a new GitHub repository (GitHub's web upload UI
   works fine if you'd rather not use git directly).
3. In Vercel: **Add New → Project**, pick the repo, **Deploy**. Next.js
   is detected automatically.
4. Add a custom domain later under **Settings → Domains**.

Every push to GitHub after that redeploys automatically.

---

## Project structure, briefly

```
app/
  page.tsx              Homepage
  about/page.tsx          About page
  writing/page.tsx         Writing — live Substack feed
  books/page.tsx            Books — the bookshelf
  layout.tsx                 Wraps every page (nav, fonts)
  globals.css                 Colors, bracket/arrow link styles
  fonts.ts                     Font setup

components/
  nav.tsx                Site nav — edit labels/social links here
  bracket-link.tsx        The [bracketed] link used in nav
  bookshelf.tsx            The books grid + click-to-reveal note
  reveal.tsx / hero-text.tsx   Scroll and load-in animation wrappers
  motion-provider.tsx      Site-wide reduced-motion support

lib/
  substack.ts            Fetches and parses the Substack RSS feed
  format.ts                Date formatting

data/books.ts            Your reading log — replace the placeholders
```
