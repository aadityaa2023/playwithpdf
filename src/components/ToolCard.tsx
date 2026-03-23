import Link from "next/link";
import { type Tool } from "@/lib/tools-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
}

export default function ToolCard({ tool, compact = false }: ToolCardProps) {
  return (
    <Link href={`/${tool.slug}`} aria-label={`Open ${tool.name} tool`}>
      <article
        className={cn(
          "group relative bg-card border border-border rounded-2xl overflow-hidden card-hover cursor-pointer",
          compact ? "p-4" : "p-5"
        )}
      >
        {/* Gradient accent top bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
        />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              `rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0`,
              compact ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"
            )}
          >
            {tool.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1",
                compact ? "text-sm" : "text-base"
              )}
            >
              {tool.name}
            </h3>
            <p
              className={cn(
                "text-muted-foreground mt-0.5 line-clamp-2",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {compact ? tool.shortDesc : tool.description}
            </p>
          </div>

          {/* Arrow */}
          <ArrowRight
            className={cn(
              "flex-shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all",
              compact ? "w-4 h-4" : "w-5 h-5"
            )}
          />
        </div>
      </article>
    </Link>
  );
}
