import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeadlinePanel } from "./deadline-panel";
import { ActionsPanel } from "./actions-panel";
import { AmountsPanel } from "./amounts-panel";
import type {
  ExtractedDeadline,
  ExtractedAmount,
  ActionItem,
} from "@/lib/ai/ocr/types";

export interface DocumentSummaryProps {
  /** Extracted deadlines from OCR */
  deadlines?: ExtractedDeadline[];
  /** Extracted action items from OCR */
  actions?: ActionItem[];
  /** Extracted amounts from OCR */
  amounts?: ExtractedAmount[];
  className?: string;
}

export function DocumentSummary({
  deadlines = [],
  actions = [],
  amounts = [],
  className,
}: DocumentSummaryProps) {
  const hasContent = deadlines.length > 0 || actions.length > 0 || amounts.length > 0;

  // MVP: Show placeholder when no structured data is available
  if (!hasContent) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Document Summary
          </CardTitle>
          <CardDescription>
            AI-powered extraction of deadlines, actions, and amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Structured data extraction (deadlines, required actions, and payment
            amounts) will be available in a future update. For now, please review
            the extracted text below.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show structured data panels when available
  return (
    <div className={className}>
      <h2 className="mb-4 text-lg font-semibold">Document Summary</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deadlines.length > 0 && (
          <DeadlinePanel deadlines={deadlines} className="md:col-span-2 lg:col-span-1" />
        )}
        {actions.length > 0 && (
          <ActionsPanel actions={actions} className="md:col-span-2 lg:col-span-1" />
        )}
        {amounts.length > 0 && (
          <AmountsPanel amounts={amounts} className="md:col-span-2 lg:col-span-1" />
        )}
      </div>
    </div>
  );
}
