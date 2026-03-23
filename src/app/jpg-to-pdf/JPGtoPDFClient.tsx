"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileImage, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { downloadBytes } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

export default function JPGtoPDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setState("processing");
    setError(null);
    try {
      const pdf = await PDFDocument.create();

      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdf.embedJpg(bytes);
        } else if (file.type === "image/png") {
          image = await pdf.embedPng(bytes);
        } else {
          throw new Error(`Unsupported image type: ${file.type}. Please use JPG or PNG.`);
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to convert images to PDF");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "converted-images.pdf");
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
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        multiple
        maxFiles={30}
        onFilesChange={setFiles}
        label="Drop JPG or PNG images here"
        sublabel="Add images to convert them to a single PDF"
      />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Button onClick={handleConvert} size="lg" className="w-full gap-2">
            <FileImage className="w-5 h-5" /> Convert {files.length} Image{files.length > 1 ? "s" : ""} to PDF
          </Button>
        </motion.div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 70 : 100}
        resultName="converted-images.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Converting your images..."
      />
    </div>
  );
}
