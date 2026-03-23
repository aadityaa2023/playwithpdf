"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Merge, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { mergePDFs, downloadBytes } from "@/lib/pdf-utils";

export default function MergePDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setState("processing");
    setError(null);
    try {
      const merged = await mergePDFs(files.map((f) => f.file));
      setResult(merged);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to merge PDFs");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "merged.pdf");
  }, [result]);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <FileUpload
        multiple
        maxFiles={20}
        onFilesChange={setFiles}
        label="Drop your PDF files here"
        sublabel="Add 2 or more PDFs to combine them — 100MB max each"
      />

      {files.length > 1 && state === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border"
        >
          <div className="flex-1 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            {files.map((f, i) => (
              <span key={f.id} className="flex items-center gap-1">
                {i > 0 && <Plus className="w-3 h-3 text-primary" />}
                <span className="font-medium text-foreground truncate max-w-[120px]">
                  {f.file.name}
                </span>
              </span>
            ))}
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="font-medium text-primary">merged.pdf</span>
          </div>
        </motion.div>
      )}

      {files.length >= 2 && state === "idle" && (
        <Button onClick={handleMerge} size="lg" className="w-full gap-2">
          <Merge className="w-5 h-5" /> Merge {files.length} PDFs
        </Button>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 70 : 100}
        resultName="merged.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Merging your PDFs..."
      />
    </div>
  );
}
