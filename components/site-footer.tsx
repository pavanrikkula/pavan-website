"use client";

import { useSound } from "./sound-provider";
import { MachineDiagram } from "./machine-diagram";

export function SiteFooter() {
  const { enabled, toggle } = useSound();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-8">
        <MachineDiagram />
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          className="bracket-link text-xs text-fg-muted"
        >
          SOUND: {enabled ? "ON" : "OFF"}
        </button>
      </div>
    </footer>
  );
}
