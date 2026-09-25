import type { Metadata } from "next";
import { Homemade_Apple, Special_Elite, Work_Sans } from "next/font/google";
import "./globals.css";

const display = Homemade_Apple({
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
  title: "Juandito — Photography",
  description: "Editorial, portrait, and travel photography. Postcards from the road."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${stamp.variable} ${body.variable}`}>
      <body className="font-body text-ink">{children}</body>
    </html>
  );
}
