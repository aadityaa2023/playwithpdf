"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
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
  const [strokeColor, setStrokeColor] = useState("#3b82f6"); // Brand blue
  const [fillColor, setFillColor] = useState("transparent");
  const [fontSize, setFontSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pageRendering, setPageRendering] = useState(false);

  // ─── Init Fabric ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      isDrawingMode: false,
    });
    fabricRef.current = canvas;

    canvas.on("object:added", () => saveSnapshot());
    canvas.on("object:modified", () => saveSnapshot());
    canvas.on("object:removed", () => saveSnapshot());

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      fc.on("mouse:down", (opt) => {
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
      fc.on("mouse:down", (opt) => {
        if (opt.target) {
          fc.remove(opt.target);
          fc.renderAll();
        }
      });
    }
  }, [activeTool, strokeColor, fillColor, fontSize, strokeWidth]);

  function bindShapeTool(fc: fabric.Canvas, tool: string) {
    fc.on("mouse:down", (opt) => {
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

    fc.on("mouse:move", (opt) => {
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
  }

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
    await renderPage(pdf, 1);
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
  }, [zoom, currentPage]);

  const goToPage = useCallback((pageNum: number) => {
    if (!pdfDocRef.current || pageNum < 1 || pageNum > totalPages) return;
    const fc = fabricRef.current;
    if (fc) {
      annotationsRef.current.set(currentPage, { json: JSON.stringify(fc.toJSON()) });
    }
    setCurrentPage(pageNum);
    renderPage(pdfDocRef.current, pageNum);
  }, [currentPage, totalPages, renderPage]);

  // ─── Undo / Redo ─────────────────────────────────────────────────────────────
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
  }, [currentPage]);

  function updateUndoRedo(pg: number) {
    setCanUndo((undoStackRef.current.get(pg)?.length ?? 0) > 1);
    setCanRedo((redoStackRef.current.get(pg)?.length ?? 0) > 0);
  }

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
  }, [currentPage]);

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
  }, [currentPage]);

  const changeZoom = useCallback((delta: number) => {
    setZoom((z) => Math.max(0.25, Math.min(3, z + delta)));
  }, []);

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

  const presets = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#000000", "#ffffff"];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* ── Navbar-style Toolbar ────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={activeTool}
            onValueChange={(val) => val && setActiveTool(val as Tool)}
            className="bg-slate-800/50 p-1 rounded-lg border border-slate-700"
          >
            {tools.map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={t.id}
                    aria-label={t.label}
                    className="w-9 h-9 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                  >
                    <t.icon size={18} />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t.label}</TooltipContent>
              </Tooltip>
            ))}
            
            <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-slate-400 hover:text-white"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImagePlus size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Insert Image</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <div className="flex items-center gap-1.5 ml-2">
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="w-9 h-9 border-slate-700 bg-slate-800">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: strokeColor }} />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Color & Settings</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 bg-slate-900 border-slate-800 text-slate-50">
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stroke Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((c) => (
                        <button
                          key={c}
                          className="w-6 h-6 rounded-md border border-white/10"
                          style={{ backgroundColor: c }}
                          onClick={() => setStrokeColor(c)}
                        />
                      ))}
                      <input 
                        type="color" 
                        value={strokeColor} 
                        onChange={e => setStrokeColor(e.target.value)}
                        className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-medium text-slate-400">
                        {activeTool === "text" ? "Font Size" : "Stroke Width"}
                      </h4>
                      <Badge variant="secondary" className="bg-slate-800 text-[10px]">{activeTool === "text" ? fontSize : strokeWidth}px</Badge>
                    </div>
                    <Slider
                      value={[activeTool === "text" ? fontSize : strokeWidth]}
                      min={1}
                      max={activeTool === "text" ? 100 : 20}
                      step={1}
                      onValueChange={(val) => activeTool === "text" ? setFontSize(val[0]) : setStrokeWidth(val[0])}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={undo} disabled={!canUndo}>
                  <Undo2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={redo} disabled={!canRedo}>
                  <Redo2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 bg-slate-700" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => changeZoom(-0.25)}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-xs font-medium w-10 text-center text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => changeZoom(0.25)}>
              <ZoomIn size={16} />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 bg-slate-700" />

          {pdfLoaded ? (
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-4 shadow-lg shadow-blue-900/20"
                onClick={downloadPdf}
              >
                <Download size={16} />
                Export PDF
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> Open File
            </Button>
          )}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        {pdfLoaded && (
          <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Pages</h3>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                {currentPage} of {totalPages}
              </Badge>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-1 gap-4">
                {thumbnails.map((src, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <button
                      onClick={() => goToPage(i + 1)}
                      className={`relative group rounded-xl overflow-hidden border-2 aspect-[3/4] bg-slate-800 transition-all shadow-md ${
                        currentPage === i + 1
                          ? "border-blue-500 ring-2 ring-blue-500/20"
                          : "border-transparent hover:border-slate-600"
                      }`}
                    >
                      <img src={src} alt={`Page ${i + 1}`} className="w-full h-full object-contain" />
                      <div className="absolute inset-x-0 bottom-0 py-1 bg-slate-900/80 text-[10px] font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Go to Page {i + 1}
                      </div>
                    </button>
                    <span className="text-[11px] font-medium text-center text-slate-500">Page {i + 1}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {/* ── Editor Canvas ──────────────────────────────────────────────── */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-950">
          {!pdfLoaded ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div 
                className="group relative w-full max-w-2xl aspect-[16/10] bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-6 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-slate-400 font-medium">Processing your document...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-100 mb-2">Drop your PDF here</h2>
                      <p className="text-slate-400 max-w-xs mx-auto">Click to browse or drag and drop your file to start editing instantly.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                      <Settings2 size={12} /> Privacy Guaranteed: Files never leave your browser
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 w-full bg-[#0f172a]/30">
              <div className="min-w-full min-h-full flex items-center justify-center p-12">
                <div className="relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white rounded-sm overflow-hidden border border-slate-800">
                  {pageRendering && (
                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="max-w-full" />
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Footer Status */}
          {pdfLoaded && (
            <footer className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  {pdfName}
                </span>
                <Separator orientation="vertical" className="h-3 bg-slate-800" />
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <div className="flex items-center gap-1.5">
                Client-side Encryption Active
              </div>
            </footer>
          )}
        </div>
      </main>

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
