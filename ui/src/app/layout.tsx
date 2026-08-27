import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#f7931a",
};

export const metadata: Metadata = {
  title: "Bitcoin Bharat AI — Bitcoin शिक्षा आपकी भाषा में",
  description:
    "Bitcoin education in 14 Indian languages. Ask anything about Bitcoin — in Hindi, Tamil, Telugu, Kannada, and more. Free, forever.",
  openGraph: {
    title: "Bitcoin Bharat AI",
    description:
      "Bitcoin education in your language — Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Marathi, Urdu & more.",
    type: "website",
    siteName: "Bitcoin Bharat AI",
  },
  twitter: {
    card: "summary",
    title: "Bitcoin Bharat AI",
    description: "Ask anything about Bitcoin in any Indian language. Free, forever.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
