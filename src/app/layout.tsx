import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أبدالستا | Abidalista - راقب اشتراكاتك",
  description:
    "أداة سعودية لمراجعة وإلغاء الاشتراكات من كشوفات البنوك السعودية. خصوصية كاملة - كل شيء يتم على جهازك.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
