import type { Metadata } from "next";
import DeletePagesClient from "./DeletePagesClient";

export const metadata: Metadata = {
  title: "Delete PDF Pages – Remove Pages from PDF Online",
  description: "Remove specific pages from your PDF file for free. Select pages intuitively and get a new PDF instantly.",
  alternates: { canonical: "/delete-pages" },
};

export default function DeletePagesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/25 text-2xl text-white">
          🗑️
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Delete PDF Pages</h1>
        <p className="text-muted-foreground text-lg">
          Select the pages you want to remove and get a clean PDF document immediately.
        </p>
      </div>
      <DeletePagesClient />
    </div>
  );
}
