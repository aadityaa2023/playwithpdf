import type { Metadata } from "next";
import { Layers } from "lucide-react";
import MergePDFClient from "./MergePDFClient";

export const metadata: Metadata = {
  title: "Merge PDF – Combine PDF Files Online for Free",
  description:
    "Merge multiple PDF files into one document online for free. Easy drag-and-drop interface. No signup, no watermark, instant results.",
  keywords: ["merge pdf", "combine pdf", "join pdf files", "merge pdf online free"],
  alternates: { canonical: "/merge-pdf" },
  openGraph: {
    title: "Merge PDF – Combine PDF Files Online for Free",
    description: "Combine multiple PDF files into one. Free, instant, private.",
  },
};

export default function MergePDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 text-2xl">
          🔗
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Merge PDF</h1>
        <p className="text-muted-foreground text-lg">
          Combine multiple PDFs and images into one document. Drag to reorder before merging.
        </p>
      </div>

      {/* Tool */}
      <MergePDFClient />

      {/* How it works */}
      <section className="mt-14 space-y-4">
        <h2 className="text-xl font-bold">How to merge PDFs</h2>
        <ol className="space-y-3">
          {[
            "Upload two or more PDF files using the drop zone above",
            "Reorder them if needed by removing and re-adding",
            "Click 'Merge PDFs' to combine them into one file",
            "Download your merged PDF instantly",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Merge PDF",
            applicationCategory: "UtilitiesApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Combine multiple PDF files into one document online for free.",
          }),
        }}
      />
    </div>
  );
}
