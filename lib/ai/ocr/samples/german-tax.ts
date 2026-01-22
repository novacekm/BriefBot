/**
 * German Tax Bill Sample (Steuerrechnung Zürich)
 * Realistic mock OCR result for Swiss cantonal tax bill
 */

import type { OCRResult } from "../types";

export const germanTaxSample: OCRResult = {
  text: `Kantonales Steueramt Zürich
Dienstabteilung Inkasso
Postfach, 8090 Zürich

Zürich, 15. Januar 2026
Referenznummer: 123.456.789.10

Betreff: Definitive Steuerrechnung 2024

Sehr geehrte Steuerpflichtige,

Gestützt auf die rechtskräftige Veranlagungsverfügung vom 20. Dezember 2025
stellen wir Ihnen folgende Steuerrechnung zu:

Staatssteuer 2024                          CHF  2'847.00
Gemeindesteuer 2024 (Steuerfuss 119%)      CHF  1'185.00
Direkte Bundessteuer 2024                  CHF    500.00
-------------------------------------------------------
Total                                      CHF  4'532.00

Zahlungsfrist: 30 Tage ab Datum dieser Rechnung

Nach Ablauf der Zahlungsfrist wird ein Verzugszins von 4.5% pro Jahr erhoben.

IBAN: CH93 0070 0110 0012 3456 7
Zahlungsreferenz: 123 456 789 10

Rechtsmittelbelehrung:
Gegen diese Verfügung kann innert 30 Tagen schriftlich Rekurs erhoben werden.

Freundliche Grüsse
Kantonales Steueramt Zürich`,

  language: "de",
  confidence: 0.92,
  documentType: "tax",

  deadlines: [
    {
      description: "Payment due",
      date: "2026-02-14",
      urgencyLevel: "standard",
      consequenceHint: "Late payment interest of 4.5% per year will be charged",
    },
    {
      description: "Appeal deadline (Rekursfrist)",
      date: "2026-02-14",
      urgencyLevel: "standard",
      consequenceHint: "Assessment becomes final if no appeal is filed",
    },
  ],

  amounts: [
    {
      description: "Cantonal Tax (Staatssteuer)",
      amount: "2'847.00",
      amountNumeric: 2847.0,
      currency: "CHF",
    },
    {
      description: "Municipal Tax (Gemeindesteuer)",
      amount: "1'185.00",
      amountNumeric: 1185.0,
      currency: "CHF",
    },
    {
      description: "Federal Tax (Bundessteuer)",
      amount: "500.00",
      amountNumeric: 500.0,
      currency: "CHF",
    },
    {
      description: "Total Due",
      amount: "4'532.00",
      amountNumeric: 4532.0,
      currency: "CHF",
      paymentReference: "123 456 789 10",
    },
  ],

  references: [
    {
      type: "tax",
      value: "123.456.789.10",
      description: "Tax reference number",
    },
  ],

  senderAuthority: {
    level: "cantonal",
    name: "Kantonales Steueramt Zürich",
    canton: "ZH",
  },

  actionItems: [
    {
      action: "Pay tax bill of CHF 4,532.00",
      deadline: "2026-02-14",
      documents: ["IBAN: CH93 0070 0110 0012 3456 7"],
    },
    {
      action: "File appeal if disputing assessment",
      deadline: "2026-02-14",
      documents: ["Written appeal with grounds for objection"],
    },
  ],
};
