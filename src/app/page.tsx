"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Shield, Zap, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      // In a real Sejda-like flow, we might want to pass the file to the next page
      // But for simple SPA flow, we can navigate and let the editor page handle its own upload
      // OR we can use a global state/atom to store the file
      // For now, let's navigate to the editor and let the user re-upload or just use the button there.
      // Actually, to make it feel like Sejda, the button should go to /pdf-editor
      router.push("/pdf-editor");
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-950 text-white font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-3 duration-1000">
            Professional PDF Tools
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
            Easy to use Online <br />
            <span className="text-blue-500">PDF Editor</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Edit PDF files for free. Add text, highlights, images, and shapes. 
            Everything is done in your browser for 100% privacy.
          </p>

          <div className="pt-6">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <Button 
              size="lg" 
              className="h-16 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-500 rounded-2xl gap-3 group transition-all active:scale-95"
              onClick={() => router.push("/pdf-editor")}
            >
              <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
              Edit a PDF document
            </Button>
            <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Files stay private. No data leaves your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights (Sejda Style) */}
      <section className="bg-slate-900/40 border-t border-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/50 border-slate-800 p-6 flex flex-col items-center text-center gap-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Fast & Simple</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload, edit, and download in seconds. No complicated installation or signup required.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6 flex flex-col items-center text-center gap-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Full Toolset</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Everything you need for PDF editing: text, drawing, shapes, images, and highlighting.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6 flex flex-col items-center text-center gap-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Professional Quality</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Export high-fidelity PDFs with flattened annotations. Compatible with all standard viewers.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
