import React from "react";
import { Loader2 } from "lucide-react";

interface DropzoneProps {
  loading: boolean;
  onDrop: (e: React.DragEvent) => void;
  onUploadClick: () => void;
}

export function Dropzone({ loading, onDrop, onUploadClick }: DropzoneProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f5f7]">
      <section className="flex flex-col items-center pt-16 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-[2.5rem] font-bold text-[#333] mb-4">
            Easy to use Online PDF editor
          </h1>
          <p className="text-[1.3rem] text-[#666] font-normal">
            Edit PDF files for free. Fill & sign PDF
          </p>
        </div>

        <div 
          className="w-full max-w-[800px] bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-12 text-center border border-[#e5e5e5] cursor-pointer hover:shadow-md transition-shadow"
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !loading && onUploadClick()}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 text-[#5cb85c] animate-spin" />
              <p className="text-[#666] text-lg font-medium">Processing your document...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <button 
                className="bg-[#5cb85c] hover:bg-[#449d44] text-white text-xl font-bold py-4 px-8 rounded-sm shadow-sm transition-colors flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); onUploadClick(); }}
              >
                Upload PDF file
              </button>
              <p className="text-[#999] text-base mt-2">
                or drop PDFs here
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-[#666] text-[13px] leading-relaxed max-w-2xl">
          <p className="mb-1">
            <span className="font-semibold text-[#555]">Files stay private.</span> Automatically deleted after 2 hours.
          </p>
          <p>
            Free service for documents up to <span className="font-semibold">200 pages</span> or <span className="font-semibold">50 MB</span> and <span className="font-semibold">3 tasks per hour</span>.
          </p>
        </div>
      </section>

      <section className="bg-white border-t border-[#e5e5e5] py-16">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-[#333] mb-3">How to edit a PDF file online</h3>
            <ul className="text-[#555] space-y-2 list-decimal list-inside text-[15px]">
              <li>Upload the file you want to edit.</li>
              <li>Click on a page to edit or add new text.</li>
              <li>Use the top menu to add text, images, or shapes.</li>
              <li>Click "Apply changes" and download your edited PDF.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#333] mb-3">Safe & Secure</h3>
            <p className="text-[#555] text-[15px] leading-relaxed">
              Your files are safe with us. Uploaded files are processed using strict security protocols. 
              Files are permanently deleted from our servers within a few hours. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
