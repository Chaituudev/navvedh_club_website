import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.clubName} | AITRC CSE`,
    template: `%s | ${siteConfig.clubName}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    title: `${siteConfig.clubName} | AITRC CSE`,
    description: siteConfig.description,
    siteName: siteConfig.clubName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.clubName} | AITRC CSE`,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ "--accent": siteConfig.accentHex } as CSSProperties}>{children}</body>
    </html>
  );
}
