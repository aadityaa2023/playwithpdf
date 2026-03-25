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
          "group relative bg-white border border-[#E5E5E5] rounded-xl overflow-hidden hover:bg-[#F9F9F9] hover:border-[#2BB3A3] transition-colors cursor-pointer shadow-none",
          compact ? "p-4" : "p-5"
        )}
      >
        {/* Accent top bar removed for flatter design */}

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "rounded-xl bg-[#EBF8F7] flex items-center justify-center text-[#2BB3A3] shadow-none flex-shrink-0 group-hover:scale-105 transition-transform",
              compact ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"
            )}
          >
            {tool.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-bold text-[#333333] group-hover:text-[#2BB3A3] transition-colors line-clamp-1",
                compact ? "text-sm" : "text-base"
              )}
            >
              {tool.name}
            </h3>
            <p
              className={cn(
                "text-[#666666] mt-1 line-clamp-2 leading-relaxed",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {compact ? tool.shortDesc : tool.description}
            </p>
          </div>

          {/* Arrow */}
          <ArrowRight
            className={cn(
              "flex-shrink-0 text-[#E5E5E5] group-hover:text-[#2BB3A3] group-hover:translate-x-1 transition-all mt-1",
              compact ? "w-4 h-4" : "w-5 h-5"
            )}
          />
        </div>
      </article>
    </Link>
  );
}
