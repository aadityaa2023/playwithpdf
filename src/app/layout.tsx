import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docuflow.app"),
  title: {
    default: "DocuFlow – Free Online PDF & Document Editor",
    template: "%s | DocuFlow",
  },
  description:
    "Free online tools to edit, merge, split, compress, convert and manage PDF & Word documents. No signup required. Fast, secure, and easy to use.",
  keywords: [
    "pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "word to pdf",
    "pdf to jpg",
    "free pdf tools",
    "online pdf editor",
    "pdf converter",
  ],
  authors: [{ name: "DocuFlow" }],
  creator: "DocuFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://docuflow.app",
    siteName: "DocuFlow",
    title: "DocuFlow – Free Online PDF & Document Editor",
    description:
      "Free online tools to edit, merge, split, compress, and convert PDF documents. No signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocuFlow - Free PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuFlow – Free Online PDF & Document Editor",
    description: "Free online PDF and document tools. Merge, split, compress, convert and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
