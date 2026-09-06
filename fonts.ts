import localFont from "next/font/local";

/**
 * Body copy, nav, lists, dates — everything you actually read. A
 * technical, monospace feel without sacrificing legibility.
 */
export const plexMono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The one deliberately loud, chunky pixel moment — used only for the
 * homepage name and page titles. Everywhere else stays quiet on purpose.
 */
export const pixel = localFont({
  src: "../node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-pixel",
  display: "swap",
});
