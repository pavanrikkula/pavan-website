"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SoundKind = "click" | "reveal" | "toggle-on" | "toggle-off";

const SOUND_FILES: Record<SoundKind, string> = {
  click: "/sounds/click.wav",
  reveal: "/sounds/reveal.wav",
  "toggle-on": "/sounds/toggle-on.wav",
  "toggle-off": "/sounds/toggle-off.wav",
};

const VOLUME = 0.5;

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (kind: SoundKind) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * Off by default, every time, for every visitor, deliberately with no
 * persistence — a returning visitor starts muted again rather than
 * risk a server/client mismatch on the footer's "SOUND: OFF/ON" text.
 * No audio plays until the toggle is clicked, and that click is also
 * what satisfies the browser's autoplay-gesture requirement, so sound
 * is structurally incapable of playing before it's explicitly asked for.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const cache = useRef<Partial<Record<SoundKind, HTMLAudioElement>>>({});

  const playFile = useCallback((kind: SoundKind) => {
    let audio = cache.current[kind];
    if (!audio) {
      audio = new Audio(SOUND_FILES[kind]);
      audio.volume = VOLUME;
      cache.current[kind] = audio;
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser declined playback (e.g. no user-activation yet) —
      // fail silently rather than surface an error for a sound
      // effect nobody's blocked on.
    });
  }, []);

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;
      playFile(kind);
    },
    [enabled, playFile],
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      // Bypass the `enabled` gate above so the toggle itself always
      // gets a confirmation sound, including the moment sound turns
      // off — this call is always inside the click that triggered it.
      playFile(next ? "toggle-on" : "toggle-off");
      return next;
    });
  }, [playFile]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
}
