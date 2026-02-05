"use client";

import { Locale, t } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Header({ locale, onLocaleChange }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">أ</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            {t(locale, "appName")}
          </h1>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => onLocaleChange(locale === "ar" ? "en" : "ar")}
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary)]/5"
          >
            {t(locale, "language")}
          </button>
        </nav>
      </div>
    </header>
  );
}
