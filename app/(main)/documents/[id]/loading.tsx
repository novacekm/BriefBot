import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DocumentDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back button skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-9 w-40 animate-pulse rounded bg-muted" />
          {/* Title skeleton */}
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-48 animate-pulse rounded bg-muted" />
        </div>

        {/* Document viewer skeleton */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div
              className="h-64 w-full animate-pulse rounded-t-xl bg-muted sm:h-80 md:h-96"
              role="status"
              aria-label="Loading document preview"
            />
            <div className="flex justify-end p-4">
              <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Metadata skeleton */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-5 w-24 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content section skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
          </CardContent>
        </Card>

        {/* Translations skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-4 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-20 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
            <div className="h-32 w-full animate-pulse rounded-lg bg-muted" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
