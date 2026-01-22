"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadZone } from "@/components/features/upload";
import { uploadDocument } from "@/lib/actions/upload";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadDocument(formData);

    if (result.success) {
      router.push(`/documents/${result.documentId}`);
    } else {
      setError(result.error);
      setIsUploading(false);
    }
  };

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
          <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
