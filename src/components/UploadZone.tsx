"use client";

import { useRef, useState } from "react";

interface UploadZoneProps {
  locale: "ar" | "en";
  uploadsUsed: number;
  freeLimit: number;
  onFileSelect: (file: File) => void;
  onTestClick: () => void;
  onUpgradeClick: () => void;
}

export default function UploadZone({
  locale,
  uploadsUsed,
  freeLimit,
  onFileSelect,
  onTestClick,
  onUpgradeClick,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ar = locale === "ar";

  const isLocked = freeLimit - uploadsUsed <= 0;

  function handleFile(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "pdf") {
      alert(ar ? "الملف لازم يكون CSV أو PDF" : "File must be CSV or PDF");
      return;
    }
    onFileSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (isLocked) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔒</div>
        <p className="font-black text-xl text-white mb-2">
          {ar ? "وصلت للحد المجاني" : "Free limit reached"}
        </p>
        <p className="text-sm text-white/60 mb-6">
          {ar ? "ادفع مرة وحدة وحلّل كشوفات بلا حدود" : "Pay once for unlimited analysis"}
        </p>
        <button
          onClick={onUpgradeClick}
          className="bg-[#00A651] text-white font-bold px-8 py-3 rounded-2xl hover:bg-[#00C060] transition-all"
        >
          {ar ? "ترقية — ٤٩ ريال" : "Upgrade — 49 SAR"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center gap-3
          py-14 px-8 text-center transition-all duration-200
          ${dragging
            ? "border-[#00A651] bg-[#00A651]/10"
            : "border-white/25 hover:border-[#00A651] hover:bg-[#00A651]/5"
          }
        `}
      >
        <div className="text-5xl select-none">📄</div>
        <p className="font-bold text-white text-lg leading-snug">
          {ar ? "حط الملف هنا" : "Drop your file here"}
        </p>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold bg-white/10 text-white/60 rounded px-2 py-0.5 uppercase tracking-wider">CSV</span>
          <span className="text-[10px] font-bold bg-white/10 text-white/60 rounded px-2 py-0.5 uppercase tracking-wider">PDF</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Primary button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 w-full bg-[#00A651] hover:bg-[#00C060] text-white font-bold text-base py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-[#00A651]/30"
      >
        {ar ? "اختر الملف" : "Choose file"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/35">{ar ? "أو" : "or"}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Sample button */}
      <button
        onClick={onTestClick}
        className="w-full border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold text-sm py-3.5 rounded-2xl transition-all bg-white/5 hover:bg-white/10"
      >
        {ar ? "🧪 جرّب بمثال جاهز" : "🧪 Try with sample data"}
      </button>
    </div>
  );
}
