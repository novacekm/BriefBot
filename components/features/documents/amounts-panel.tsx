import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedAmount } from "@/lib/ai/ocr/types";

/**
 * Format amount in Swiss format with thousands separator
 */
function formatSwissAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface AmountsPanelProps {
  amounts: ExtractedAmount[];
  className?: string;
}

export function AmountsPanel({ amounts, className }: AmountsPanelProps) {
  if (amounts.length === 0) {
    return null;
  }

  // Calculate total per currency
  const totals = amounts.reduce((acc, amount) => {
    const currency = amount.currency;
    acc[currency] = (acc[currency] || 0) + amount.amountNumeric;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle as="h3" className="flex items-center gap-2 text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 001.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 006.83 8H5.75a.75.75 0 000 1.5h.77a6.333 6.333 0 000 1h-.77a.75.75 0 000 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 00-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 01-.343-.55h1.795a.75.75 0 000-1.5H8.026a4.835 4.835 0 010-1h2.224a.75.75 0 000-1.5H8.455c.098-.195.212-.38.343-.55z"
              clipRule="evenodd"
            />
          </svg>
          Amounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Line items */}
          {amounts.map((amount, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-4 border-b border-dashed pb-2 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm">{amount.description}</p>
                {amount.paymentReference && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Ref: {amount.paymentReference}
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 font-mono text-sm font-medium">
                {amount.amount}
              </span>
            </div>
          ))}

          {/* Totals */}
          {Object.entries(totals).map(([currency, total]) => (
            <div
              key={currency}
              className="flex items-center justify-between border-t pt-3"
            >
              <span className="font-semibold">Total</span>
              <span className="font-mono text-lg font-bold">
                {formatSwissAmount(total, currency)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
