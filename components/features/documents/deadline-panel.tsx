import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedDeadline, UrgencyLevel } from "@/lib/ai/ocr/types";
import { cn } from "@/lib/utils";

/**
 * Calculate days until deadline
 * Returns negative number if overdue
 */
function getDaysUntil(dateStr: string): number {
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date in Swiss format
 */
function formatSwissDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

const urgencyConfig: Record<UrgencyLevel, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "border-red-500 bg-red-50 dark:bg-red-950/30",
  },
  standard: {
    label: "Standard",
    className: "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
  },
  informational: {
    label: "Info",
    className: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
  },
};

export interface DeadlinePanelProps {
  deadlines: ExtractedDeadline[];
  className?: string;
}

export function DeadlinePanel({ deadlines, className }: DeadlinePanelProps) {
  if (deadlines.length === 0) {
    return null;
  }

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
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
              clipRule="evenodd"
            />
          </svg>
          Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline, index) => {
          const daysUntil = getDaysUntil(deadline.date);
          const isOverdue = daysUntil < 0;
          const config = urgencyConfig[deadline.urgencyLevel];

          return (
            <div
              key={index}
              className={cn(
                "rounded-lg border-l-4 p-3",
                config.className
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{deadline.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatSwissDate(deadline.date)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isOverdue ? "text-red-600 dark:text-red-400" :
                      daysUntil <= 7 ? "text-amber-600 dark:text-amber-400" :
                      "text-green-600 dark:text-green-400"
                    )}
                  >
                    {isOverdue
                      ? `${Math.abs(daysUntil)} days overdue`
                      : daysUntil === 0
                      ? "Due today"
                      : daysUntil === 1
                      ? "Due tomorrow"
                      : `${daysUntil} days left`}
                  </span>
                </div>
              </div>
              {deadline.consequenceHint && (
                <p className="mt-2 text-sm italic text-muted-foreground">
                  {deadline.consequenceHint}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
