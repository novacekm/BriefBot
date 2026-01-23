/**
 * Italian Permit Renewal Sample (Permesso di soggiorno Ticino)
 * Realistic mock OCR result for Swiss residence permit renewal
 */

import type { OCRResult } from "../types";

export const italianPermitSample: OCRResult = {
  text: `Repubblica e Cantone Ticino
Sezione della popolazione
Ufficio della migrazione
Via Lugano 4, 6500 Bellinzona

Bellinzona, 5 gennaio 2026
Rif.: PM-TI-2026-12345

Oggetto: Rinnovo permesso di dimora B

Gentile Signora/Egregio Signore,

Con riferimento alla Sua domanda di rinnovo del permesso di dimora B,
La informiamo che la validità del Suo attuale permesso scade il:

Data di scadenza: 31 marzo 2026

Per procedere al rinnovo, La preghiamo di presentare i seguenti documenti
entro il 28 febbraio 2026:

1. Formulario di domanda compilato
2. Passaporto in corso di validità (originale + copia)
3. Foto formato passaporto recente
4. Attestazione del datore di lavoro
5. Estratto conto AVS degli ultimi 12 mesi
6. Certificato di non perseguimento penale

Tassa di rinnovo                           CHF    140.00
Tassa amministrativa                       CHF     25.00
-------------------------------------------------------
Totale                                     CHF    165.00

IBAN: CH56 0024 0024 1234 5678 9
Riferimento: PM-TI-2026-12345

Requisiti di integrazione:
- Conoscenza della lingua italiana livello A2 (parlato)
- Rispetto dell'ordine pubblico

In caso di mancato rinnovo entro i termini, il permesso decadrà
automaticamente.

Distinti saluti,
Sezione della popolazione`,

  language: "it",
  confidence: 0.88,
  documentType: "permit",

  deadlines: [
    {
      description: "Document submission deadline",
      date: "2026-02-28",
      urgencyLevel: "critical",
      consequenceHint: "Permit will automatically expire if not renewed",
    },
    {
      description: "Permit expiry date",
      date: "2026-03-31",
      urgencyLevel: "critical",
      consequenceHint: "Cannot legally stay/work in Switzerland after expiry",
    },
  ],

  amounts: [
    {
      description: "Renewal Fee (Tassa di rinnovo)",
      amount: "140.00",
      amountNumeric: 140.0,
      currency: "CHF",
    },
    {
      description: "Administrative Fee (Tassa amministrativa)",
      amount: "25.00",
      amountNumeric: 25.0,
      currency: "CHF",
    },
    {
      description: "Total Due",
      amount: "165.00",
      amountNumeric: 165.0,
      currency: "CHF",
      paymentReference: "PM-TI-2026-12345",
    },
  ],

  references: [
    {
      type: "permit",
      value: "PM-TI-2026-12345",
      description: "Permit reference number",
    },
  ],

  senderAuthority: {
    level: "cantonal",
    name: "Sezione della popolazione - Ufficio della migrazione",
    canton: "TI",
  },

  actionItems: [
    {
      action: "Submit renewal application with required documents",
      deadline: "2026-02-28",
      documents: [
        "Completed application form",
        "Valid passport (original + copy)",
        "Recent passport photo",
        "Employer attestation",
        "AVS account statement (12 months)",
        "Certificate of no criminal prosecution",
      ],
    },
    {
      action: "Pay renewal fees of CHF 165.00",
      documents: ["IBAN: CH56 0024 0024 1234 5678 9"],
    },
    {
      action: "Ensure Italian language level A2 (spoken)",
    },
  ],
};
