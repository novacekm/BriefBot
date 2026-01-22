"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DocumentViewerProps {
  /** Signed URL for the document */
  signedUrl: string;
  /** MIME type of the document */
  mimeType: string;
  /** Original filename for alt text and download */
  originalName: string;
  className?: string;
}

export function DocumentViewer({
  signedUrl,
  mimeType,
  originalName,
  className,
}: DocumentViewerProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && isZoomOpen) {
        setIsZoomOpen(false);
      }
    },
    [isZoomOpen]
  );

  const handleImageClick = useCallback(() => {
    if (!imageError) {
      setIsZoomOpen(true);
    }
  }, [imageError]);

  const handleCloseZoom = useCallback(() => {
    setIsZoomOpen(false);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Document Preview */}
      <div className="relative overflow-hidden rounded-lg border bg-muted/50">
        {isImage && (
          <button
            onClick={handleImageClick}
            onKeyDown={handleKeyDown}
            disabled={imageError}
            className={cn(
              "relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !imageError && "cursor-zoom-in"
            )}
            aria-label={imageError ? "Image failed to load" : "Click to zoom image"}
          >
            {imageError ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <span>Failed to load image</span>
              </div>
            ) : (
              <div className="relative h-64 w-full sm:h-80 md:h-96">
                <Image
                  src={signedUrl}
                  alt={`Document: ${originalName}`}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}
          </button>
        )}

        {isPdf && (
          <div className="h-[400px] w-full sm:h-[500px] md:h-[600px]">
            <iframe
              src={`${signedUrl}#toolbar=1&navpanes=0`}
              className="h-full w-full rounded-lg"
              title={`PDF Document: ${originalName}`}
            >
              <p className="p-4 text-sm text-muted-foreground">
                Your browser does not support PDF viewing.
                <a
                  href={signedUrl}
                  download={originalName}
                  className="ml-1 text-primary underline"
                >
                  Download the PDF
                </a>
              </p>
            </iframe>
          </div>
        )}

        {!isImage && !isPdf && (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <span>Preview not available for this file type</span>
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          asChild
          className="min-h-[44px]"
        >
          <a href={signedUrl} download={originalName}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Download
          </a>
        </Button>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleCloseZoom}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed document view"
        >
          <button
            onClick={handleCloseZoom}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close zoom view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={signedUrl}
              alt={`Document: ${originalName}`}
              width={1200}
              height={1600}
              className="max-h-[90vh] w-auto object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
