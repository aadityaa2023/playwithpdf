import type { Metadata } from "next";
import { tools, categories, getToolsByCategory } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "All PDF & Document Tools",
  description:
    "Browse all free online PDF tools: merge, split, compress, rotate, convert, watermark, protect and more. No signup needed.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">All PDF Tools</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          {tools.length} free tools to handle any document task — all running in your browser.
        </p>
      </div>

      {/* Tools by category */}
      <div className="space-y-12">
        {categories
          .filter((cat) => cat.slug !== "popular")
          .map((cat) => {
            const catTools = getToolsByCategory(cat.slug);
            if (catTools.length === 0) return null;
            return (
              <section key={cat.slug} id={cat.slug} aria-label={cat.name}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {catTools.length}
                  </Badge>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
}
