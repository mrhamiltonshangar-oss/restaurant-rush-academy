import { Card } from "@/components/ui/card";
import { demoRestaurant } from "@/lib/game/content";
import { ProgressBar } from "@/components/ui/progress-bar";
import { toCurrency } from "@/lib/utils/format";

const randomEvents = [
  "Employee callout: morale -4 unless you rebalance stations.",
  "Broken toaster: pay $120 or run a slower service round.",
  "Customer rush: gain extra cash if organization stays above 75."
];

export function BusinessDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="grid gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Restaurant Business</p>
          <h2 className="mt-1 text-2xl font-black">{demoRestaurant.name}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{demoRestaurant.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--border)]">
            <div className="text-sm text-[var(--muted)]">Cash</div>
            <div className="mt-1 text-2xl font-black">{toCurrency(demoRestaurant.cash)}</div>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--border)]">
            <div className="text-sm text-[var(--muted)]">Stars</div>
            <div className="mt-1 text-2xl font-black">{demoRestaurant.stars}</div>
          </div>
        </div>
        {[
          { label: "Inventory health", value: demoRestaurant.inventoryHealth },
          { label: "Staff morale", value: demoRestaurant.staffMorale },
          { label: "Customer satisfaction", value: demoRestaurant.customerSatisfaction },
          { label: "Reputation", value: demoRestaurant.reputation }
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-bold">{item.value}%</span>
            </div>
            <ProgressBar value={item.value} />
          </div>
        ))}
      </Card>

      <Card>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Random Events</p>
        <div className="mt-4 grid gap-3">
          {randomEvents.map((event) => (
            <div key={event} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="font-semibold">{event}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Recovery mechanics keep the semester low-stakes. Students can take a bailout choice instead of hard failing.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
