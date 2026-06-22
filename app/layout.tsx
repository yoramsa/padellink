import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mazaly Digital · בניית אתרים ופלטפורמות בתל אביב",
  description:
    "סוכנות דיגיטל ישראלית בתל אביב. בונים אתרים ופלטפורמות מקצועיים תוך שבועיים — עברית, צרפתית ואנגלית.",
  keywords: [
    "בניית אתרים",
    "סוכנות דיגיטל",
    "תל אביב",
    "פלטפורמה",
    "Next.js",
    "agence web Tel Aviv"
  ],
  openGraph: {
    title: "Mazaly Digital",
    description: "סוכנות דיגיטל ישראלית — אתרים ופלטפורמות תוך שבועיים.",
    locale: "he_IL",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#060B1E",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="page-bg">{children}</body>
    </html>
  );
}
