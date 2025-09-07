// app/layout.tsx - Updated for Next.js App Router with modern patterns
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { ToastProvider } from "@/providers/ToastProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MathPet - Make Math Fun for Primary School Students",
  description: "MathPet combines interactive math problems with virtual pets to create an engaging learning experience for Singapore primary school students.",
  keywords: ["math", "education", "primary school", "Singapore", "gamification", "learning"],
  authors: [{ name: "MathPet Team" }],
  creator: "MathPet",
  publisher: "MathPet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mathpet.sg"),
  openGraph: {
    title: "MathPet - Make Math Fun",
    description: "Interactive math learning platform for Singapore primary school students",
    type: "website",
    locale: "en_SG",
    siteName: "MathPet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Add your verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}