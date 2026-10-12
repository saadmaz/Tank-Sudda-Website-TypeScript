/**
 * Pricing per service. A price is only displayed when `verified` is true and
 * an amount is present. Everything else is shown as "quoted after assessment".
 *
 * Example of a confirmed entry:
 *   { serviceSlug: "sump-cleaning", model: "from", amountLkr: 10000,
 *     unit: "per sump", verified: true, notes: "…" }
 */

export type PriceModel = "quote" | "fixed" | "from";

export interface PriceEntry {
  serviceSlug: string;
  model: PriceModel;
  /** Amount in Sri Lankan rupees. Null until confirmed by the owner. */
  amountLkr: number | null;
  /** e.g. "per tank", "up to 1,000 L". */
  unit: string | null;
  verified: boolean;
  notes: string | null;
}

export const pricing: PriceEntry[] = [
  {
    serviceSlug: "water-tank-deep-cleaning",
    model: "quote",
    amountLkr: null,
    unit: null,
    verified: false,
    notes: null,
  },
  {
    serviceSlug: "water-tank-vacuum-cleaning",
    model: "quote",
    amountLkr: null,
    unit: null,
    verified: false,
    notes: null,
  },
  {
    serviceSlug: "sump-cleaning",
    model: "quote",
    amountLkr: null,
    unit: null,
    verified: false,
    notes: null,
  },
  {
    serviceSlug: "commercial-tank-cleaning",
    model: "quote",
    amountLkr: null,
    unit: null,
    verified: false,
    notes: "Quoted after a site assessment.",
  },
];

/** Factors that affect a quotation, shown on the pricing page. */
export const pricingFactors: { title: string; description: string }[] = [
  {
    title: "Tank capacity",
    description: "Larger tanks take longer to drain, clean, rinse and refill.",
  },
  {
    title: "Number of tanks and sumps",
    description: "Several tanks or a sump plus overhead tank can be planned as one visit.",
  },
  {
    title: "Access",
    description:
      "Roof height, ladder access, hatch size and how far equipment must be carried all affect the work.",
  },
  {
    title: "Condition",
    description:
      "A tank that has not been cleaned for a long time usually holds more sediment and deposits.",
  },
  {
    title: "Tank type",
    description: "Plastic, concrete and steel tanks are cleaned differently.",
  },
  {
    title: "Location",
    description: "Travel to the property is taken into account.",
  },
];

const lkr = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

export function formatLkr(amount: number): string {
  return `LKR ${lkr.format(amount)}`;
}

export function getPriceEntry(serviceSlug: string): PriceEntry | undefined {
  return pricing.find((entry) => entry.serviceSlug === serviceSlug);
}

export function isDisplayablePrice(
  entry: PriceEntry | undefined,
): entry is PriceEntry & { amountLkr: number } {
  return Boolean(
    entry &&
    entry.verified &&
    entry.model !== "quote" &&
    entry.amountLkr !== null &&
    entry.amountLkr > 0,
  );
}

/** The text shown wherever a service price appears. */
export function describePrice(entry: PriceEntry | undefined): string {
  if (!isDisplayablePrice(entry)) return "Quoted after assessment";
  const amount = formatLkr(entry.amountLkr);
  const base = entry.model === "from" ? `From ${amount}` : amount;
  return entry.unit ? `${base} ${entry.unit}` : base;
}
