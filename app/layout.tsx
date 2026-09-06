import type { Metadata, Viewport } from "next";
import { plexMono, pixel } from "./fonts";
import { Nav } from "@/components/nav";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pavan Rikkula",
  description: "Pavan Rikkula — writing and reading.",
};

export const viewport: Viewport = {
  themeColor: "#000758",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable} ${pixel.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg font-mono text-fg antialiased">
        <MotionProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
