/**
 * OCR Service Export
 * Exports the active OCR implementation
 */

export * from "./types";
export * from "./mock";

// Export samples for testing
export { germanTaxSample } from "./samples/german-tax";
export { frenchInsuranceSample } from "./samples/french-insurance";
export { italianPermitSample } from "./samples/italian-permit";
