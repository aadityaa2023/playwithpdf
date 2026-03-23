import type { Metadata } from "next";
import CompressPDFClient from "./CompressPDFClient";

export const metadata: Metadata = {
  title: "Compress PDF – Reduce PDF File Size Online Free",
  description:
    "Compress and reduce PDF file size online for free. Choose compression level. No signup, no file upload to servers, 100% private.",
  keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "optimize pdf"],
  alternates: { canonical: "/compress-pdf" },
};

export default function CompressPDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/25 text-2xl">
          🗜️
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Compress PDF</h1>
        <p className="text-muted-foreground text-lg">
          Reduce your PDF file size while maintaining the best possible quality.
        </p>
      </div>
      <CompressPDFClient />
      <section className="mt-14 space-y-4">
        <h2 className="text-xl font-bold">How to compress a PDF</h2>
        <ol className="space-y-3">
          {[
            "Upload your PDF using the drop zone above",
            "Choose your preferred compression level",
            "Click 'Compress PDF' to process",
            "See the file size savings and download",
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
            name: "Compress PDF",
            applicationCategory: "UtilitiesApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
