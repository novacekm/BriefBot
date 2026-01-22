import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  DocumentCard,
  DocumentsEmptyState,
} from "@/components/features/documents";

export const metadata: Metadata = {
  title: "My Documents - BriefBot",
  description: "View and manage your uploaded documents",
};

export default async function DocumentsPage() {
  const session = await auth();

  const documents = await prisma.document.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      originalName: true,
      mimeType: true,
      status: true,
      createdAt: true,
    },
  });

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

        {documents.length === 0 ? (
          <DocumentsEmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
