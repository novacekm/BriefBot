"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { minioStorage } from "@/lib/storage";

/** Document with translations and signed URL for display */
export interface DocumentWithUrl {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  language: string | null;
  extractedText: string | null;
  confidence: number | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  documentType: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  translations: {
    id: string;
    targetLanguage: string;
    translatedText: string;
  }[];
  signedUrl: string;
}

export type GetDocumentResult =
  | { success: true; document: DocumentWithUrl }
  | { success: false; error: "unauthorized" | "not_found" };

/**
 * Fetch a document with its translations and a signed URL for viewing
 * Returns not_found for both missing documents AND documents belonging to other users
 * to prevent document ID enumeration
 *
 * @param documentId - The document ID to fetch
 * @returns Document with signed URL on success, error on failure
 */
export async function getDocument(documentId: string): Promise<GetDocumentResult> {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "unauthorized" };
  }

  try {
    // Fetch document with translations
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        translations: {
          select: {
            id: true,
            targetLanguage: true,
            translatedText: true,
          },
        },
      },
    });

    // Return not_found for missing OR other user's documents
    // This prevents enumeration attacks
    if (!document || document.userId !== session.user.id) {
      return { success: false, error: "not_found" };
    }

    // Generate signed URL for document access
    const signedUrl = await minioStorage.getSignedUrl(document.storageKey);

    return {
      success: true,
      document: {
        id: document.id,
        originalName: document.originalName,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
        storageKey: document.storageKey,
        language: document.language,
        extractedText: document.extractedText,
        confidence: document.confidence,
        status: document.status,
        documentType: document.documentType,
        errorMessage: document.errorMessage,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        translations: document.translations,
        signedUrl,
      },
    };
  } catch (error) {
    console.error("Failed to fetch document:", error);
    return { success: false, error: "not_found" };
  }
}
