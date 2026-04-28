import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

// FIXED: Added weights 400 and 700 here
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"], 
  display: "swap",
});

export const metadata: Metadata = {
  title: "COECS-LGU Student Activity Management System",
  description: "Manage student attendance, events, fines, and clearance status",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning // Prevents browser extension errors
    >
      <body className="min-h-full flex min-w-full flex-col bg-navy text-cream font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}