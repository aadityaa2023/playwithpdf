import React from "react";
import {
  Type,
  Link2,
  FileText,
  ImagePlus,
  Pen,
  Eraser,
  Highlighter,
  Square,
  Undo2,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

interface EditorToolbarProps {
  activeTool: string;
  setActiveTool: (tool: any) => void;
  onInsertImage: () => void;
  undo: () => void;
  canUndo: boolean;
}

export function EditorToolbar({
  activeTool,
  setActiveTool,
  onInsertImage,
  undo,
  canUndo,
}: EditorToolbarProps) {
  return (
    <div className="bg-white pt-8 pb-5 text-center shadow-sm z-10 relative flex flex-col items-center border-b border-[#e5e5e5]">
      <h1 className="text-[28px] font-bold text-[#333] flex items-center justify-center gap-1.5 mb-1.5">
        Online PDF editor{" "}
        <span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider border border-gray-300 rounded px-1 relative -top-3">
          BETA
        </span>
      </h1>
      <p className="text-[#999] text-[17px] font-light mb-6">
        Edit PDF files for free. Fill & sign PDF
      </p>

      {/* Toolbar */}
      <div className="max-w-[850px] w-full flex items-center justify-center gap-2 px-4 text-[13px] font-sans">
        <div className="flex border border-[#bce0fd] rounded bg-white overflow-hidden">
          <button
            onClick={() => setActiveTool("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors ${
              activeTool === "text" ? "bg-[#ebf5ff] font-medium" : ""
            }`}
          >
            <Type size={14} /> Text <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors">
            <Link2 size={14} /> Links
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors">
            <FileText size={14} /> Forms <ChevronDown size={12} />
          </button>
          <button
            onClick={onInsertImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors"
          >
            <ImagePlus size={14} /> Images <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setActiveTool("draw")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors ${
              activeTool === "draw" ? "bg-[#ebf5ff] font-medium" : ""
            }`}
          >
            <Pen size={14} /> Sign <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setActiveTool("eraser")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors ${
              activeTool === "eraser" ? "bg-[#ebf5ff] font-medium" : ""
            }`}
          >
            <Eraser size={14} /> Whiteout
          </button>
          <button
            onClick={() => setActiveTool("highlight")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors ${
              activeTool === "highlight" ? "bg-[#ebf5ff] font-medium" : ""
            }`}
          >
            <Highlighter size={14} /> Annotate <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setActiveTool("rect")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors ${
              activeTool === "rect" || activeTool === "ellipse"
                ? "bg-[#ebf5ff] font-medium"
                : ""
            }`}
          >
            <Square size={14} /> Shapes <ChevronDown size={12} />
          </button>
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] transition-colors disabled:opacity-50"
          >
            <Undo2 size={14} /> Undo
          </button>
        </div>

        <div className="flex border border-[#bce0fd] rounded bg-white overflow-hidden ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] hover:bg-[#ebf5ff] transition-colors">
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
