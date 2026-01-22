import { describe, it, expect } from "vitest";
import {
  selectSample,
  createMockOCRService,
  germanTaxSample,
  frenchInsuranceSample,
  italianPermitSample,
} from "@/lib/ai/ocr";

describe("selectSample", () => {
  describe("German tax detection", () => {
    it("should select German tax sample for filename containing 'steuer'", () => {
      const result = selectSample("steuerrechnung-2024.pdf");
      expect(result).toEqual(germanTaxSample);
    });

    it("should select German tax sample for filename containing 'Steuer' (case insensitive)", () => {
      const result = selectSample("Steuerrechnung.pdf");
      expect(result).toEqual(germanTaxSample);
    });

    it("should select German tax sample for filename containing 'tax'", () => {
      const result = selectSample("tax-bill.pdf");
      expect(result).toEqual(germanTaxSample);
    });
  });

  describe("French insurance detection", () => {
    it("should select French insurance sample for filename containing 'assurance'", () => {
      const result = selectSample("assurance-maladie.pdf");
      expect(result).toEqual(frenchInsuranceSample);
    });

    it("should select French insurance sample for filename containing 'insurance'", () => {
      const result = selectSample("health-insurance.pdf");
      expect(result).toEqual(frenchInsuranceSample);
    });

    it("should select French insurance sample for filename containing 'css'", () => {
      const result = selectSample("css-police.pdf");
      expect(result).toEqual(frenchInsuranceSample);
    });

    it("should select French insurance sample for filename containing 'lamal'", () => {
      const result = selectSample("lamal-prime.pdf");
      expect(result).toEqual(frenchInsuranceSample);
    });

    it("should select French insurance sample for filename containing 'kvg'", () => {
      const result = selectSample("kvg-rechnung.pdf");
      expect(result).toEqual(frenchInsuranceSample);
    });
  });

  describe("Italian permit detection", () => {
    it("should select Italian permit sample for filename containing 'permesso'", () => {
      const result = selectSample("permesso-dimora.pdf");
      expect(result).toEqual(italianPermitSample);
    });

    it("should select Italian permit sample for filename containing 'permit'", () => {
      const result = selectSample("permit-renewal.pdf");
      expect(result).toEqual(italianPermitSample);
    });

    it("should select Italian permit sample for filename containing 'comune'", () => {
      const result = selectSample("comune-lugano.pdf");
      expect(result).toEqual(italianPermitSample);
    });

    it("should select Italian permit sample for filename containing 'migrazione'", () => {
      const result = selectSample("ufficio-migrazione.pdf");
      expect(result).toEqual(italianPermitSample);
    });

    it("should select Italian permit sample for filename containing 'dimora'", () => {
      const result = selectSample("permesso-di-dimora-b.pdf");
      expect(result).toEqual(italianPermitSample);
    });
  });

  describe("Random selection fallback", () => {
    it("should return one of the samples for unrecognized filename", () => {
      const result = selectSample("document.pdf");
      expect([germanTaxSample, frenchInsuranceSample, italianPermitSample]).toContainEqual(result);
    });

    it("should return one of the samples for empty filename", () => {
      const result = selectSample("");
      expect([germanTaxSample, frenchInsuranceSample, italianPermitSample]).toContainEqual(result);
    });
  });
});

describe("createMockOCRService", () => {
  it("should create an OCR service with extractText method", () => {
    const service = createMockOCRService({ skipDelay: true });
    expect(service).toHaveProperty("extractText");
    expect(typeof service.extractText).toBe("function");
  });

  it("should return OCR result with correct structure", async () => {
    const service = createMockOCRService({ skipDelay: true });
    const result = await service.extractText(
      Buffer.from("test"),
      "image/png",
      "steuerrechnung.pdf"
    );

    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("language");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("documentType");
    expect(result).toHaveProperty("deadlines");
    expect(result).toHaveProperty("amounts");
    expect(result).toHaveProperty("references");
    expect(result).toHaveProperty("actionItems");
  });

  it("should return German tax data for tax-related filename", async () => {
    const service = createMockOCRService({ skipDelay: true });
    const result = await service.extractText(
      Buffer.from("test"),
      "image/png",
      "steuerrechnung-zurich.pdf"
    );

    expect(result.language).toBe("de");
    expect(result.documentType).toBe("tax");
    expect(result.text).toContain("Kantonales Steueramt Zürich");
  });

  it("should return French insurance data for insurance-related filename", async () => {
    const service = createMockOCRService({ skipDelay: true });
    const result = await service.extractText(
      Buffer.from("test"),
      "image/png",
      "css-assurance-lamal.pdf"
    );

    expect(result.language).toBe("fr");
    expect(result.documentType).toBe("insurance");
    expect(result.text).toContain("CSS Assurance");
  });

  it("should return Italian permit data for permit-related filename", async () => {
    const service = createMockOCRService({ skipDelay: true });
    const result = await service.extractText(
      Buffer.from("test"),
      "image/png",
      "permesso-dimora-ticino.pdf"
    );

    expect(result.language).toBe("it");
    expect(result.documentType).toBe("permit");
    expect(result.text).toContain("Repubblica e Cantone Ticino");
  });

  it("should vary confidence score within acceptable range", async () => {
    const service = createMockOCRService({ skipDelay: true });

    // Run multiple times to check variation
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        service.extractText(Buffer.from("test"), "image/png", "steuerrechnung.pdf")
      )
    );

    const confidences = results.map((r) => r.confidence);
    const baseConfidence = germanTaxSample.confidence;

    // All confidences should be within ±0.025 of base
    confidences.forEach((conf) => {
      expect(conf).toBeGreaterThanOrEqual(baseConfidence - 0.025);
      expect(conf).toBeLessThanOrEqual(baseConfidence + 0.025);
    });

    // At least some variation should occur
    const uniqueConfidences = new Set(confidences.map((c) => c.toFixed(4)));
    expect(uniqueConfidences.size).toBeGreaterThan(1);
  });
});

describe("Sample data validation", () => {
  describe("German tax sample", () => {
    it("should have correct language", () => {
      expect(germanTaxSample.language).toBe("de");
    });

    it("should have correct document type", () => {
      expect(germanTaxSample.documentType).toBe("tax");
    });

    it("should have valid confidence score", () => {
      expect(germanTaxSample.confidence).toBeGreaterThanOrEqual(0.85);
      expect(germanTaxSample.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have at least one deadline", () => {
      expect(germanTaxSample.deadlines).toBeDefined();
      expect(germanTaxSample.deadlines!.length).toBeGreaterThan(0);
    });

    it("should have at least one amount", () => {
      expect(germanTaxSample.amounts).toBeDefined();
      expect(germanTaxSample.amounts!.length).toBeGreaterThan(0);
    });

    it("should have amounts with CHF currency", () => {
      germanTaxSample.amounts!.forEach((amount) => {
        expect(amount.currency).toBe("CHF");
      });
    });

    it("should have sender authority with canton ZH", () => {
      expect(germanTaxSample.senderAuthority?.canton).toBe("ZH");
    });
  });

  describe("French insurance sample", () => {
    it("should have correct language", () => {
      expect(frenchInsuranceSample.language).toBe("fr");
    });

    it("should have correct document type", () => {
      expect(frenchInsuranceSample.documentType).toBe("insurance");
    });

    it("should have valid confidence score", () => {
      expect(frenchInsuranceSample.confidence).toBeGreaterThanOrEqual(0.85);
      expect(frenchInsuranceSample.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have at least one amount", () => {
      expect(frenchInsuranceSample.amounts).toBeDefined();
      expect(frenchInsuranceSample.amounts!.length).toBeGreaterThan(0);
    });

    it("should have sender authority with canton GE", () => {
      expect(frenchInsuranceSample.senderAuthority?.canton).toBe("GE");
    });
  });

  describe("Italian permit sample", () => {
    it("should have correct language", () => {
      expect(italianPermitSample.language).toBe("it");
    });

    it("should have correct document type", () => {
      expect(italianPermitSample.documentType).toBe("permit");
    });

    it("should have valid confidence score", () => {
      expect(italianPermitSample.confidence).toBeGreaterThanOrEqual(0.85);
      expect(italianPermitSample.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have critical deadline for permit expiry", () => {
      expect(italianPermitSample.deadlines).toBeDefined();
      const criticalDeadline = italianPermitSample.deadlines!.find(
        (d) => d.urgencyLevel === "critical"
      );
      expect(criticalDeadline).toBeDefined();
    });

    it("should have sender authority with canton TI", () => {
      expect(italianPermitSample.senderAuthority?.canton).toBe("TI");
    });
  });
});
