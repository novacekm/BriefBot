import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DocumentNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <circle cx="10" cy="13" r="2" />
              <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
            </svg>
          </div>
          <CardTitle as="h1">Document Not Found</CardTitle>
          <CardDescription className="mt-2">
            The document you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This could happen if the document was deleted, or if the link you
            followed is incorrect.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild className="min-h-[44px]">
            <Link href="/documents">Back to Documents</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
