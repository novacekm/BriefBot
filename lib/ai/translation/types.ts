/**
 * Translation Service Types
 * Defines interfaces for document translation with Swiss-contextualized summaries
 */

import type { SwissDocumentType, UrgencyLevel } from "../ocr/types";

/** Supported languages for translation */
export type SupportedLanguage = "de" | "fr" | "it" | "en";

/** Action with urgency level */
export interface TranslationAction {
  /** Description of the action */
  description: string;
  /** How urgent this action is */
  urgency: UrgencyLevel;
  /** Associated deadline date if applicable */
  deadline?: string;
}

/** Deadline with days remaining calculation */
export interface TranslationDeadline {
  /** Description of the deadline */
  description: string;
  /** ISO 8601 date string */
  date: string;
  /** Days remaining until deadline (can be negative if past) */
  daysRemaining?: number;
}

/** Amount with payment status */
export interface TranslationAmount {
  /** Description of the amount */
  description: string;
  /** Formatted amount string */
  amount: string;
  /** Whether this amount is due for payment */
  isPaymentDue: boolean;
}

/** Swiss bureaucratic term explanation */
export interface TermExplanation {
  /** The Swiss German/French/Italian term */
  term: string;
  /** Plain language explanation in target language */
  explanation: string;
}

/**
 * Swiss-contextualized summary of the translated document
 */
export interface TranslationSummary {
  /** Classified document type */
  documentType: SwissDocumentType;
  /** One-line plain language summary (e.g., "This is your annual tax bill for CHF 4,532") */
  headline: string;
  /** Actions the user needs to take */
  actions: TranslationAction[];
  /** Important deadlines */
  deadlines: TranslationDeadline[];
  /** Monetary amounts mentioned */
  amounts: TranslationAmount[];
  /** Swiss bureaucratic terms explained in plain language */
  keyTermsExplained?: TermExplanation[];
  /** Recommended next steps */
  nextSteps?: string[];
  /** Important warnings or cautions */
  warnings?: string[];
}

/**
 * Result of document translation
 */
export interface TranslationResult {
  /** The translated text */
  translatedText: string;
  /** Detected source language */
  sourceLanguage: "de" | "fr" | "it" | "unknown";
  /** Target language of translation */
  targetLanguage: string;
  /** Swiss-contextualized summary */
  summary?: TranslationSummary;
}

/**
 * Translation Service interface
 */
export interface TranslationService {
  /**
   * Translate text with Swiss context understanding
   * @param text - The text to translate
   * @param targetLanguage - The target language
   * @param sourceLanguage - Optional source language (auto-detected if not provided)
   * @returns Translation result with contextualized summary
   */
  translate(
    text: string,
    targetLanguage: SupportedLanguage,
    sourceLanguage?: SupportedLanguage
  ): Promise<TranslationResult>;

  /**
   * Get list of supported languages
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): SupportedLanguage[];
}
