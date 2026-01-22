import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/documents">&larr; Back to documents</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Document Details
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Document ID: {id}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Document Preview</CardTitle>
            <CardDescription>
              View the original document, extracted text, and translation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Document detail view coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
