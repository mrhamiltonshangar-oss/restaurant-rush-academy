"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RestaurantTheme } from "@/types/game";

const themes: Array<{ id: RestaurantTheme; title: string; description: string }> = [
  { id: "cafe", title: "Cafe", description: "Cozy drinks, breakfast bites, and quick service." },
  { id: "bakery", title: "Bakery", description: "Pastries, precision, and flour-powered drama." },
  { id: "diner", title: "Diner", description: "Fast plates, bigger rushes, classic comfort food." },
  { id: "food-truck", title: "Food Truck", description: "Tiny space, huge flavor, extra chaos." },
  { id: "fantasy-tavern", title: "Fantasy Tavern", description: "Quest vibes with realistic kitchen skills." }
];

export function RestaurantSetup() {
  const [name, setName] = useState("Comet Skillet");
  const [theme, setTheme] = useState<RestaurantTheme>("fantasy-tavern");

  return (
    <Card className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Avatar + Restaurant Setup</p>
          <h2 className="text-2xl font-black">Start the semester with a kitchen identity</h2>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Restaurant name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value.slice(0, 24))}
            className="focus-ring w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          {themes.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`focus-ring rounded-2xl border p-4 text-left transition ${
                theme === item.id
                  ? "border-[var(--primary)] bg-orange-50"
                  : "border-[var(--border)] bg-white hover:border-[var(--accent)]"
              }`}
            >
              <div className="font-bold">{item.title}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[24px] bg-[var(--surface-strong)] p-5 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-200">Moderation-safe preview</p>
        <h3 className="mt-2 text-3xl font-black">{name}</h3>
        <p className="mt-2 text-sm text-orange-50/90">
          Theme: <span className="font-semibold">{themes.find((item) => item.id === theme)?.title}</span>
        </p>
        <p className="mt-3 text-sm text-orange-50/90">
          Names are designed for school-safe use with simple moderation rules. Teachers only see first names and restaurant names.
        </p>
        <Button className="mt-6" variant="secondary">
          Save Setup
        </Button>
      </div>
    </Card>
  );
}
