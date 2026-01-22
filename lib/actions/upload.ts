"use server";

import { randomUUID } from "crypto";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { minioStorage } from "@/lib/storage";
import { uploadFileSchema } from "@/lib/validations/document";

export type UploadResult =
  | { success: true; documentId: string }
  | { success: false; error: string };

/**
 * Sanitize filename for storage key
 * Removes unsafe characters, preserves extension
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Upload a document file to storage and create a database record
 *
 * @param formData - FormData containing the file under key "file"
 * @returns Upload result with documentId on success, error message on failure
 */
export async function uploadDocument(formData: FormData): Promise<UploadResult> {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" };
  }

  // Extract and validate file
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  const validation = uploadFileSchema.safeParse({ file });
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || "Invalid file";
    return { success: false, error: errorMessage };
  }

  // Generate IDs and storage key
  const documentId = randomUUID();
  const sanitizedName = sanitizeFilename(file.name);
  const storageKey = `${session.user.id}/${documentId}/${sanitizedName}`;

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to MinIO
    await minioStorage.upload(buffer, storageKey, file.type);

    // Create database record
    await prisma.document.create({
      data: {
        id: documentId,
        userId: session.user.id,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey,
        status: "PENDING",
      },
    });

    return { success: true, documentId };
  } catch (error) {
    // Attempt cleanup on failure
    try {
      await minioStorage.delete(storageKey);
    } catch {
      // Ignore cleanup errors
    }

    console.error("Upload failed:", error);
    return { success: false, error: "Upload failed. Please try again." };
  }
}
