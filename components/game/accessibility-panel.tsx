"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export function AccessibilityPanel() {
  const [settings, setSettings] = useState({
    reducedMotion: true,
    largerText: false,
    simplifiedInstructions: true,
    audioCues: false
  });

  function toggle(key: keyof typeof settings) {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Accessibility + school usability</p>
      <div className="mt-4 grid gap-3">
        {[
          ["reducedMotion", "Reduced motion"],
          ["largerText", "Larger text"],
          ["simplifiedInstructions", "Simplified instructions"],
          ["audioCues", "Optional audio cues"]
        ].map(([key, label]) => {
          const typedKey = key as keyof typeof settings;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(typedKey)}
              className="focus-ring flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-left"
            >
              <span className="font-semibold">{label}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${settings[typedKey] ? "bg-teal-50 text-[var(--accent)]" : "bg-stone-100 text-[var(--muted)]"}`}>
                {settings[typedKey] ? "On" : "Off"}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
