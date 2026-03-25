import type { Metadata } from "next";
import PdfEditorClient from "./PdfEditorClient";

export const metadata: Metadata = {
  title: "Sejda premium – Professional PDF Editor",
  description:
    "Edit PDF files online for free. Add text, drawings, highlights, shapes, images and annotations. Completely client-side — your files never leave your browser.",
  alternates: { canonical: "/pdf-editor" },
};

export default function PDFEditorPage() {
  return <PdfEditorClient />;
}
