"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProcessingState } from "./processing-state";
import { processDocument } from "@/lib/actions/ocr";
import type { DocumentStatus } from "@/app/generated/prisma";

export interface ProcessingActionsProps {
  /** Document ID to process */
  documentId: string;
  /** Current document status */
  status: Extract<DocumentStatus, "PENDING" | "PROCESSING" | "FAILED">;
  /** Error message if status is FAILED */
  errorMessage?: string | null;
  /** Additional CSS classes */
  className?: string;
}

export function ProcessingActions({
  documentId,
  status,
  errorMessage,
  className,
}: ProcessingActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleExtractText = () => {
    setError(null);
    startTransition(async () => {
      const result = await processDocument(documentId);
      if (!result.success) {
        setError(result.error);
      } else {
        // Refresh the page to show updated status
        router.refresh();
      }
    });
  };

  const handleRetry = () => {
    // For retry, we reset the document status first
    // For now, we'll just trigger extraction again
    handleExtractText();
  };

  return (
    <div className={className}>
      <ProcessingState
        status={status}
        errorMessage={error || errorMessage}
        onExtractText={status === "PENDING" ? handleExtractText : undefined}
        onRetry={status === "FAILED" ? handleRetry : undefined}
        isLoading={isPending}
      />
    </div>
  );
}
