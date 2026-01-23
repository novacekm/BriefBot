"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { minioStorage } from "@/lib/storage";
import { mockOCRService } from "@/lib/ai/ocr";

export type ProcessDocumentResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Process a document with OCR to extract text and structured data
 *
 * @param documentId - The document ID to process
 * @returns Success or error result
 */
export async function processDocument(
  documentId: string
): Promise<ProcessDocumentResult> {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Fetch document and verify ownership
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.userId !== session.user.id) {
      return { success: false, error: "Document not found" };
    }

    // Only process documents in PENDING status
    if (document.status !== "PENDING") {
      return {
        success: false,
        error: `Document is already ${document.status.toLowerCase()}`,
      };
    }

    // Update status to PROCESSING
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "PROCESSING",
        processingStartedAt: new Date(),
      },
    });

    try {
      // Download file from storage
      const fileBuffer = await minioStorage.download(document.storageKey);

      // Run OCR extraction
      const result = await mockOCRService.extractText(
        fileBuffer,
        document.mimeType,
        document.originalName
      );

      // Prepare metadata JSON
      const metadata = JSON.stringify({
        deadlines: result.deadlines || [],
        amounts: result.amounts || [],
        references: result.references || [],
        actionItems: result.actionItems || [],
        senderAuthority: result.senderAuthority || null,
      });

      // Update document with extracted data
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "COMPLETED",
          extractedText: result.text,
          language: result.language,
          confidence: result.confidence,
          documentType: result.documentType || null,
          metadata,
          processingCompletedAt: new Date(),
          errorMessage: null,
        },
      });

      // Revalidate the document detail page
      revalidatePath(`/documents/${documentId}`);

      return { success: true };
    } catch (processingError) {
      // OCR processing failed - update status to FAILED
      const errorMessage =
        processingError instanceof Error
          ? processingError.message
          : "OCR processing failed";

      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "FAILED",
          errorMessage,
          processingCompletedAt: new Date(),
        },
      });

      // Revalidate the document detail page
      revalidatePath(`/documents/${documentId}`);

      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error("Failed to process document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Processing failed",
    };
  }
}
