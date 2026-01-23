/**
 * Mock OCR Service
 * Returns realistic Swiss document data for testing without API costs
 */

import type { OCRService, OCRResult } from "./types";
import { germanTaxSample } from "./samples/german-tax";
import { frenchInsuranceSample } from "./samples/french-insurance";
import { italianPermitSample } from "./samples/italian-permit";

const samples = [germanTaxSample, frenchInsuranceSample, italianPermitSample];

/** Default processing delay in milliseconds */
const DEFAULT_MIN_DELAY = 1000;
const DEFAULT_MAX_DELAY = 2000;

/** Confidence variation range (±0.025) */
const CONFIDENCE_VARIATION = 0.025;

/**
 * Select appropriate sample based on filename keywords
 */
export function selectSample(filename: string): OCRResult {
  const lower = filename.toLowerCase();

  // German tax detection
  if (lower.includes("steuer") || lower.includes("tax")) {
    return germanTaxSample;
  }

  // French insurance detection
  if (
    lower.includes("assurance") ||
    lower.includes("insurance") ||
    lower.includes("css") ||
    lower.includes("lamal") ||
    lower.includes("kvg")
  ) {
    return frenchInsuranceSample;
  }

  // Italian permit detection
  if (
    lower.includes("permesso") ||
    lower.includes("permit") ||
    lower.includes("comune") ||
    lower.includes("migrazione") ||
    lower.includes("dimora")
  ) {
    return italianPermitSample;
  }

  // Default: random selection
  return samples[Math.floor(Math.random() * samples.length)];
}

/**
 * Add small random variation to confidence score for realism
 */
function varyConfidence(baseConfidence: number): number {
  const variation = (Math.random() * 2 - 1) * CONFIDENCE_VARIATION;
  return Math.min(1, Math.max(0, baseConfidence + variation));
}

/**
 * Simulate processing delay
 */
async function simulateProcessingDelay(
  minDelay = DEFAULT_MIN_DELAY,
  maxDelay = DEFAULT_MAX_DELAY
): Promise<void> {
  const delay = minDelay + Math.random() * (maxDelay - minDelay);
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export interface MockOCROptions {
  /** Minimum processing delay in ms (default: 1000) */
  minDelay?: number;
  /** Maximum processing delay in ms (default: 2000) */
  maxDelay?: number;
  /** Skip delay for testing (default: false) */
  skipDelay?: boolean;
}

/**
 * Create a mock OCR service with configurable options
 */
export function createMockOCRService(options: MockOCROptions = {}): OCRService {
  const { minDelay = DEFAULT_MIN_DELAY, maxDelay = DEFAULT_MAX_DELAY, skipDelay = false } = options;

  return {
    async extractText(
      _buffer: Buffer,
      _mimeType: string,
      filename?: string
    ): Promise<OCRResult> {
      // Simulate processing time (unless skipped for tests)
      if (!skipDelay) {
        await simulateProcessingDelay(minDelay, maxDelay);
      }

      const sample = selectSample(filename || "");

      return {
        ...sample,
        confidence: varyConfidence(sample.confidence),
      };
    },
  };
}

/**
 * Default mock OCR service instance
 */
export const mockOCRService = createMockOCRService();
