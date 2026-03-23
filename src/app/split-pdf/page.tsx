import type { Metadata } from "next";
import SplitPDFClient from "./SplitPDFClient";

export const metadata: Metadata = {
  title: "Split PDF – Split PDF Files Online for Free",
  description:
    "Split a PDF into multiple files online. Split by page ranges or extract every page separately. Free, instant, no signup required.",
  keywords: ["split pdf", "divide pdf", "separate pdf pages", "pdf splitter"],
  alternates: { canonical: "/split-pdf" },
};

export default function SplitPDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/25 text-2xl">
          ✂️
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Split PDF</h1>
        <p className="text-muted-foreground text-lg">
          Split your PDF by page range or extract every page into a separate file.
        </p>
      </div>
      <SplitPDFClient />
      <section className="mt-14 space-y-4">
        <h2 className="text-xl font-bold">How to split a PDF</h2>
        <ol className="space-y-3">
          {[
            "Upload your PDF file using the drop zone above",
            "Optionally specify page ranges (e.g. 1-3, 4-6)",
            "Leave blank to split every page into individual files",
            "Click 'Split PDF' and download your files",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Split PDF",
            applicationCategory: "UtilitiesApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
