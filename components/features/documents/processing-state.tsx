"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/app/generated/prisma";

export interface ProcessingStateProps {
  /** Current document status */
  status: Extract<DocumentStatus, "PENDING" | "PROCESSING" | "FAILED">;
  /** Error message if status is FAILED */
  errorMessage?: string | null;
  /** Callback for extract text action (PENDING state) */
  onExtractText?: () => void;
  /** Callback for retry action (FAILED state) */
  onRetry?: () => void;
  /** Whether an action is in progress */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ProcessingState({
  status,
  errorMessage,
  onExtractText,
  onRetry,
  isLoading = false,
  className,
}: ProcessingStateProps) {
  if (status === "PENDING") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle as="h2">Ready for Processing</CardTitle>
          <CardDescription>
            This document has not been processed yet. Extract text to analyze
            the content, identify deadlines, and translate to your preferred
            language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onExtractText}
            disabled={isLoading || !onExtractText}
            className="min-h-[44px] min-w-[120px]"
          >
            {isLoading ? (
              <>
                <span
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Processing...
              </>
            ) : (
              "Extract Text"
            )}
          </Button>
          {!onExtractText && (
            <p className="mt-3 text-sm text-muted-foreground">
              Text extraction will be available in a future update.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status === "PROCESSING") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle as="h2">Processing Document</CardTitle>
          <CardDescription>
            Analyzing the document, extracting text, and identifying important
            information. This may take a moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              Processing in progress...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // FAILED state
  return (
    <Card className={cn("border-destructive/50", className)}>
      <CardHeader>
        <CardTitle as="h2" className="text-destructive">
          Processing Failed
        </CardTitle>
        <CardDescription>
          An error occurred while processing this document.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <Button
          onClick={onRetry}
          disabled={isLoading || !onRetry}
          variant="outline"
          className="min-h-[44px] min-w-[120px]"
        >
          {isLoading ? (
            <>
              <span
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              Retrying...
            </>
          ) : (
            "Try Again"
          )}
        </Button>
        {!onRetry && (
          <p className="text-sm text-muted-foreground">
            Retry will be available in a future update.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
