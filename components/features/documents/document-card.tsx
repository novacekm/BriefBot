import Link from "next/link";
import { FileImage, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import type { DocumentStatus } from "@/app/generated/prisma";

export interface DocumentCardProps {
  document: {
    id: string;
    originalName: string;
    mimeType: string;
    status: DocumentStatus;
    createdAt: Date;
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getFileIcon(mimeType: string) {
  if (mimeType === "application/pdf") {
    return FileText;
  }
  return FileImage;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const Icon = getFileIcon(document.mimeType);

  return (
    <Link href={`/documents/${document.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{document.originalName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(document.createdAt)}
            </p>
          </div>
          <StatusBadge status={document.status} />
        </CardContent>
      </Card>
    </Link>
  );
}
