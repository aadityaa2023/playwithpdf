"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Menu,
  X,
  ChevronDown,
  Layers,
  Scissors,
  Minimize2,
  Lock,
  RefreshCw,
  FileImage,
  FileOutput,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navCategories = [
  {
    label: "Merge & Organize",
    icon: Layers,
    color: "text-blue-500",
    items: [
      { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs" },
      { label: "Organize PDF", href: "/organize-pdf", desc: "Rearrange pages" },
    ],
  },
  {
    label: "Split & Extract",
    icon: Scissors,
    color: "text-orange-500",
    items: [
      { label: "Split PDF", href: "/split-pdf", desc: "Split by page ranges" },
      { label: "Extract Pages", href: "/extract-pages", desc: "Get specific pages" },
    ],
  },
  {
    label: "Edit & Sign",
    icon: FileText,
    color: "text-violet-500",
    items: [
      { label: "PDF Editor", href: "/pdf-editor", desc: "Edit PDF content" },
      { label: "Watermark PDF", href: "/watermark-pdf", desc: "Add watermarks" },
      { label: "Rotate PDF", href: "/rotate-pdf", desc: "Rotate pages" },
      { label: "Delete Pages", href: "/delete-pages", desc: "Remove pages" },
    ],
  },
  {
    label: "Compress",
    icon: Minimize2,
    color: "text-green-500",
    items: [
      { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce file size" },
    ],
  },
  {
    label: "Security",
    icon: Lock,
    color: "text-slate-500",
    items: [
      { label: "Protect PDF", href: "/protect-pdf", desc: "Add password" },
      { label: "Unlock PDF", href: "/unlock-pdf", desc: "Remove password" },
    ],
  },
  {
    label: "Convert",
    icon: RefreshCw,
    color: "text-pink-500",
    items: [
      { label: "PDF to JPG", href: "/pdf-to-jpg", desc: "Export as images" },
      { label: "PDF to Text", href: "/pdf-to-text", desc: "Extract text" },
      { label: "JPG to PDF", href: "/jpg-to-pdf", desc: "Images to PDF" },
      { label: "Word to PDF", href: "/word-to-pdf", desc: "DOCX to PDF" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <FileOutput className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Docu<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isOpen = activeDropdown === cat.label;
              return (
                <div
                  key={cat.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                    <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    {cat.label}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-border bg-popover shadow-xl p-1.5"
                      >
                        {cat.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              {item.label}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/tools">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                All Tools
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label}>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      {cat.label}
                    </div>
                    {cat.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm hover:bg-accent hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-border">
                <Link href="/tools" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">
                    <Zap className="w-4 h-4 mr-1" /> All Tools
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
