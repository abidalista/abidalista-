"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import AuditReport from "@/components/AuditReport";
import PaywallModal from "@/components/PaywallModal";
import { parseCSV } from "@/lib/banks";
import { analyzeTransactions } from "@/lib/analyzer";
import { AuditReport as Report, BankId, SubscriptionStatus } from "@/lib/types";

const FREE_UPLOAD_LIMIT = 1;
const STORAGE_KEY = "yc_uploads_used";

type Step = "landing" | "analyzing" | "results";

const COPY = {
  ar: {
    heroHeadline: "وين رايحة فلوسك؟",
    heroSub:
      "كل شهر تنخصم من حسابك مبالغ ما تتوقعها — اشتراكات نسيتها، أو ما تستخدمها، أو ما تدري بها.",
    heroPrivacy: "🔒 بياناتك ما تطلع من جهازك — كل التحليل في متصفحك",
    testBtn: "🧪 جرب بكشف تجريبي",
    step1: "ارفع الكشف",
    step1d: "نزّل كشف الحساب CSV من تطبيق بنكك",
    step2: "نحلّل لك",
    step2d: "نكتشف كل الاشتراكات المتكررة في ثواني",
    step3: "ألغِ ووفّر",
    step3d: "اختار اللي تبي تلغيه واللي تبي تخليه",
    analyzing: "جاري التحليل...",
    analyzingNote: "كل شيء يتم على جهازك",
    errorTitle: "ما قدرنا نقرأ الملف",
    errorNote:
      "تأكد إن الملف CSV وإنك اخترت البنك الصح. بعض البنوك تصدر الكشف بتنسيق مختلف.",
    banks: "البنوك المدعومة",
    footer: "Yalla Cancel · صُنع في السعودية 🇸🇦 · مفتوح المصدر",
    howTitle: "كيف يشتغل؟",
  },
  en: {
    heroHeadline: "Where is your money going?",
    heroSub:
      "Every month, charges hit your account you don't expect — subscriptions you forgot, don't use, or never noticed.",
    heroPrivacy: "🔒 Your data never leaves your device — all analysis runs in your browser",
    testBtn: "🧪 Try with test statement",
    step1: "Upload statement",
    step1d: "Download your bank statement as CSV from your banking app",
    step2: "We analyze it",
    step2d: "We detect all recurring subscriptions in seconds",
    step3: "Cancel & save",
    step3d: "Pick what to cancel and what to keep",
    analyzing: "Analyzing...",
    analyzingNote: "Everything stays on your device",
    errorTitle: "Couldn't read the file",
    errorNote:
      "Make sure the file is CSV and you selected the right bank. Some banks export in a different format.",
    banks: "Supported banks",
    footer: "Yalla Cancel · Made in Saudi Arabia 🇸🇦 · Open Source",
    howTitle: "How does it work?",
  },
};

const SUPPORTED_BANKS = [
  { ar: "الراجحي",      en: "Al Rajhi",   color: "#0066B2" },
  { ar: "الأهلي",        en: "SNB",        color: "#006633" },
  { ar: "بنك الرياض",    en: "Riyad Bank", color: "#005BAA" },
  { ar: "البلاد",        en: "Al Bilad",   color: "#8B6C00" },
  { ar: "الإنماء",       en: "Alinma",     color: "#5B2D8E" },
  { ar: "ساب",           en: "SABB",       color: "#007A3D" },
  { ar: "الفرنسي",       en: "BSF",        color: "#002B5C" },
  { ar: "العربي الوطني", en: "ANB",        color: "#C8102E" },
];

export default function HomePage() {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [step, setStep] = useState<Step>("landing");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [uploadsUsed, setUploadsUsed] = useState(0);

  const c = COPY[locale];
  const ar = locale === "ar";

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    setUploadsUsed(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("dir", ar ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", locale);
  }, [locale, ar]);

  async function processCSV(text: string, bank: BankId) {
    setStep("analyzing");
    setError(false);

    try {
      const transactions = parseCSV(text, bank);

      if (transactions.length === 0) {
        setError(true);
        setStep("landing");
        return;
      }

      const result = analyzeTransactions(transactions);
      setReport(result);

      const newCount = uploadsUsed + 1;
      setUploadsUsed(newCount);
      localStorage.setItem(STORAGE_KEY, String(newCount));

      setStep("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(true);
      setStep("landing");
    }
  }

  async function handleFileSelect(file: File, bank: BankId) {
    const text = await file.text();
    processCSV(text, bank);
  }

  async function handleTestStatement() {
    setStep("analyzing");
    setError(false);

    try {
      const res = await fetch("/test-statement.csv");
      const text = await res.text();
      processCSV(text, "other");
    } catch {
      setError(true);
      setStep("landing");
    }
  }

  function handleStatusChange(id: string, status: SubscriptionStatus) {
    if (!report) return;
    setReport({
      ...report,
      subscriptions: report.subscriptions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    });
  }

  function handleStartOver() {
    setStep("landing");
    setReport(null);
    setError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        onLogoClick={() => { setStep("landing"); setReport(null); window.scrollTo({ top: 0 }); }}
      />

      {showPaywall && (
        <PaywallModal locale={locale} onClose={() => setShowPaywall(false)} />
      )}

      <main className="flex-1">
        {/* ── RESULTS VIEW ─────────────────────────────────── */}
        {step === "results" && report && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-[var(--color-text-primary)]">
                {ar ? "تقرير اشتراكاتك" : "Your subscription report"}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {ar
                  ? `حللنا ${report.analyzedTransactions} عملية وطلعنا ${report.subscriptions.length} اشتراك متكرر`
                  : `Analyzed ${report.analyzedTransactions} transactions, found ${report.subscriptions.length} recurring subscriptions`}
              </p>
            </div>
            <AuditReport
              report={report}
              locale={locale}
              onStatusChange={handleStatusChange}
              onStartOver={handleStartOver}
              onUpgradeClick={() => setShowPaywall(true)}
            />
          </div>
        )}

        {/* ── ANALYZING STATE ───────────────────────────────── */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-lg">{c.analyzing}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{c.analyzingNote}</p>
          </div>
        )}

        {/* ── LANDING VIEW ──────────────────────────────────── */}
        {step === "landing" && (
          <>
            {/* Hero + Upload — all above the fold */}
            <section className="max-w-3xl mx-auto px-4 pt-12 pb-8">
              {/* Headline */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[var(--color-primary-bg)] border border-[var(--color-primary)]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--color-primary)] mb-5">
                  🇸🇦 {ar ? "للبنوك السعودية · مجاناً · بدون تسجيل" : "Saudi banks · Free · No sign-up"}
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] leading-tight mb-3">
                  {c.heroHeadline}
                </h1>

                <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
                  {c.heroSub}
                </p>
              </div>

              {/* Upload card — directly in the hero */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="font-bold text-red-700 mb-1">{c.errorTitle}</p>
                  <p className="text-sm text-red-600">{c.errorNote}</p>
                </div>
              )}

              <div className="card shadow-sm">
                <UploadZone
                  locale={locale}
                  uploadsUsed={uploadsUsed}
                  freeLimit={FREE_UPLOAD_LIMIT}
                  onFileSelect={handleFileSelect}
                  onUpgradeClick={() => setShowPaywall(true)}
                />
              </div>

              {/* Test statement button */}
              <div className="text-center mt-4">
                <button
                  onClick={handleTestStatement}
                  className="btn-ghost text-sm"
                >
                  {c.testBtn}
                </button>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {ar
                    ? "ما عندك كشف حساب؟ جرب بكشف وهمي وشوف كيف يشتغل"
                    : "Don't have a statement? Try with sample data to see how it works"}
                </p>
              </div>

              <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
                {c.heroPrivacy}
              </p>
            </section>

            {/* How it works */}
            <section className="bg-white border-y border-[var(--color-border)]">
              <div className="max-w-5xl mx-auto px-4 py-12">
                <h2 className="text-xl font-black text-center mb-8 text-[var(--color-text-primary)]">
                  {c.howTitle}
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { n: "1", title: c.step1, desc: c.step1d, icon: "📤" },
                    { n: "2", title: c.step2, desc: c.step2d, icon: "🔍" },
                    { n: "3", title: c.step3, desc: c.step3d, icon: "✂️" },
                  ].map((s) => (
                    <div key={s.n} className="text-center">
                      <div className="w-14 h-14 bg-[var(--color-primary-bg)] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                        {s.icon}
                      </div>
                      <h3 className="font-bold mb-1">{s.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Supported banks */}
            <section className="max-w-5xl mx-auto px-4 py-12">
              <p className="text-xs font-semibold text-center text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
                {c.banks}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {SUPPORTED_BANKS.map((bank) => (
                  <div
                    key={bank.en}
                    className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-xl px-3 py-2"
                  >
                    <div
                      className="w-6 h-6 rounded-md flex-shrink-0"
                      style={{ backgroundColor: bank.color }}
                    />
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {ar ? bank.ar : bank.en}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy note */}
            <section className="bg-[var(--color-primary-bg)] border-t border-[var(--color-primary)]/10">
              <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-bold mb-1">
                  {ar ? "خصوصيتك أولاً" : "Privacy first"}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                  {ar
                    ? "كل التحليل يتم في متصفحك — ملف الكشف ما يروح لأي سيرفر. بياناتك البنكية تبقى عندك."
                    : "All analysis runs in your browser — your statement file never reaches any server. Your financial data stays with you."}
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-[var(--color-text-muted)]">
          {c.footer}
        </div>
      </footer>
    </div>
  );
}
