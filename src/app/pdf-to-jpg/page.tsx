import type { Metadata } from "next";
import PDFtoJPGClient from "./PDFtoJPGClient";

export const metadata: Metadata = {
  title: "PDF to JPG – Convert PDF Pages to Images",
  description: "Extract high-quality JPG images from your PDF files online for free. Secure, fast, no uploads.",
  alternates: { canonical: "/pdf-to-jpg" },
};

export default function PDFtoJPGPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-pink-500/25 text-2xl">
          🖼️
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">PDF to JPG</h1>
        <p className="text-muted-foreground text-lg">
          Convert each page of your PDF document into high-resolution JPG images.
        </p>
      </div>
      <PDFtoJPGClient />
    </div>
  );
}
