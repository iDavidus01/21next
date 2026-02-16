
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Futures Macro | AI Dashboard",
  description: "AI-powered macro outlook for USD Futures trading (ES/NQ). Filters Medium/High impact news and provides volatility context.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Futures Macro | AI Dashboard",
    description: "AI-powered macro outlook for USD Futures trading (ES/NQ).",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary",
    title: "Futures Macro | AI Dashboard",
    description: "AI-powered macro outlook for USD Futures trading (ES/NQ).",
    images: ["/logo.svg"],
  },
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
