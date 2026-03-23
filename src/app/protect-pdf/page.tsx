import type { Metadata } from "next";
import ProtectPDFClient from "./ProtectPDFClient";

export const metadata: Metadata = {
  title: "Protect PDF – Add Password to PDF Online",
  description: "Add a password to your PDF file to prevent unauthorized access. Free, secure, client-side encryption.",
  alternates: { canonical: "/protect-pdf" },
};

export default function ProtectPDFPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-800 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-slate-500/25 text-2xl">
          🔒
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Protect PDF</h1>
        <p className="text-muted-foreground text-lg">
          Secure your PDF document with a strong password.
        </p>
      </div>
      <ProtectPDFClient />
    </div>
  );
}
