"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toCurrency } from "@/lib/utils/format";

const starterRecipes = [
  { id: "r1", name: "Veggie Breakfast Wrap", category: "Fruits and Vegetables", cost: 2.2, price: 7, allergens: ["Egg"] },
  { id: "r2", name: "Blueberry Muffin", category: "Baking", cost: 1.1, price: 4, allergens: ["Wheat", "Dairy"] },
  { id: "r3", name: "Herb Chicken Bowl", category: "Meat and Poultry", cost: 3.8, price: 11, allergens: [] },
  { id: "r4", name: "Cheese Omelet", category: "Dairy and Eggs", cost: 2.5, price: 8, allergens: ["Egg", "Dairy"] }
];

export function MenuPlanner() {
  const [selected, setSelected] = useState<string[]>(["r1", "r2"]);
  const activeRecipes = starterRecipes.filter((recipe) => selected.includes(recipe.id));

  const metrics = useMemo(() => {
    const foodCost = activeRecipes.reduce((sum, recipe) => sum + recipe.cost, 0);
    const revenue = activeRecipes.reduce((sum, recipe) => sum + recipe.price, 0);
    const percentage = revenue === 0 ? 0 : (foodCost / revenue) * 100;

    return { foodCost, revenue, percentage };
  }, [activeRecipes]);

  return (
    <Card className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Menu Planning</p>
        <h2 className="mt-1 text-2xl font-black">Build from templates or remix for your class unit</h2>
        <div className="mt-4 grid gap-3">
          {starterRecipes.map((recipe) => {
            const active = selected.includes(recipe.id);
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() =>
                  setSelected((current) =>
                    current.includes(recipe.id)
                      ? current.filter((id) => id !== recipe.id)
                      : [...current, recipe.id]
                  )
                }
                className={`focus-ring rounded-2xl border p-4 text-left ${
                  active ? "border-[var(--accent)] bg-teal-50" : "border-[var(--border)] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{recipe.name}</div>
                    <p className="mt-1 text-sm text-[var(--muted)]">{recipe.category}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold">{toCurrency(recipe.price)}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Allergens: {recipe.allergens.length > 0 ? recipe.allergens.join(", ") : "None listed"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <Card className="bg-[var(--surface-strong)] text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-orange-200">Menu feedback</div>
          <ul className="mt-3 space-y-2 text-sm text-orange-50">
            <li>Dietary coverage: {activeRecipes.some((recipe) => recipe.allergens.length === 0) ? "Good beginner variety" : "Add one allergen-light option"}</li>
            <li>Pricing balance: {metrics.percentage < 35 ? "Healthy food cost percentage" : "Prices may be too low for later units"}</li>
            <li>Unit alignment: Great fit for baking + breakfast + produce lessons.</li>
          </ul>
        </Card>
        <Card>
          <div className="flex items-center justify-between text-sm">
            <span>Estimated menu food cost</span>
            <span className="font-bold">{toCurrency(metrics.foodCost)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Estimated menu revenue</span>
            <span className="font-bold">{toCurrency(metrics.revenue)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Food cost percentage</span>
            <span className="font-bold">{metrics.percentage.toFixed(0)}%</span>
          </div>
          <Button className="mt-4 w-full">Save Menu Plan</Button>
        </Card>
      </div>
    </Card>
  );
}
