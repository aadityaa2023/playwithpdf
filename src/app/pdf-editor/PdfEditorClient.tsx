"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Dropzone } from "./components/Dropzone";
import { EditorToolbar } from "./components/EditorToolbar";
import { PageControls } from "./components/PageControls";
import {
  MousePointer2,
  Type,
  Pen,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  ImagePlus,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Upload,
  Loader2,
  Pipette,
  Settings2,
  Link2,
  FileText,
  LayoutGrid,
  Trash2,
  RotateCcw,
  RotateCw,
  ChevronDown,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tool =
  | "select"
  | "text"
  | "draw"
  | "highlight"
  | "rect"
  | "ellipse"
  | "arrow"
  | "image"
  | "eraser";

interface PageAnnotations {
  json: string;
}

export default function PdfEditorClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const pdfDocRef = useRef<any>(null);
  const annotationsRef = useRef<Map<number, PageAnnotations>>(new Map());
  const undoStackRef = useRef<Map<number, string[]>>(new Map());
  const redoStackRef = useRef<Map<number, string[]>>(new Map());
  const isDrawingShapeRef = useRef(false);
  const shapeStartRef = useRef({ x: 0, y: 0 });
  const activeShapeRef = useRef<fabric.Object | null>(null);

  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [strokeColor, setStrokeColor] = useState("#2BB3A3"); // Brand teal
  const [fillColor, setFillColor] = useState("transparent");
  const [fontSize, setFontSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pageRendering, setPageRendering] = useState(false);

  // ─── Undo / Redo ─────────────────────────────────────────────────────────────
  const updateUndoRedo = useCallback((pg: number) => {
    setCanUndo((undoStackRef.current.get(pg)?.length ?? 0) > 1);
    setCanRedo((redoStackRef.current.get(pg)?.length ?? 0) > 0);
  }, []);

  const saveSnapshot = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const pg = currentPage;
    const json = JSON.stringify(fc.toJSON());
    if (!undoStackRef.current.has(pg)) undoStackRef.current.set(pg, []);
    undoStackRef.current.get(pg)!.push(json);
    if (undoStackRef.current.get(pg)!.length > 50)
      undoStackRef.current.get(pg)!.shift();
    redoStackRef.current.set(pg, []);
    updateUndoRedo(pg);
  }, [currentPage, updateUndoRedo]);

  const undo = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const pg = currentPage;
    const stack = undoStackRef.current.get(pg) ?? [];
    if (stack.length <= 1) return;
    const popped = stack.pop()!;
    if (!redoStackRef.current.has(pg)) redoStackRef.current.set(pg, []);
    redoStackRef.current.get(pg)!.push(popped);
    const prev = stack[stack.length - 1];
    const bg = fc.backgroundImage;
    fc.loadFromJSON(JSON.parse(prev)).then(() => {
      fc.backgroundImage = bg ?? undefined;
      fc.renderAll();
      updateUndoRedo(pg);
    });
  }, [currentPage, updateUndoRedo]);

  const redo = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const pg = currentPage;
    const stack = redoStackRef.current.get(pg) ?? [];
    if (stack.length === 0) return;
    const next = stack.pop()!;
    if (!undoStackRef.current.has(pg)) undoStackRef.current.set(pg, []);
    undoStackRef.current.get(pg)!.push(next);
    const bg = fc.backgroundImage;
    fc.loadFromJSON(JSON.parse(next)).then(() => {
      fc.backgroundImage = bg ?? undefined;
      fc.renderAll();
      updateUndoRedo(pg);
    });
  }, [currentPage, updateUndoRedo]);

  const changeZoom = useCallback((delta: number) => {
    setZoom((z) => Math.max(0.25, Math.min(3, z + delta)));
  }, []);

  // ─── Render Page ─────────────────────────────────────────────────────────────
  const renderPage = useCallback(async (pdf: any, pageNum: number) => {
    const fc = fabricRef.current;
    if (!fc) return;
    setPageRendering(true);

    if (pdfDocRef.current) {
      const current = annotationsRef.current.get(currentPage);
      if (!current) {
        annotationsRef.current.set(currentPage, { json: fc.toJSON ? JSON.stringify(fc.toJSON()) : "null" });
      }
    }

    const page = await pdf.getPage(pageNum);
    const scale = zoom * 1.5; // Base scale boost for better clarity
    const viewport = page.getViewport({ scale });

    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = viewport.width;
    bgCanvas.height = viewport.height;
    const ctx = bgCanvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas: bgCanvas as unknown as HTMLCanvasElement }).promise;
    const bgDataUrl = bgCanvas.toDataURL("image/png");

    fc.setDimensions({ width: viewport.width, height: viewport.height });
    fc.clear();

    fabric.FabricImage.fromURL(bgDataUrl).then((img) => {
      fc.backgroundImage = img;
      img.set({ left: 0, top: 0, selectable: false, evented: false });
      fc.renderAll();

      const saved = annotationsRef.current.get(pageNum);
      if (saved && saved.json !== "null") {
        try {
          const parsed = JSON.parse(saved.json);
          fc.loadFromJSON(parsed).then(() => {
            fc.backgroundImage = img;
            fc.renderAll();
            setPageRendering(false);
          });
        } catch {
          setPageRendering(false);
        }
      } else {
        setPageRendering(false);
      }
      updateUndoRedo(pageNum);
    });
  }, [zoom, currentPage, updateUndoRedo]);

  const goToPage = useCallback((pageNum: number) => {
    if (!pdfDocRef.current || pageNum < 1 || pageNum > totalPages) return;
    const fc = fabricRef.current;
    if (fc) {
      annotationsRef.current.set(currentPage, { json: JSON.stringify(fc.toJSON()) });
    }
    setCurrentPage(pageNum);
    renderPage(pdfDocRef.current, pageNum);
  }, [currentPage, totalPages, renderPage]);

  const initFabric = useCallback(() => {
    if (!canvasRef.current || fabricRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      isDrawingMode: false,
    });
    fabricRef.current = canvas;

    canvas.on("object:added", () => saveSnapshot());
    canvas.on("object:modified", () => saveSnapshot());
    canvas.on("object:removed", () => saveSnapshot());
  }, [saveSnapshot]);

  // ─── Init Fabric ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (pdfLoaded && canvasRef.current && !fabricRef.current) {
      initFabric();
    }
  }, [pdfLoaded, initFabric]);

  const bindShapeTool = useCallback((fc: fabric.Canvas, tool: string) => {
    fc.on("mouse:down", (opt: any) => {
      if (opt.target && tool !== "eraser") return;
      const pointer = fc.getViewportPoint(opt.e);
      isDrawingShapeRef.current = true;
      shapeStartRef.current = { x: pointer.x, y: pointer.y };

      let shape: fabric.Object | null = null;
      if (tool === "highlight") {
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 20,
          fill: "rgba(250, 204, 21, 0.35)",
          stroke: "transparent",
          selectable: true,
          strokeWidth: 0,
        });
      } else if (tool === "rect") {
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: fillColor === "transparent" ? "transparent" : fillColor,
          stroke: strokeColor,
          strokeWidth,
          selectable: true,
        });
      } else if (tool === "ellipse") {
        shape = new fabric.Ellipse({
          left: pointer.x,
          top: pointer.y,
          rx: 1,
          ry: 1,
          fill: fillColor === "transparent" ? "transparent" : fillColor,
          stroke: strokeColor,
          strokeWidth,
          selectable: true,
        });
      } else if (tool === "arrow") {
        shape = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          {
            stroke: strokeColor,
            strokeWidth,
            selectable: true,
          }
        );
      }

      if (shape) {
        activeShapeRef.current = shape;
        fc.add(shape);
        fc.renderAll();
      }
    });

    fc.on("mouse:move", (opt: any) => {
      if (!isDrawingShapeRef.current || !activeShapeRef.current) return;
      const pointer = fc.getViewportPoint(opt.e);
      const shape = activeShapeRef.current;
      const { x: startX, y: startY } = shapeStartRef.current;

      if (tool === "highlight" || tool === "rect") {
        const r = shape as fabric.Rect;
        r.set({
          width: Math.abs(pointer.x - startX),
          height: tool === "highlight" ? 22 : Math.abs(pointer.y - startY),
          left: Math.min(pointer.x, startX),
          top: Math.min(pointer.y, startY),
        });
      } else if (tool === "ellipse") {
        const e = shape as fabric.Ellipse;
        e.set({
          rx: Math.abs(pointer.x - startX) / 2,
          ry: Math.abs(pointer.y - startY) / 2,
          left: Math.min(pointer.x, startX),
          top: Math.min(pointer.y, startY),
        });
      } else if (tool === "arrow") {
        const l = shape as fabric.Line;
        l.set({ x2: pointer.x, y2: pointer.y });
      }
      fc.renderAll();
    });

    fc.on("mouse:up", () => {
      isDrawingShapeRef.current = false;
      activeShapeRef.current = null;
    });
  }, [strokeColor, fillColor, strokeWidth]);

  // ─── Tool changes ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    fc.isDrawingMode = activeTool === "draw";
    fc.selection = activeTool === "select";

    if (activeTool === "draw") {
      const brush = new fabric.PencilBrush(fc);
      brush.color = strokeColor;
      brush.width = strokeWidth;
      fc.freeDrawingBrush = brush;
    }

    if (activeTool === "select" || activeTool === "eraser") {
      fc.defaultCursor = activeTool === "eraser" ? "crosshair" : "default";
    } else if (activeTool !== "draw") {
      fc.defaultCursor = "crosshair";
    }

    fc.off("mouse:down");
    fc.off("mouse:move");
    fc.off("mouse:up");

    if (activeTool === "text") {
      fc.on("mouse:down", (opt: any) => {
        if (opt.target) return;
        const pointer = fc.getViewportPoint(opt.e);
        const text = new fabric.IText("Type something...", {
          left: pointer.x,
          top: pointer.y,
          fontSize,
          fill: strokeColor,
          fontFamily: "Inter, sans-serif",
          editable: true,
        });
        fc.add(text);
        fc.setActiveObject(text);
        text.enterEditing();
        fc.renderAll();
      });
    } else if (activeTool === "highlight") {
      bindShapeTool(fc, "highlight");
    } else if (activeTool === "rect") {
      bindShapeTool(fc, "rect");
    } else if (activeTool === "ellipse") {
      bindShapeTool(fc, "ellipse");
    } else if (activeTool === "arrow") {
      bindShapeTool(fc, "arrow");
    } else if (activeTool === "eraser") {
      fc.on("mouse:down", (opt: any) => {
        if (opt.target) {
          fc.remove(opt.target);
          fc.renderAll();
        }
      });
    }
  }, [activeTool, strokeColor, fillColor, fontSize, strokeWidth, bindShapeTool]);


  // ─── Load PDF ────────────────────────────────────────────────────────────────
  const loadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setPdfName(file.name);

    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    pdfDocRef.current = pdf;
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    annotationsRef.current.clear();
    undoStackRef.current.clear();
    redoStackRef.current.clear();

    const thumbs: string[] = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 100); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const tc = document.createElement("canvas");
      tc.width = viewport.width;
      tc.height = viewport.height;
      const ctx = tc.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas: tc as unknown as HTMLCanvasElement }).promise;
      thumbs.push(tc.toDataURL());
    }
    setThumbnails(thumbs);
    setPdfLoaded(true);
    setLoading(false);
    
    // Wait for the DOM to update and mount the canvas element
    setTimeout(async () => {
      if (!fabricRef.current && canvasRef.current) {
        initFabric();
      }
      await renderPage(pdf, 1);
    }, 100);
  }, [renderPage, initFabric]);



  useEffect(() => {
    if (pdfDocRef.current && pdfLoaded) {
      renderPage(pdfDocRef.current, currentPage);
    }
  }, [zoom]);

  const insertImage = useCallback((file: File) => {
    const fc = fabricRef.current;
    if (!fc) return;
    const url = URL.createObjectURL(file);
    fabric.FabricImage.fromURL(url).then((img) => {
      img.scaleToWidth(200);
      img.set({ left: 150, top: 150 });
      fc.add(img);
      fc.setActiveObject(img);
      fc.renderAll();
    });
  }, []);

  const downloadPdf = useCallback(async () => {
    if (!pdfDocRef.current) return;
    const fc = fabricRef.current;
    if (!fc) return;

    annotationsRef.current.set(currentPage, { json: JSON.stringify(fc.toJSON()) });

    const pdfjsLib = await import("pdfjs-dist");
    const { PDFDocument } = await import("pdf-lib");
    const newPdf = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 }); // High quality export

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = viewport.width;
      pageCanvas.height = viewport.height;
      const pageCtx = pageCanvas.getContext("2d")!;
      await page.render({ canvasContext: pageCtx, viewport, canvas: pageCanvas as unknown as HTMLCanvasElement }).promise;

      const saved = annotationsRef.current.get(pageNum);
      if (saved && saved.json !== "null") {
        try {
          const tempEl = document.createElement("canvas");
          tempEl.width = viewport.width;
          tempEl.height = viewport.height;
          const tempFc = new fabric.Canvas(tempEl, {
            width: viewport.width,
            height: viewport.height,
          });

          await new Promise<void>((resolve) => {
            const parsed = JSON.parse(saved.json);
            tempFc.loadFromJSON(parsed).then(() => {
              // Scale annotations to fit export viewport
              const canvasScale = 2 / (zoom * 1.5);
              tempFc.getObjects().forEach(obj => {
                obj.scaleX = (obj.scaleX || 1) * canvasScale;
                obj.scaleY = (obj.scaleY || 1) * canvasScale;
                obj.left = (obj.left || 0) * canvasScale;
                obj.top = (obj.top || 0) * canvasScale;
                obj.setCoords();
              });
              tempFc.renderAll();
              pageCtx.drawImage(tempFc.getElement(), 0, 0);
              tempFc.dispose();
              resolve();
            });
          });
        } catch {}
      }

      const jpgBytes = await new Promise<Uint8Array<ArrayBuffer>>((resolve) => {
        pageCanvas.toBlob(async (blob) => {
          const ab = await blob!.arrayBuffer();
          resolve(new Uint8Array(ab as ArrayBuffer));
        }, "image/jpeg", 0.9);
      });

      const jpgImage = await newPdf.embedJpg(jpgBytes);
      const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    }

    const bytes = await newPdf.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfName.replace(".pdf", "") + "_edited.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [currentPage, totalPages, zoom, pdfName]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type === "application/pdf") loadPdf(file);
    },
    [loadPdf]
  );

  const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "text", icon: Type, label: "Text" },
    { id: "draw", icon: Pen, label: "Draw" },
    { id: "highlight", icon: Highlighter, label: "Highlight" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "ellipse", icon: Circle, label: "Ellipse" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const presets = ["#2BB3A3", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#000000", "#ffffff"];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F7F7F7] text-[#333333] overflow-hidden font-sans">
      {!pdfLoaded ? (
        <Dropzone 
          loading={loading}
          onDrop={handleDrop}
          onUploadClick={() => !loading && fileInputRef.current?.click()}
        />
      ) : (
        <div className="flex flex-col h-full bg-[#dfdfdf] w-full">
          <EditorToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            onInsertImage={() => imageInputRef.current?.click()}
            undo={undo}
            canUndo={canUndo}
          />
          <div className="flex-1 overflow-auto relative p-6 bg-[#dfdfdf] block text-center min-h-full">
             <div className="inline-flex flex-col items-center text-left min-w-max pb-24">
               <PageControls
                 currentPage={currentPage}
                 totalPages={totalPages}
                 changeZoom={changeZoom}
                 goToPage={goToPage}
               />
               
               <div className="relative">
                 {pageRendering && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex items-center justify-center pointer-events-none">
                      <Loader2 className="w-10 h-10 text-[#2a88c5] animate-spin" />
                    </div>
                 )}
                 <div className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] bg-white rounded-sm border border-[#ccc]">
                    <canvas ref={canvasRef} className="max-w-full" />
                 </div>
               </div>
             </div>
             
             {/* Bottom Apply Changes fixed floating bottom center */}
             <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
               <button 
                 onClick={downloadPdf}
                 className="bg-[#1fc79a] hover:bg-[#1bb88d] text-white font-bold text-[15px] px-5 py-2.5 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-1 transition-colors tracking-wide"
               >
                 Apply changes <ChevronRight size={18} strokeWidth={3} />
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={e => {
        const file = e.target.files?.[0];
        if (file) loadPdf(file);
        e.target.value = "";
      }} />
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
        const file = e.target.files?.[0];
        if (file) insertImage(file);
        e.target.value = "";
      }} />
    </div>
  );
}
