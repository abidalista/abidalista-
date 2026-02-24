"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import AuditReport from "@/components/AuditReport";
import PaywallModal from "@/components/PaywallModal";
import { parseCSV } from "@/lib/banks";
import { analyzeTransactions } from "@/lib/analyzer";
import { AuditReport as Report, SubscriptionStatus } from "@/lib/types";

const FREE_UPLOAD_LIMIT = 1;
const STORAGE_KEY = "yc_uploads_used";

type Step = "landing" | "analyzing" | "results";

const COPY = {
  ar: {
    heroHeadline: "وين رايحة فلوسك؟",
    heroSub: "اكتشف كل الاشتراكات المخفية في كشف حسابك",
    analyzing: "جاري التحليل...",
    analyzingNote: "كل شيء يتم على جهازك",
    errorTitle: "ما قدرنا نقرأ الملف",
    errorNote: "تأكد إن الملف CSV أو PDF وجرب مرة ثانية",
    howTitle: "كيف يشتغل؟",
    step1: "ارفع الكشف",
    step1d: "نزّل كشف الحساب من تطبيق بنكك",
    step2: "نحلّل لك",
    step2d: "نكتشف كل الاشتراكات المتكررة",
    step3: "ألغِ ووفّر",
    step3d: "اختار اللي تبي تلغيه واللي تبي تخليه",
    banksTitle: "يدعم جميع البنوك السعودية",
    subsTitle: "نكتشف اشتراكات مثل",
    badge: "🇸🇦 يدعم جميع البنوك السعودية · بدون تسجيل دخول",
    privacy: "🔒 بياناتك ما تطلع من جهازك",
    footer: "Yalla Cancel · صُنع في السعودية 🇸🇦",
  },
  en: {
    heroHeadline: "Where is your money going?",
    heroSub: "Find every hidden subscription in your bank statement",
    analyzing: "Analyzing...",
    analyzingNote: "Everything stays on your device",
    errorTitle: "Couldn't read the file",
    errorNote: "Make sure the file is CSV or PDF and try again",
    howTitle: "How does it work?",
    step1: "Upload statement",
    step1d: "Download your bank statement from your banking app",
    step2: "We analyze it",
    step2d: "We detect all recurring subscriptions",
    step3: "Cancel & save",
    step3d: "Pick what to cancel and what to keep",
    banksTitle: "Supports all Saudi banks",
    subsTitle: "We detect subscriptions like",
    badge: "🇸🇦 Supports all Saudi banks · No login required",
    privacy: "🔒 Your data never leaves your device",
    footer: "Yalla Cancel · Made in Saudi Arabia 🇸🇦",
  },
};

const FAV = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const BANKS = [
  { ar: "الراجحي",       en: "Al Rajhi",   logo: FAV("alrajhibank.com.sa") },
  { ar: "الأهلي",         en: "SNB",        logo: FAV("alahli.com") },
  { ar: "بنك الرياض",     en: "Riyad Bank", logo: FAV("riyadbank.com") },
  { ar: "البلاد",         en: "Al Bilad",   logo: FAV("bankalbilad.com") },
  { ar: "الإنماء",        en: "Alinma",     logo: FAV("alinma.com") },
  { ar: "الأول (ساب)",    en: "SAB",        logo: FAV("sabb.com") },
  { ar: "الفرنسي",        en: "BSF",        logo: FAV("alfransi.com.sa") },
  { ar: "العربي الوطني",  en: "ANB",        logo: FAV("anb.com.sa") },
  { ar: "stc bank",       en: "stc bank",   logo: FAV("stcbank.com.sa") },
];

const EXAMPLE_SUBS = [
  { name: "Netflix",   logo: FAV("netflix.com") },
  { name: "Spotify",   logo: FAV("spotify.com") },
  { name: "شاهد",      logo: FAV("shahid.mbc.net") },
  { name: "أنغامي",    logo: FAV("anghami.com") },
  { name: "YouTube",   logo: FAV("youtube.com") },
  { name: "Apple",     logo: FAV("apple.com") },
  { name: "Amazon",    logo: FAV("amazon.sa") },
  { name: "Adobe",     logo: FAV("adobe.com") },
  { name: "ChatGPT",   logo: FAV("openai.com") },
  { name: "iCloud",    logo: FAV("icloud.com") },
  { name: "STC Play",  logo: FAV("stcplay.com.sa") },
  { name: "هنقرستيشن", logo: FAV("hungerstation.com") },
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

  async function processCSV(text: string) {
    setStep("analyzing");
    setError(false);

    try {
      const transactions = parseCSV(text, "other");

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

  async function handleFileSelect(file: File) {
    const text = await file.text();
    processCSV(text);
  }

  async function handleTestStatement() {
    setStep("analyzing");
    setError(false);
    try {
      const res = await fetch("/test-statement.csv");
      const text = await res.text();
      processCSV(text);
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
        {/* ── RESULTS ─────────────────────────── */}
        {step === "results" && report && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-black">{ar ? "تقرير اشتراكاتك" : "Your subscription report"}</h1>
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

        {/* ── ANALYZING ──────────────────────────── */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-lg">{c.analyzing}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{c.analyzingNote}</p>
          </div>
        )}

        {/* ── LANDING ────────────────────────────── */}
        {step === "landing" && (
          <>
            {/* ── DARK HERO: centered upload box ── */}
            <section
              className="relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1a2744 50%, #0d2618 100%)",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              {/* Background glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(0,166,81,0.12) 0%, transparent 65%)",
                }}
              />

              <div className="relative z-10 w-full max-w-md">
                {/* Headline */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
                    {ar ? (
                      <>كم اشتراك <em className="not-italic text-[#00A651]">ناسيه؟</em></>
                    ) : (
                      <>How many subscriptions <em className="not-italic text-[#00A651]">forgotten?</em></>
                    )}
                  </h1>
                  <p className="text-white/60 text-base leading-relaxed">
                    {ar
                      ? "ارفع كشف حسابك واكتشف كل الاشتراكات اللي تنخصم منك كل شهر"
                      : "Upload your bank statement and find every subscription draining your account"}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
                    <p className="font-bold text-red-400 mb-1">{c.errorTitle}</p>
                    <p className="text-sm text-red-400/70">{c.errorNote}</p>
                  </div>
                )}

                {/* Upload zone — no card wrapper, floats on dark bg */}
                <UploadZone
                  locale={locale}
                  uploadsUsed={uploadsUsed}
                  freeLimit={FREE_UPLOAD_LIMIT}
                  onFileSelect={handleFileSelect}
                  onTestClick={handleTestStatement}
                  onUpgradeClick={() => setShowPaywall(true)}
                />

                {/* Badge */}
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center gap-2 bg-[#00A651]/15 border border-[#00A651]/30 rounded-full px-4 py-1.5 text-xs font-semibold text-[#00A651]">
                    {c.badge}
                  </span>
                </div>

                {/* Privacy note */}
                <p className="mt-4 text-center text-xs text-white/30">
                  {ar ? "🔒 بياناتك ما تطلع من جهازك أبداً" : "🔒 Your data never leaves your device"}
                </p>
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="bg-white border-b border-[var(--color-border)]">
              <div className="max-w-3xl mx-auto px-4 py-14">
                <h2 className="text-lg font-black text-center mb-10 text-[var(--color-text-secondary)] uppercase tracking-wider text-sm">
                  {c.howTitle}
                </h2>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { title: c.step1, desc: c.step1d, n: "١" },
                    { title: c.step2, desc: c.step2d, n: "٢" },
                    { title: c.step3, desc: c.step3d, n: "٣" },
                  ].map((s) => (
                    <div key={s.n} className="text-center">
                      <div className="w-10 h-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center font-black text-sm mx-auto mb-4">
                        {s.n}
                      </div>
                      <h3 className="font-black mb-1">{s.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── BANKS ── */}
            <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <div className="max-w-4xl mx-auto px-4 py-10">
                <p className="text-xs font-bold text-center text-[var(--color-text-muted)] uppercase tracking-widest mb-7">
                  {c.banksTitle}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {BANKS.map((bank) => (
                    <div
                      key={bank.en}
                      className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-xl px-4 py-2.5 hover:border-[#00A651] transition-colors"
                    >
                      <img src={bank.logo} alt={ar ? bank.ar : bank.en} className="w-6 h-6 rounded object-contain" />
                      <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                        {ar ? bank.ar : bank.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── EXAMPLE SUBS ── */}
            <section className="bg-white border-b border-[var(--color-border)]">
              <div className="max-w-4xl mx-auto px-4 py-10">
                <p className="text-xs font-bold text-center text-[var(--color-text-muted)] uppercase tracking-widest mb-7">
                  {c.subsTitle}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {EXAMPLE_SUBS.map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-2 hover:border-[#00A651] transition-colors"
                    >
                      <img src={sub.logo} alt={sub.name} className="w-5 h-5 rounded-full object-contain" />
                      <span className="text-sm font-semibold">{sub.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-[var(--color-border)] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-[var(--color-text-muted)]">
          {c.footer}
        </div>
      </footer>
    </div>
  );
}
