import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSeriif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "Horizon",
  description: "Banking platform for the future",
  icons: '/icons/logo.svg',
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSeriif.variable}`}>{children}</body>
    </html>
  );
}
