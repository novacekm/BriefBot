import { z } from "zod";

/** Maximum file size: 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Allowed MIME types for document upload */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

/** Human-readable file type names for error messages */
const ALLOWED_FILE_TYPES_DISPLAY = "JPEG, PNG, WebP, or PDF";

/**
 * Schema for validating file uploads
 * Used in upload form and server action validation
 */
export const uploadFileSchema = z.object({
  file: z
    .instanceof(File, { message: "Please select a file to upload" })
    .refine(
      (file) => file.size > 0,
      "File is empty. Please select a valid file."
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    )
    .refine(
      (file) =>
        ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number]),
      `File type not supported. Please upload a ${ALLOWED_FILE_TYPES_DISPLAY} file.`
    ),
});

/**
 * Schema for server-side buffer validation
 * Used when processing uploaded files in server actions
 */
export const uploadBufferSchema = z.object({
  buffer: z.instanceof(Buffer).refine(
    (buf) => buf.length > 0 && buf.length <= MAX_FILE_SIZE,
    `File must be between 1 byte and ${MAX_FILE_SIZE / 1024 / 1024}MB`
  ),
  filename: z.string().min(1, "Filename is required"),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    message: `File type not supported. Allowed types: ${ALLOWED_FILE_TYPES_DISPLAY}`,
  }),
  sizeBytes: z
    .number()
    .positive("File size must be positive")
    .max(MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`),
});

/** Type for file upload input (client-side) */
export type UploadFileInput = z.infer<typeof uploadFileSchema>;

/** Type for buffer upload input (server-side) */
export type UploadBufferInput = z.infer<typeof uploadBufferSchema>;

/** Export constants for use in components */
export const UPLOAD_CONSTRAINTS = {
  maxFileSize: MAX_FILE_SIZE,
  maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
  allowedFileTypesDisplay: ALLOWED_FILE_TYPES_DISPLAY,
} as const;
