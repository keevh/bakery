import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bakery | Panaderia Colombiana en NYC",
  description:
    "Panaderia colombiana artesanal en Nueva York para venta al por mayor y pedidos especiales.",
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#FDFBF7] text-[#3C2317] antialiased`}>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
