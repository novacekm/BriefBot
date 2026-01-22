"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileImage, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.pdf";

const DEFAULT_MAX_SIZE_MB = 10;

export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  disabled?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function UploadZone({
  onFileSelect,
  isUploading = false,
  disabled = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = ACCEPTED_TYPES,
}: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = useCallback(
    (selectedFile: File): string | null => {
      // Check file type
      if (!acceptedTypes.includes(selectedFile.type)) {
        return `Invalid file type. Accepted: JPEG, PNG, WebP, PDF`;
      }

      // Check file size
      if (selectedFile.size > maxSizeBytes) {
        return `File too large. Maximum size: ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSizeBytes, maxSizeMB]
  );

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setError(null);

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }

      onFileSelect(selectedFile);
    },
    [validateFile, onFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled || isUploading) return;

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragOver(true);
      }
    },
    [disabled, isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled && !isUploading) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled, isUploading]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview(null);
      setError(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [preview]
  );

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";
  const isDisabled = disabled || isUploading;

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={file ? `Selected file: ${file.name}` : "Upload zone"}
        aria-describedby={error ? "upload-error" : undefined}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          // Default state
          !error &&
            !isDragOver &&
            !file &&
            "border-muted-foreground/25 hover:border-muted-foreground/50",
          // Drag over state
          isDragOver && "border-primary bg-primary/5",
          // File selected state
          file && !error && "border-primary/50 bg-muted/50",
          // Error state
          error && "border-destructive bg-destructive/5",
          // Disabled state
          isDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          capture="environment"
          onChange={handleInputChange}
          disabled={isDisabled}
          className="sr-only"
          aria-hidden="true"
        />

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!file ? (
          // Default/drag state
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={cn(
                "rounded-full p-4",
                isDragOver ? "bg-primary/10" : "bg-muted"
              )}
            >
              <Upload
                className={cn(
                  "h-8 w-8",
                  isDragOver ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragOver ? "Drop file here" : "Drop file here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or PDF up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        ) : (
          // File selected state
          <div className="flex w-full items-center gap-4">
            {/* Preview */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
              {isImage && preview ? (
                <img
                  src={preview}
                  alt={`Preview of ${file.name}`}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : isPdf ? (
                <FileText className="h-8 w-8 text-muted-foreground" />
              ) : (
                <FileImage className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {/* File info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Remove button */}
            {!isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-10 w-10 flex-shrink-0"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id="upload-error"
          role="alert"
          className="mt-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
