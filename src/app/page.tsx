import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ToolCard from "@/components/ToolCard";
import { tools, categories, getToolsByCategory, popularTools } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "DocuFlow – Free Online PDF & Document Editor",
  description:
    "Merge, split, compress, rotate, convert and edit PDF files online for free. No signup required. Fast, secure browser-based PDF tools.",
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "Files are processed entirely in your browser. Nothing is uploaded to our servers.",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Client-side processing means instant results with no upload wait times.",
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Globe,
    title: "Always Free",
    description: "All core tools are completely free. No hidden charges, no subscriptions.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Badge variant="secondary" className="mb-5 gap-1.5 py-1 px-3 text-xs font-medium">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            100% Free — No Signup Required
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Edit Documents{" "}
            <span className="text-gradient">Effortlessly</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Merge, split, compress, convert and edit PDFs in seconds. All processing happens in your
            browser — your files stay private, always.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/pdf-editor">
              <Button size="lg" className="gap-2 text-base h-12 px-6 shadow-lg shadow-primary/25">
                Start Editing Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base h-12 px-6"
              >
                Browse All Tools
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No file upload", "No registration", "Unlimited usage", "Bank-level security"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Most Popular Tools</h2>
            <p className="text-muted-foreground">The tools our users reach for most</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why DocuFlow?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We built the tools we wished existed — fast, private, and genuinely free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 text-center card-hover"
                >
                  <div
                    className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-16 md:py-20 bg-muted/30" id="all-tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">All PDF Tools</h2>
            <p className="text-muted-foreground">Everything you need to work with documents</p>
          </div>

          <div className="space-y-12">
            {categories
              .filter((cat) => cat.slug !== "popular")
              .map((cat) => {
                const catTools = getToolsByCategory(cat.slug);
                if (catTools.length === 0) return null;
                return (
                  <div key={cat.slug}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {catTools.length} tool{catTools.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {catTools.map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} compact />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-10 md:p-14 overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Work Smarter?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of professionals who use DocuFlow every day to manage their documents.
              </p>
              <Link href="/tools">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base h-12 px-8 shadow-lg"
                >
                  Browse All Tools <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "DocuFlow",
            url: "https://docuflow.app",
            description:
              "Free online PDF and document editing tools. Merge, split, compress, convert PDFs in your browser.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </>
  );
}
