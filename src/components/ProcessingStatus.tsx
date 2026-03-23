"use client";

import { motion } from "framer-motion";
import { CheckCircle, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type ProcessingState = "idle" | "processing" | "done" | "error";

interface ProcessingStatusProps {
  state: ProcessingState;
  progress?: number;
  resultName?: string;
  errorMessage?: string;
  onDownload?: () => void;
  onReset?: () => void;
  processingLabel?: string;
}

export default function ProcessingStatus({
  state,
  progress = 0,
  resultName = "result.pdf",
  errorMessage,
  onDownload,
  onReset,
  processingLabel = "Processing your file...",
}: ProcessingStatusProps) {
  if (state === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border p-6 text-center",
        state === "done" && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
        state === "processing" && "border-border bg-card",
        state === "error" && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
      )}
    >
      {state === "processing" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <div className="w-full max-w-xs">
            <p className="text-sm font-medium mb-3">{processingLabel}</p>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>
        </div>
      )}

      {state === "done" && (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
          >
            <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
          </motion.div>
          <div>
            <p className="font-semibold text-green-700 dark:text-green-400">Done! Your file is ready.</p>
            <p className="text-sm text-muted-foreground mt-1">{resultName}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onDownload} className="gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button variant="outline" onClick={onReset}>
              Process Another
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">{errorMessage ?? "Please try again."}</p>
          </div>
          <Button variant="outline" onClick={onReset}>
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  );
}
