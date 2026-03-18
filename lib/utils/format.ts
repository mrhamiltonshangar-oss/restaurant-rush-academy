export function formatMinutes(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
