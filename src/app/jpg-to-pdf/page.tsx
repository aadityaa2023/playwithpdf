import type { Metadata } from "next";
import JPGtoPDFClient from "./JPGtoPDFClient";

export const metadata: Metadata = {
  title: "JPG to PDF – Convert Images to PDF Online",
  description: "Convert JPG and PNG images to a PDF document online. Free, fast and private.",
  alternates: { canonical: "/jpg-to-pdf" },
};

export default function JPGtoPDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-fuchsia-500/25 text-2xl">
          📸
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">JPG to PDF</h1>
        <p className="text-muted-foreground text-lg">
          Convert multiple images to a single PDF document in seconds.
        </p>
      </div>
      <JPGtoPDFClient />
    </div>
  );
}
