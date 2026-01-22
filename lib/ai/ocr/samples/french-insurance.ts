/**
 * French Health Insurance Sample (CSS LAMal Geneva)
 * Realistic mock OCR result for Swiss health insurance premium notice
 */

import type { OCRResult } from "../types";

export const frenchInsuranceSample: OCRResult = {
  text: `CSS Assurance
Service clientèle
Case postale, 1002 Lausanne

Genève, le 10 janvier 2026
Numéro de police: A-987654321

Objet: Modification de prime LAMal 2026

Madame, Monsieur,

Suite à la publication des nouvelles primes d'assurance-maladie, nous vous
informons de vos cotisations pour l'année 2026.

Assurance obligatoire des soins (LAMal)
Modèle standard avec libre choix du médecin

Prime mensuelle 2026                       CHF    385.50
Franchise annuelle                         CHF  2'500.00
Quote-part (10%)                           max CHF 700.00

Réduction de prime (subside cantonal):     CHF    -85.00
-------------------------------------------------------
Prime mensuelle nette                      CHF    300.50

Début de validité: 1er janvier 2026

Vous pouvez bénéficier d'une réduction de prime supplémentaire en optant pour
un modèle alternatif (médecin de famille, HMO, Telmed). Contactez-nous pour
plus d'informations.

IBAN: CH81 0900 0000 1234 5678 9
Référence de paiement: 987654321

Délai de résiliation: 30 novembre pour l'année suivante

Avec nos salutations distinguées,
CSS Assurance`,

  language: "fr",
  confidence: 0.89,
  documentType: "insurance",

  deadlines: [
    {
      description: "Premium effective date",
      date: "2026-01-01",
      urgencyLevel: "informational",
    },
    {
      description: "Cancellation deadline for next year",
      date: "2026-11-30",
      urgencyLevel: "standard",
      consequenceHint:
        "Must notify by November 30 to change insurer for next year",
    },
  ],

  amounts: [
    {
      description: "Monthly Premium (before subsidy)",
      amount: "385.50",
      amountNumeric: 385.5,
      currency: "CHF",
    },
    {
      description: "Annual Deductible (Franchise)",
      amount: "2'500.00",
      amountNumeric: 2500.0,
      currency: "CHF",
    },
    {
      description: "Maximum Co-payment (Quote-part)",
      amount: "700.00",
      amountNumeric: 700.0,
      currency: "CHF",
    },
    {
      description: "Cantonal Subsidy (Réduction)",
      amount: "-85.00",
      amountNumeric: -85.0,
      currency: "CHF",
    },
    {
      description: "Net Monthly Premium",
      amount: "300.50",
      amountNumeric: 300.5,
      currency: "CHF",
      paymentReference: "987654321",
    },
  ],

  references: [
    {
      type: "invoice",
      value: "A-987654321",
      description: "Policy number",
    },
  ],

  senderAuthority: {
    level: "private",
    name: "CSS Assurance",
    canton: "GE",
  },

  actionItems: [
    {
      action: "Pay monthly premium of CHF 300.50",
      documents: ["IBAN: CH81 0900 0000 1234 5678 9"],
    },
    {
      action: "Consider switching to alternative model for lower premium",
    },
    {
      action: "Cancel by November 30 if changing insurer",
      deadline: "2026-11-30",
    },
  ],
};
