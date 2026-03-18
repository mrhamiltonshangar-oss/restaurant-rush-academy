"use client";

import { useEffect, useRef, useState } from "react";
import { SaveState } from "@/types/game";

const STORAGE_KEY = "restaurant-rush-academy-save";

export function useAutosave(initialState: SaveState) {
  const [saveState, setSaveState] = useState<SaveState>(initialState);
  const [lastSaved, setLastSaved] = useState(initialState.updatedAt);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSaveState(JSON.parse(stored) as SaveState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  async function persist(nextState: SaveState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setSaveState(nextState);
    setLastSaved(nextState.updatedAt);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await fetch("/api/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState),
        signal: controller.signal
      });
    } catch {
      // Local storage remains the offline-first fallback for restricted school networks.
    }
  }

  return { saveState, persist, lastSaved };
}
