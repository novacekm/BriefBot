import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Documents - BriefBot",
  description: "View and manage your uploaded documents",
};

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            My Documents
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your uploaded documents.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle as="h2">No documents yet</CardTitle>
            <CardDescription>
              Upload your first document to get started with translation and
              analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Document list coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
