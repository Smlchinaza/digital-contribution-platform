import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.example.com"),
  title: "My Website Name",
  description: "A short, compelling description of what my site is about.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "My Website Name",
    description: "A short, compelling description of what my site is about.",
    type: "website",
    url: "/",
    siteName: "My Website Name",
    locale: "en_US",
    images: [
      {
        url: "/og/hero.jpg",
        width: 1200,
        height: 630,
        alt: "A descriptive alt text of the hero image",
      },
      {
        url: "/og/hero.webp",
        width: 1200,
        height: 630,
        alt: "A descriptive alt text of the hero image (WebP)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Website Name",
    description: "A short, compelling description of what my site is about.",
    images: ["/og/hero.jpg"],
  },
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/church-logo.jpg" type="image/jpeg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
