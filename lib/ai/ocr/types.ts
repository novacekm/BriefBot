/**
 * OCR Service Types
 * Defines interfaces for document text extraction with Swiss-specific enhancements
 */

/** Swiss canton codes (26 cantons) */
export type SwissCantonCode =
  | "AG"
  | "AI"
  | "AR"
  | "BE"
  | "BL"
  | "BS"
  | "FR"
  | "GE"
  | "GL"
  | "GR"
  | "JU"
  | "LU"
  | "NE"
  | "NW"
  | "OW"
  | "SG"
  | "SH"
  | "SO"
  | "SZ"
  | "TG"
  | "TI"
  | "UR"
  | "VD"
  | "VS"
  | "ZG"
  | "ZH";

/**
 * Document types for Swiss official correspondence
 * - tax: Steuern (tax declarations, bills, assessments)
 * - insurance: KVG, health insurance (premiums, claims)
 * - permit: Immigration (B, C, L, F, G permits)
 * - municipal: Gemeinde (registration, civil matters)
 * - debt_collection: Betreibung (CRITICAL: 10-day Rechtsvorschlag deadline)
 * - social_security: AHV, IV, BVG, EL, EO
 * - vehicle: Strassenverkehrsamt (MFK, road tax, fines)
 * - customs: BAZG (import duties, declarations)
 * - utility: Serafe, electricity, water
 * - unknown: Unclassified document
 */
export type SwissDocumentType =
  | "tax"
  | "insurance"
  | "permit"
  | "municipal"
  | "debt_collection"
  | "social_security"
  | "vehicle"
  | "customs"
  | "utility"
  | "unknown";

/**
 * Urgency levels for deadlines
 * - critical: Legal deadline with severe consequences (e.g., 10-day Rechtsvorschlag)
 * - standard: Administrative deadline (e.g., 30-day tax filing)
 * - informational: No action required, just FYI
 */
export type UrgencyLevel = "critical" | "standard" | "informational";

/** Supported document languages (Swiss official languages, excluding Romansch for MVP) */
export type DocumentLanguage = "de" | "fr" | "it" | "unknown";

/** Reference number types found in Swiss documents */
export type ReferenceType =
  | "ahv"
  | "case"
  | "invoice"
  | "permit"
  | "tax"
  | "other";

/** Government authority levels */
export type AuthorityLevel = "federal" | "cantonal" | "municipal" | "private";

/** Deadline extracted from a document */
export interface ExtractedDeadline {
  /** Description of what the deadline is for */
  description: string;
  /** ISO 8601 date string (e.g., "2026-03-31") */
  date: string;
  /** How urgent this deadline is */
  urgencyLevel: UrgencyLevel;
  /** What happens if deadline is missed */
  consequenceHint?: string;
}

/** Amount extracted from a document */
export interface ExtractedAmount {
  /** Description of what the amount is for */
  description: string;
  /** Original formatted amount (Swiss format: "1'234.50") */
  amount: string;
  /** Parsed numeric value for calculations */
  amountNumeric: number;
  /** Currency code */
  currency: "CHF" | "EUR";
  /** Payment reference (QR-bill reference, IBAN, etc.) */
  paymentReference?: string;
}

/** Reference number extracted from a document */
export interface ExtractedReference {
  /** Type of reference number */
  type: ReferenceType;
  /** The reference number value */
  value: string;
  /** Optional description */
  description?: string;
}

/** Information about the document sender */
export interface SenderAuthority {
  /** Government level */
  level: AuthorityLevel;
  /** Name of the authority (e.g., "Kantonales Steueramt Zürich") */
  name?: string;
  /** Canton code if cantonal or municipal */
  canton?: SwissCantonCode;
}

/** Action item extracted from a document */
export interface ActionItem {
  /** What action the user needs to take */
  action: string;
  /** Reference to deadline date if applicable */
  deadline?: string;
  /** Documents required for this action */
  documents?: string[];
}

/**
 * Result of OCR text extraction
 */
export interface OCRResult {
  /** Extracted text content */
  text: string;
  /** Detected document language */
  language: DocumentLanguage;
  /** Confidence score (0-1) */
  confidence: number;
  /** Classified document type */
  documentType?: SwissDocumentType;
  /** Extracted deadlines */
  deadlines?: ExtractedDeadline[];
  /** Extracted monetary amounts */
  amounts?: ExtractedAmount[];
  /** Extracted reference numbers */
  references?: ExtractedReference[];
  /** Information about the sender */
  senderAuthority?: SenderAuthority;
  /** Extracted action items */
  actionItems?: ActionItem[];
}

/**
 * OCR Service interface
 */
export interface OCRService {
  /**
   * Extract text and structured data from a document image
   * @param buffer - The image/PDF content as a Buffer
   * @param mimeType - The MIME type of the file
   * @param filename - Optional original filename for context
   * @returns OCR result with extracted text and metadata
   */
  extractText(
    buffer: Buffer,
    mimeType: string,
    filename?: string
  ): Promise<OCRResult>;
}
