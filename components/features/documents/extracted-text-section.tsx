"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { cn } from "@/lib/utils";

const languageLabels: Record<string, string> = {
  de: "German",
  fr: "French",
  it: "Italian",
  unknown: "Unknown",
};

export interface ExtractedTextSectionProps {
  /** The extracted text content */
  text: string;
  /** Detected language code */
  language: string | null;
  /** Confidence score (0-1) */
  confidence: number | null;
  className?: string;
}

export function ExtractedTextSection({
  text,
  language,
  confidence,
  className,
}: ExtractedTextSectionProps) {
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = async () => {
    await copyToClipboard(text);
  };

  const languageLabel = language ? languageLabels[language] || language : "Unknown";
  const confidencePercent = confidence !== null ? Math.round(confidence * 100) : null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle as="h2" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                  clipRule="evenodd"
                />
              </svg>
              Extracted Text
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
              >
                {languageLabel}
              </span>
              {confidencePercent !== null && (
                <span className="text-xs">
                  {confidencePercent}% confidence
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="min-h-[36px] min-w-[90px]"
            aria-label={copied ? "Copied to clipboard" : "Copy text to clipboard"}
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1.5 h-4 w-4 text-green-600"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1.5 h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "max-h-80 overflow-auto rounded-lg bg-muted/50 p-4",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20"
          )}
        >
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">
            {text}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
