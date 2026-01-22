import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Document - BriefBot",
  description: "Upload a document to extract text and translate",
};

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle as="h1">Upload Document</CardTitle>
          <CardDescription>
            Upload a photo or scan of your Swiss official document to get
            started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
            <p className="text-sm text-muted-foreground">
              Upload functionality coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
