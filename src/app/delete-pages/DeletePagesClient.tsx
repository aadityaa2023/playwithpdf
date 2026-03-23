"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { deletePages, downloadBytes, getPDFPageCount } from "@/lib/pdf-utils";

export default function DeletePagesClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToDelete, setPagesToDelete] = useState<string>("");
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = async (f: UploadedFile[]) => {
    setFiles(f);
    setState("idle");
    setResult(null);
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

  const handleDelete = async () => {
    if (files.length === 0 || !pagesToDelete.trim()) return;
    setState("processing");
    setError(null);
    try {
      const pageNumbers = pagesToDelete
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n >= 1 && n <= pageCount);

      if (pageNumbers.length === 0) {
        throw new Error("No valid page numbers provided");
      }
      
      const newPdf = await deletePages(files[0].file, pageNumbers);
      setResult(newPdf);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete pages");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "cleaned.pdf");
  }, [result]);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setError(null);
    setPageCount(0);
    setPagesToDelete("");
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
            <Label htmlFor="pages-to-delete">Pages to Delete</Label>
            <Input
              id="pages-to-delete"
              placeholder="e.g. 1, 3, 5"
              value={pagesToDelete}
              onChange={(e) => setPagesToDelete(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter page numbers separated by commas.
            </p>
          </div>
          <Button onClick={handleDelete} disabled={!pagesToDelete.trim()} size="lg" className="w-full gap-2" variant="destructive">
            <Trash className="w-5 h-5" /> Remove Pages
          </Button>
        </motion.div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 80 : 100}
        resultName="cleaned.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Removing pages..."
      />
    </div>
  );
}
