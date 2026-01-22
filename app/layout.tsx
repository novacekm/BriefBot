import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";
import { auth } from "@/lib/auth/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BriefBot - Swiss Document OCR",
  description: "Privacy-first OCR utility for Swiss residents to decode official mail",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <Header user={session?.user} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
