import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 py-12 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Decode Swiss Official Mail
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-lg">
          Privacy-first OCR utility for Swiss residents. Understand official
          correspondence in German, French, and Italian.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/upload">Upload Document</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/documents">View Documents</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          How It Works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Upload</CardTitle>
              <CardDescription>
                Take a photo or upload a scan of your official letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supports JPEG, PNG, WebP, and PDF formats up to 10MB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Process</CardTitle>
              <CardDescription>
                AI extracts and translates the text automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Powered by GPT-4 Vision for accurate OCR results
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Understand</CardTitle>
              <CardDescription>
                Read the content in your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get clear explanations of official terminology
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Your documents are processed securely and deleted after 30 days.
          <br />
          Compliant with Swiss nFADP data protection regulations.
        </p>
      </section>
    </div>
  );
}
