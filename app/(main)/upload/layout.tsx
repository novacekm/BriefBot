import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Document - BriefBot",
  description: "Upload a document to extract text and translate",
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
