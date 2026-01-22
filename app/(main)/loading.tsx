import { Card, CardContent } from "@/components/ui/card";

export default function MainLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"
            role="status"
            aria-label="Loading"
          />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
