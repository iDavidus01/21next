
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "USD Futures | AI Macro Dashboard",
  description: "AI-powered macro outlook for USD Futures trading (ES/NQ). Filters Medium/High impact news and provides volatility context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
