import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
