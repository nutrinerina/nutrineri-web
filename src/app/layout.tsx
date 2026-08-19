import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-outfit", // Keeping the variable name to avoid breaking css that uses it
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerina Bruno | Nutricionista Integrativa",
  description: "Nutrición que transforma hábitos y mejora tu vida. Acompañamiento personalizado y educación alimentaria sin dietas restrictivas.",
  keywords: ["Nutricionista", "Nutrición", "Alimentación Saludable", "Dieta", "Educación Alimentaria", "Nerina Bruno"],
  authors: [{ name: "Nerina Bruno" }],
  openGraph: {
    title: "Nerina Bruno | Nutricionista",
    description: "Nutrición que transforma hábitos y mejora tu vida. Acompañamiento personalizado y educación alimentaria.",
    type: "website",
    locale: "es_AR",
    siteName: "Nerina Bruno Nutrición"
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
