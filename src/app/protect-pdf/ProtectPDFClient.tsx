"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload, { type UploadedFile } from "@/components/FileUpload";
import ProcessingStatus, { type ProcessingState } from "@/components/ProcessingStatus";
import { protectPDF, downloadBytes } from "@/lib/pdf-utils";

export default function ProtectPDFClient() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProtect = async () => {
    if (files.length === 0 || !password) return;
    setState("processing");
    setError(null);
    try {
      const encrypted = await protectPDF(files[0].file, password);
      setResult(encrypted);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to encrypt PDF");
      setState("error");
    }
  };

  const handleDownload = useCallback(() => {
    if (result) downloadBytes(result, "protected.pdf");
  }, [result]);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setError(null);
    setPassword("");
  };

  return (
    <div className="space-y-6">
      <FileUpload onFilesChange={setFiles} label="Drop your PDF here" />

      {files.length > 0 && state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Set PDF Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleProtect} disabled={!password} size="lg" className="w-full gap-2">
            <Lock className="w-5 h-5" /> Encrypt PDF
          </Button>
        </motion.div>
      )}

      <ProcessingStatus
        state={state}
        progress={state === "processing" ? 80 : 100}
        resultName="protected.pdf"
        errorMessage={error ?? undefined}
        onDownload={handleDownload}
        onReset={handleReset}
        processingLabel="Encrypting your PDF..."
      />
    </div>
  );
}
