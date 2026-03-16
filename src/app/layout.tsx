import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AetherFlow – AI-Powered Team Task Manager",
  description:
    "Collaborative task management with realtime updates and AI assistance. Built with Next.js 16, Supabase, and Groq.",
  metadataBase: new URL("https://aetherflow.vercel.app"), // change later to your real domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
