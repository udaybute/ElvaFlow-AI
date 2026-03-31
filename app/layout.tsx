import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElvaFlow AI — LinkedIn Post Generator",
  description:
    "Generate professional LinkedIn posts and images with AI. Free, fast, and beautifully crafted content in seconds.",
  openGraph: {
    title: "ElvaFlow AI",
    description: "AI-powered LinkedIn post generator by Elvatrixa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
