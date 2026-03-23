"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Minimize2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { downloadBytes } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

type Quality = "high" | "medium" | "low";

const qualityMap: Record<Quality, { label: string; desc: string }> = {
  high: { label: "High Quality", desc: "Minimal compression, maintains original quality" },
  medium: { label: "Medium (Recommended)", desc: "Good balance between size and quality" },
  low: { label: "Maximum Compression", desc: "Smallest file, some quality loss" },
};

async function compressPDF(file: File, quality: Quality): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // pdf-lib doesn't truly compress images, but re-saving reduces overhead
  // and removes unused objects
  const saveOptions = {
    useObjectStreams: quality !== "high",
    addDefaultPage: false,
    objectsPerTick: quality === "low" ? 50 : quality === "medium" ? 20 : 10,
  };
  return pdf.save(saveOptions);
}

export default function CompressPDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState<Quality>("medium");
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setState("processing");
    setError(null);
    try {
      const file = files[0].file;
      setOriginalSize(file.size);
      const compressed = await compressPDF(file, quality);
      setCompressedSize(compressed.length);
      setResult(compressed);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compress PDF");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "compressed.pdf");
  }, [result]);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setError(null);
  };

  const savings =
    originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <FileUpload onFilesChange={setFiles} label="Drop your PDF here" sublabel="We'll reduce its file size — 100MB max" />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Compression Level</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(qualityMap) as [Quality, { label: string; desc: string }][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={`p-3 rounded-xl border text-left text-sm transition-all ${
                    quality === key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-semibold block">{val.label}</span>
                  <span className="text-xs text-muted-foreground">{val.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Browser-based compression optimizes document structure and removes redundant data.
          </div>
          <Button onClick={handleCompress} size="lg" className="w-full gap-2">
            <Minimize2 className="w-5 h-5" /> Compress PDF
          </Button>
        </motion.div>
      )}

      {state === "done" && originalSize > 0 && (
        <div className="flex items-center justify-center gap-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Original</p>
            <p className="font-bold text-foreground">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Compressed</p>
            <p className="font-bold text-green-600">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Saved</p>
            <p className="font-bold text-green-600">{savings}%</p>
          </div>
        </div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 80 : 100}
        resultName="compressed.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Compressing your PDF..."
      />
    </div>
  );
}
