import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDocument } from "@/lib/actions/document";
import { DocumentViewer } from "@/components/features/documents/document-viewer";
import { DocumentMetadata } from "@/components/features/documents/document-metadata";
import { ProcessingState } from "@/components/features/documents/processing-state";
import { DocumentSummary } from "@/components/features/documents/document-summary";
import { ExtractedTextSection } from "@/components/features/documents/extracted-text-section";
import { TranslationTabs } from "@/components/features/documents/translation-tabs";

export const metadata: Metadata = {
  title: "Document Details - BriefBot",
  description: "View document details, extracted text, and translation",
};

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;

  const result = await getDocument(id);

  if (!result.success) {
    notFound();
  }

  const { document } = result;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-4 min-h-[44px]">
            <Link href="/documents">&larr; Back to documents</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {document.originalName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Document ID: {document.id}
          </p>
        </div>

        {/* Document Viewer */}
        <Card className="mb-6">
          <CardContent className="p-0 pt-0">
            <DocumentViewer
              signedUrl={document.signedUrl}
              mimeType={document.mimeType}
              originalName={document.originalName}
            />
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <DocumentMetadata
              sizeBytes={document.sizeBytes}
              createdAt={document.createdAt}
              status={document.status}
              documentType={document.documentType}
              originalName={document.originalName}
              mimeType={document.mimeType}
            />
          </CardContent>
        </Card>

        {/* Processing States (PENDING, PROCESSING, FAILED) */}
        {document.status !== "COMPLETED" && (
          <ProcessingState
            status={document.status}
            errorMessage={document.errorMessage}
            className="mb-6"
          />
        )}

        {/* Completed State: Summary, Text, Translations */}
        {document.status === "COMPLETED" && (
          <div className="space-y-6">
            {/* Document Summary (AI-extracted deadlines, actions, amounts) */}
            <DocumentSummary />

            {/* Extracted Text */}
            {document.extractedText && (
              <ExtractedTextSection
                text={document.extractedText}
                language={document.language}
                confidence={document.confidence}
              />
            )}

            {/* Translations */}
            <TranslationTabs translations={document.translations} />
          </div>
        )}
      </div>
    </div>
  );
}
