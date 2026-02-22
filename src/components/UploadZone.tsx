"use client";

import { useRef, useState } from "react";
import { BankId } from "@/lib/types";

const BANKS: { id: BankId; ar: string; en: string; abbr: string; color: string }[] = [
  { id: "alrajhi",  ar: "الراجحي",        en: "Al Rajhi",    abbr: "ر",  color: "#0066B2" },
  { id: "snb",      ar: "الأهلي",          en: "SNB",         abbr: "أ",  color: "#006633" },
  { id: "riyadbank",ar: "بنك الرياض",      en: "Riyad Bank",  abbr: "ري", color: "#005BAA" },
  { id: "albilad",  ar: "البلاد",          en: "Al Bilad",    abbr: "ب",  color: "#8B6C00" },
  { id: "alinma",   ar: "الإنماء",         en: "Alinma",      abbr: "إن", color: "#5B2D8E" },
  { id: "sabb",     ar: "ساب",             en: "SABB",        abbr: "س",  color: "#007A3D" },
  { id: "bsf",      ar: "الفرنسي",         en: "BSF",         abbr: "ف",  color: "#002B5C" },
  { id: "anb",      ar: "العربي الوطني",   en: "ANB",         abbr: "ع",  color: "#C8102E" },
  { id: "other",    ar: "بنك آخر",         en: "Other",       abbr: "؟",  color: "#6B7280" },
];

interface UploadZoneProps {
  locale: "ar" | "en";
  uploadsUsed: number;
  freeLimit: number;
  onFileSelect: (file: File, bank: BankId) => void;
  onUpgradeClick: () => void;
}

export default function UploadZone({
  locale,
  uploadsUsed,
  freeLimit,
  onFileSelect,
  onUpgradeClick,
}: UploadZoneProps) {
  const [selectedBank, setSelectedBank] = useState<BankId | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ar = locale === "ar";

  const uploadsLeft = freeLimit - uploadsUsed;
  const isLocked = uploadsLeft <= 0;

  function handleFile(file: File) {
    if (!selectedBank) {
      alert(ar ? "اختر بنكك أولاً" : "Please select your bank first");
      return;
    }
    if (!file.name.endsWith(".csv")) {
      alert(ar ? "الملف لازم يكون بصيغة CSV" : "File must be a CSV");
      return;
    }
    onFileSelect(file, selectedBank);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-6">
      {/* Bank Selector */}
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
          {ar ? "١. اختر بنكك" : "1. Select your bank"}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => setSelectedBank(bank.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                selectedBank === bank.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-bg)] shadow-sm"
                  : "border-[var(--color-border)] hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: bank.color }}
              >
                {bank.abbr}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] leading-tight">
                {ar ? bank.ar : bank.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
          {ar ? "٢. ارفع كشف الحساب" : "2. Upload your statement"}
        </p>

        {isLocked ? (
          <div className="upload-zone border-orange-200 bg-orange-50">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-bold text-[var(--color-text-primary)] mb-1">
              {ar ? "وصلت للحد المجاني" : "Free limit reached"}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {ar
                ? "رفعت كشف مجاني. ادفع مرة وحدة وحلّل كشوفات بلا حدود"
                : "You've used your free upload. Pay once for unlimited uploads"}
            </p>
            <button onClick={onUpgradeClick} className="btn-primary">
              {ar ? "ترقية — ٤٩ ر.س مرة واحدة" : "Upgrade — 49 SAR once"}
            </button>
          </div>
        ) : (
          <>
            <div
              className={`upload-zone ${dragging ? "drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => selectedBank && fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-4">📊</div>
              <p className="font-bold text-lg text-[var(--color-text-primary)] mb-1">
                {ar ? "اسحب ملف CSV هنا" : "Drag a CSV file here"}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {ar ? "أو اضغط للاختيار من جهازك" : "or click to browse your device"}
              </p>
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedBank) {
                    alert(ar ? "اختر بنكك أولاً" : "Select your bank first");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
              >
                {ar ? "اختر ملف" : "Choose file"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            {/* Upload counter */}
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-xs text-[var(--color-text-muted)]">
                {ar
                  ? `تنزيل الكشف: الإعدادات ← المعاملات ← تصدير CSV`
                  : "Export from: Settings → Transactions → Export CSV"}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {ar
                  ? `${uploadsLeft} من ${freeLimit} مجاني`
                  : `${uploadsLeft} of ${freeLimit} free`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
