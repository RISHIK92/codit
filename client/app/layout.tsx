import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant-var",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono-var",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas-var",
});

export const metadata: Metadata = {
  title: "Codit — The Future of Your Workflow",
  description: "A dark, ultra-refined interface for the next generation of digital workspaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmMono.variable} ${bebasNeue.variable}`}
    >
      <body>
        {/* Ambient Orbs */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-[200px] -left-[100px] w-[600px] h-[600px] rounded-full orb-blur opacity-12 animate-drift bg-[radial-gradient(circle,#7fffd4,transparent)]" />
          <div className="absolute -bottom-[100px] -right-[50px] w-[400px] h-[400px] rounded-full orb-blur opacity-12 animate-drift-slow bg-[radial-gradient(circle,#b8a4e8,transparent)]" />
        </div>
        {children}
      </body>
    </html>
  );
}
