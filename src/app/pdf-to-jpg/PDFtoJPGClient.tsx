"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import * as pdfjsLib from "pdfjs-dist";

export default function PDFtoJPGClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Setup pdfjs worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setState("processing");
    setError(null);
    setProgress(0);
    try {
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const extractedImages = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 2; // Better quality
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        
        extractedImages.push({
          url: dataUrl,
          name: `${file.name.replace(".pdf", "")}-page-${pageNum}.jpg`
        });
        setProgress((pageNum / totalPages) * 100);
      }

      setImages(extractedImages);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to convert PDF to JPG");
      setState("error");
    }
  };

  const handleDownloadAll = useCallback(() => {
    images.forEach(({ url, name }) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    });
  }, [images]);

  const handleReset = () => {
    setFiles([]);
    setImages([]);
    setState("idle");
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <FileUpload
        onFilesChange={setFiles}
        label="Drop your PDF here"
        sublabel="Extract each page as a JPG image"
      />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={handleConvert} size="lg" className="w-full gap-2">
            <ImageIcon className="w-5 h-5" /> Extract PDF to Images
          </Button>
        </motion.div>
      )}

      {state === "done" && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {images.map((img, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-2 bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} className="w-full h-auto object-cover rounded shadow-sm border border-border" />
              <p className="text-xs text-center truncate text-muted-foreground">{img.name}</p>
            </div>
          ))}
        </div>
      )}

      <ProcessingStatus
        state={state}
        progress={progress}
        resultName={`${images.length} JPG images`}
        errorMessage={error ?? undefined}
        onDownload={handleDownloadAll}
        onReset={handleReset}
        processingLabel="Extracting images..."
      />
    </div>
  );
}
