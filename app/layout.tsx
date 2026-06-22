import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mazaly — Le média de la communauté francophone en Israël",
    template: "%s · Mazaly"
  },
  description:
    "Mazaly, le média communautaire des francophones en Israël : actualités, blog, bonnes adresses et vie de la communauté.",
  keywords: [
    "francophones Israël",
    "communauté française Israël",
    "alyah",
    "bonnes adresses Israël",
    "actualité Israël"
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mazaly",
    title: "Mazaly — Le média de la communauté francophone en Israël",
    description:
      "Actualités, blog et bonnes adresses pour les francophones d'Israël."
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
