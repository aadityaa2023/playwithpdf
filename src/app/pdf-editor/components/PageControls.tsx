import React from "react";
import {
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  changeZoom: (delta: number) => void;
  goToPage: (page: number) => void;
}

export function PageControls({
  currentPage,
  totalPages,
  changeZoom,
  goToPage,
}: PageControlsProps) {
  return (
    <div className="flex items-center gap-3 mb-4 select-none self-center max-w-[850px] w-full justify-center">
      <div className="flex bg-transparent border border-[#bce0fd] rounded overflow-hidden shadow-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[#2a88c5] px-3 py-1.5 border-r border-[#bce0fd] bg-white flex items-center justify-center min-w-[70px] text-sm font-medium">
          {currentPage} / {totalPages || 1}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] transition-colors disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex bg-transparent border border-[#bce0fd] rounded overflow-hidden shadow-sm">
        <button className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors">
          <Trash2 size={16} />
        </button>
        <button
          onClick={() => changeZoom(0.25)}
          className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => changeZoom(-0.25)}
          className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <button className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] border-r border-[#bce0fd] transition-colors">
          <RotateCcw size={16} />
        </button>
        <button className="text-[#2a88c5] px-2.5 py-1.5 hover:bg-[#ebf5ff] transition-colors">
          <RotateCw size={16} />
        </button>
      </div>

      <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#2a88c5] border border-[#bce0fd] rounded bg-transparent hover:bg-[#ebf5ff] text-[13px] transition-colors bg-white/50 shadow-sm">
        <PlusCircle size={14} /> Insert page
      </button>
    </div>
  );
}
