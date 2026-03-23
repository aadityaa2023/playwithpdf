import type { Metadata } from "next";
import RotatePDFClient from "./RotatePDFClient";

export const metadata: Metadata = {
  title: "Rotate PDF – Flip PDF Pages Online",
  description: "Rotate your PDF pages 90 or 180 degrees permanently for free.",
  alternates: { canonical: "/rotate-pdf" },
};

export default function RotatePDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-500/25 text-2xl">
          🔄
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Rotate PDF</h1>
        <p className="text-muted-foreground text-lg">
          Rotate all pages in your PDF document permanently.
        </p>
      </div>
      <RotatePDFClient />
    </div>
  );
}
