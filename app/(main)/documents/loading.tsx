import { Card, CardContent } from "@/components/ui/card";

function DocumentCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      </CardContent>
    </Card>
  );
}

export default function DocumentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
        </div>
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="status"
          aria-label="Loading documents"
        >
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
        </div>
      </div>
    </div>
  );
}
