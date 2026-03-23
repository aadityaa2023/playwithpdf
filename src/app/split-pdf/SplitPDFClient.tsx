"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { splitPDF, downloadBytes, getPDFPageCount } from "@/lib/pdf-utils";

export default function SplitPDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitAt, setSplitAt] = useState<string>("");
  const [state, setState] = useState<ProcessingState>("idle");
  const [results, setResults] = useState<Uint8Array[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = async (f: UploadedFile[]) => {
    setFiles(f);
    setState("idle");
    setResults([]);
    if (f.length > 0) {
      try {
        const count = await getPDFPageCount(f[0].file);
        setPageCount(count);
      } catch {
        setPageCount(0);
      }
    } else {
      setPageCount(0);
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    setState("processing");
    setError(null);
    try {
      // Parse ranges like "1-3,4-6" or split every page
      let ranges: { start: number; end: number }[];
      if (!splitAt.trim()) {
        // Split every page
        ranges = Array.from({ length: pageCount }, (_, i) => ({ start: i + 1, end: i + 1 }));
      } else {
        ranges = splitAt
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const [start, end] = s.split("-").map(Number);
            return { start: start || 1, end: end || start || 1 };
          });
      }
      const parts = await splitPDF(files[0].file, ranges);
      setResults(parts);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to split PDF");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    results.forEach((bytes, i) => {
      downloadBytes(bytes, `split-${i + 1}.pdf`);
    });
  }, [results]);

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setState("idle");
    setError(null);
    setPageCount(0);
    setSplitAt("");
  };

  return (
    <div className="space-y-6">
      <FileUpload onFilesChange={handleFilesChange} label="Drop your PDF here" />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {pageCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Your PDF has <span className="font-semibold text-foreground">{pageCount} pages</span>.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="split-ranges">
              Page ranges <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="split-ranges"
              placeholder="e.g. 1-3, 4-6 — leave empty to split every page"
              value={splitAt}
              onChange={(e) => setSplitAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use commas to separate ranges. Example: <code>1-2, 3-5, 6</code>
            </p>
          </div>
          <Button onClick={handleSplit} size="lg" className="w-full gap-2">
            <Scissors className="w-5 h-5" /> Split PDF
          </Button>
        </motion.div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 70 : 100}
        resultName={`${results.length} PDF file${results.length > 1 ? "s" : ""}`}
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Splitting your PDF..."
      />
    </div>
  );
}
