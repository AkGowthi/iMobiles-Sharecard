import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const googleSans = localFont({
  src: "./fonts/GoogleSans-VariableFont.ttf",
  variable: "--font-google-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShareCard - NFC Visiting Cards",
  description: "Modern, professional NFC visiting cards for business professionals.",
};

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

// ... existing code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${googleSans.variable} ${ubuntu.variable} antialiased bg-white text-gray-900 font-sans flex flex-col min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
