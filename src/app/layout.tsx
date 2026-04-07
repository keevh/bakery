import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rollin. | Panaderia Artesanal NYC",
  description:
    "Panaderia artesanal bilingue para wholesale, catering y pedidos especiales.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#FDFBF7] text-[#3C2317] antialiased`}>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
