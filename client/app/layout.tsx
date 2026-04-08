import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Bebas_Neue } from "next/font/google";
import AuthInitializer from "@/components/AuthInitializer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Codit",
  description: "The future of your workflow starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmMono.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono text-[var(--text-primary)]">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
