"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { rotatePDF, downloadBytes } from "@/lib/pdf-utils";

export default function RotatePDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [angle, setAngle] = useState<"90" | "180" | "270">("90");
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = async () => {
    if (files.length === 0) return;
    setState("processing");
    setError(null);
    try {
      const numAngle = parseInt(angle, 10) as 90 | 180 | 270;
      const rotated = await rotatePDF(files[0].file, numAngle);
      setResult(rotated);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to rotate PDF");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "rotated.pdf");
  }, [result]);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setError(null);
    setAngle("90");
  };

  return (
    <div className="space-y-6">
      <FileUpload onFilesChange={setFiles} label="Drop your PDF here" />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <Label>Rotation Angle</Label>
            <div className="flex gap-4">
              <select 
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                value={angle} 
                onChange={(e) => setAngle(e.target.value as any)}
              >
                <option value="90">90° Clockwise</option>
                <option value="180">180° Flip</option>
                <option value="270">90° Counter-Clockwise</option>
              </select>
            </div>
          </div>
          <Button onClick={handleRotate} size="lg" className="w-full gap-2">
            <RefreshCw className="w-5 h-5" /> Rotate PDF
          </Button>
        </motion.div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 80 : 100}
        resultName="rotated.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Rotating your PDF..."
      />
    </div>
  );
}
