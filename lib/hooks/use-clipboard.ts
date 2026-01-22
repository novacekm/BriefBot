"use client";

import { useCallback, useState, useRef, useEffect } from "react";

interface UseClipboardOptions {
  /** Reset delay in milliseconds (default: 2000) */
  resetDelay?: number;
}

interface UseClipboardReturn {
  /** Whether text was successfully copied */
  copied: boolean;
  /** Copy text to clipboard */
  copyToClipboard: (text: string) => Promise<boolean>;
  /** Reset copied state */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard with success feedback
 *
 * @param options - Configuration options
 * @returns Clipboard state and copy function
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { resetDelay = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.warn("Clipboard API not available");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Auto-reset after delay
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, resetDelay);

        return true;
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copyToClipboard, reset };
}
