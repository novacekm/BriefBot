import type { DocumentStatus } from "@/app/generated/prisma";
import { StatusBadge } from "./status-badge";
import { DocumentTypeBadge } from "./document-type-badge";

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * Format date in Swiss format (dd.mm.yyyy)
 * Handles both Date objects and ISO date strings
 */
function formatSwissDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

export interface DocumentMetadataProps {
  /** File size in bytes */
  sizeBytes: number;
  /** Date when the document was uploaded (Date object or ISO string) */
  createdAt: Date | string;
  /** Processing status */
  status: DocumentStatus;
  /** Document type classification */
  documentType: string | null;
  /** Original filename */
  originalName: string;
  /** MIME type */
  mimeType: string;
  className?: string;
}

export function DocumentMetadata({
  sizeBytes,
  createdAt,
  status,
  documentType,
  originalName,
  mimeType,
  className,
}: DocumentMetadataProps) {
  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 md:grid-cols-4">
        <div>
          <dt className="font-medium text-muted-foreground">Filename</dt>
          <dd className="mt-1 truncate" title={originalName}>
            {originalName}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Size</dt>
          <dd className="mt-1">{formatFileSize(sizeBytes)}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Uploaded</dt>
          <dd className="mt-1">{formatSwissDate(createdAt)}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Type</dt>
          <dd className="mt-1">
            {mimeType.startsWith("image/") ? "Image" : "PDF"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Status</dt>
          <dd className="mt-1">
            <StatusBadge status={status} />
          </dd>
        </div>
        {documentType && (
          <div>
            <dt className="font-medium text-muted-foreground">Category</dt>
            <dd className="mt-1">
              <DocumentTypeBadge type={documentType} />
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
