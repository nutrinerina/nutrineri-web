import type { Metadata } from "next";
import { Inter, Outfit, Dancing_Script } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800']
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: "Guapas | Nutricionista Integrativa",
  description: "Nutrición que transforma hábitos y mejora tu vida. Acompañamiento personalizado y educación alimentaria sin dietas restrictivas.",
  keywords: ["Nutricionista", "Nutrición", "Alimentación Saludable", "Dieta", "Educación Alimentaria", "Guapas"],
  authors: [{ name: "Guapas" }],
  openGraph: {
    title: "Guapas | Nutricionista",
    description: "Nutrición que transforma hábitos y mejora tu vida. Acompañamiento personalizado y educación alimentaria.",
    type: "website",
    locale: "es_AR",
    siteName: "Guapas Nutrición"
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} ${dancingScript.variable}`}>
      <body className={inter.className}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
