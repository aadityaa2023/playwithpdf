"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface FileUploadProps {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange: (files: UploadedFile[]) => void;
  label?: string;
  sublabel?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: File) {
  if (file.type === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
  if (file.type.startsWith("image/")) return <Image className="w-5 h-5 text-blue-500" />;
  return <File className="w-5 h-5 text-muted-foreground" />;
}

export default function FileUpload({
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 100,
  onFilesChange,
  label = "Drop your PDF here",
  sublabel = "or click to browse — 100MB max",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError(null);
      const oversized = accepted.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      const newFiles: UploadedFile[] = accepted.map((f) => ({
        file: f,
        id: `${f.name}-${f.lastModified}-${Math.random()}`,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      }));
      const updated = multiple ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      setFiles(updated);
      onFilesChange(updated);
    },
    [files, multiple, maxFiles, maxSizeMB, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
          isDragActive && !isDragReject
            ? "border-primary bg-primary/5 scale-[1.01]"
            : isDragReject
            ? "border-destructive bg-destructive/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              isDragActive ? "bg-primary/20" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "w-7 h-7 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              {isDragActive ? "Release to upload" : label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{sublabel}</p>
          </div>
          {!isDragActive && (
            <Button variant="outline" size="sm" className="mt-1" type="button">
              Browse Files
            </Button>
          )}
        </motion.div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            {files.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
              >
                {f.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.preview} alt={f.file.name} className="w-8 h-8 object-cover rounded" />
                ) : (
                  getFileIcon(f.file)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
