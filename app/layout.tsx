import type { Metadata } from "next";
import { Rock_Salt, Special_Elite, Work_Sans } from "next/font/google";
import "./globals.css";

const display = Rock_Salt({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

const stamp = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-stamp"
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://juanditobandito.netlify.app"),
  title: "Juandito Bandito — Photography",
  description: "Editorial, portrait, and travel photography. Postcards from the road.",
  openGraph: {
    title: "Juandito Bandito — Photography",
    description: "Editorial, portrait, and travel photography. Postcards from the road.",
    url: "https://juanditobandito.netlify.app",
    siteName: "Juandito Bandito",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Juandito in a BANDITO cap, reflected among string lights"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Juandito Bandito — Photography",
    description: "Editorial, portrait, and travel photography. Postcards from the road.",
    images: ["/og.jpg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${stamp.variable} ${body.variable}`}>
      <body className="font-body text-ink">{children}</body>
    </html>
  );
}
