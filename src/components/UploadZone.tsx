import React, { useState, useRef } from "react";
import { useMatchi } from "../context/MatchiContext";

export default function UploadZone() {
  const { setUploadedFile, findMatches } = useMatchi();
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    
    // Validate file type is strictly PDF
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setErrorMsg("Please upload a PDF file only.");
      return;
    }
    
    // Validate file size is <= 5MB (5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setUploadedFile(file);
    
    // Auto-initiate the simulated matching flow
    findMatches(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="max-w-[800px] mx-auto py-12 px-4 flex flex-col items-center w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full min-h-[380px] p-12 flex flex-col items-center justify-center gap-6 rounded-2xl cursor-pointer border-2 border-dashed transition-all duration-300 ${
          isDragActive
            ? "border-black bg-zinc-50 scale-[1.01]"
            : "border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50/50"
        } shadow-sm`}
      >
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-black mb-2 animate-bounce-slow">
          <span className="material-symbols-outlined text-[32px] font-light">
            upload_file
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-tight text-center">
          Upload your CV to begin
        </h2>
        
        <p className="text-sm md:text-base text-zinc-500 text-center max-w-[500px] leading-relaxed">
          Drag and drop your resume here, or click to browse. We support PDF formats up to 5MB.
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick();
          }}
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm mt-2"
        >
          Select PDF File
        </button>
        
        <input
          ref={fileInputRef}
          accept=".pdf"
          className="hidden"
          type="file"
          onChange={handleChange}
        />
      </div>

      <p className="text-zinc-500 text-xs text-center mt-6 flex items-center gap-2 justify-center select-none">
        <span className="material-symbols-outlined text-[16px]">lock</span>
        Your resume is secure. We process files in volatile memory without caching.
      </p>
    </section>
  );
}
