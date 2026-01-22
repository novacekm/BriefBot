import { describe, it, expect } from "vitest";
import {
  uploadFileSchema,
  uploadBufferSchema,
  UPLOAD_CONSTRAINTS,
} from "@/lib/validations/document";

describe("uploadFileSchema", () => {
  it("should accept valid JPEG file", () => {
    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(true);
  });

  it("should accept valid PNG file", () => {
    const file = new File(["test content"], "test.png", { type: "image/png" });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(true);
  });

  it("should accept valid WebP file", () => {
    const file = new File(["test content"], "test.webp", {
      type: "image/webp",
    });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(true);
  });

  it("should accept valid PDF file", () => {
    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(true);
  });

  it("should reject empty file", () => {
    const file = new File([], "empty.jpg", { type: "image/jpeg" });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("empty");
    }
  });

  it("should reject file exceeding max size", () => {
    // Create a file that's larger than 10MB
    const largeContent = new Array(11 * 1024 * 1024).fill("a").join("");
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("10MB");
    }
  });

  it("should reject unsupported file type", () => {
    const file = new File(["test"], "test.exe", {
      type: "application/octet-stream",
    });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("not supported");
    }
  });

  it("should reject text file", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const result = uploadFileSchema.safeParse({ file });
    expect(result.success).toBe(false);
  });

  it("should reject when file is missing", () => {
    const result = uploadFileSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should reject when file is null", () => {
    const result = uploadFileSchema.safeParse({ file: null });
    expect(result.success).toBe(false);
  });
});

describe("uploadBufferSchema", () => {
  it("should accept valid buffer with JPEG mime type", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test content"),
      filename: "test.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 12,
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid buffer with PNG mime type", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test content"),
      filename: "test.png",
      mimeType: "image/png",
      sizeBytes: 12,
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid buffer with PDF mime type", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test content"),
      filename: "test.pdf",
      mimeType: "application/pdf",
      sizeBytes: 12,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty buffer", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from(""),
      filename: "test.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject buffer exceeding max size", () => {
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
    const result = uploadBufferSchema.safeParse({
      buffer: largeBuffer,
      filename: "large.jpg",
      mimeType: "image/jpeg",
      sizeBytes: largeBuffer.length,
    });
    expect(result.success).toBe(false);
  });

  it("should reject unsupported mime type", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test"),
      filename: "test.exe",
      mimeType: "application/octet-stream",
      sizeBytes: 4,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("not supported");
    }
  });

  it("should reject empty filename", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test"),
      filename: "",
      mimeType: "image/jpeg",
      sizeBytes: 4,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative size", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test"),
      filename: "test.jpg",
      mimeType: "image/jpeg",
      sizeBytes: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject size exceeding max", () => {
    const result = uploadBufferSchema.safeParse({
      buffer: Buffer.from("test"),
      filename: "test.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 11 * 1024 * 1024,
    });
    expect(result.success).toBe(false);
  });
});

describe("UPLOAD_CONSTRAINTS", () => {
  it("should have correct max file size in bytes", () => {
    expect(UPLOAD_CONSTRAINTS.maxFileSize).toBe(10 * 1024 * 1024);
  });

  it("should have correct max file size in MB", () => {
    expect(UPLOAD_CONSTRAINTS.maxFileSizeMB).toBe(10);
  });

  it("should have correct allowed mime types", () => {
    expect(UPLOAD_CONSTRAINTS.allowedMimeTypes).toContain("image/jpeg");
    expect(UPLOAD_CONSTRAINTS.allowedMimeTypes).toContain("image/png");
    expect(UPLOAD_CONSTRAINTS.allowedMimeTypes).toContain("image/webp");
    expect(UPLOAD_CONSTRAINTS.allowedMimeTypes).toContain("application/pdf");
    expect(UPLOAD_CONSTRAINTS.allowedMimeTypes).toHaveLength(4);
  });

  it("should have human-readable file types display", () => {
    expect(UPLOAD_CONSTRAINTS.allowedFileTypesDisplay).toContain("JPEG");
    expect(UPLOAD_CONSTRAINTS.allowedFileTypesDisplay).toContain("PNG");
    expect(UPLOAD_CONSTRAINTS.allowedFileTypesDisplay).toContain("WebP");
    expect(UPLOAD_CONSTRAINTS.allowedFileTypesDisplay).toContain("PDF");
  });
});
