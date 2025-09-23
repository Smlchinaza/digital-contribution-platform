import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://www.stpetersthinkerscorner.com"),
  title: "St Peter's Anglican Church, Thinker's Corner, Enugu",
  description: "Welcome to Mount Zion, Our ultimate goal is to make you eat the undiluted word of God, to enable you grow to maturity in Christ Jesus.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "St Peter's Anglican Church, Thinker's Corner, Enugu",
    description: "Welcome to Mount Zion, Our ultimate goal is to make you eat the undiluted word of God, to enable you grow to maturity in Christ Jesus.",
    type: "website",
    url: "/",
    siteName: "St Peter's Anglican Church, Thinker's Corner, Enugu",
    locale: "en_US",
    images: [
      {
        url: "/images/church-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Church logo",
      },
      {
        url: "/images/church-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Church logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "St Peter's Anglican Church, Thinker's Corner, Enugu",
    description: "Welcome to Mount Zion, Our ultimate goal is to make you eat the undiluted word of God, to enable you grow to maturity in Christ Jesus.",
    images: ["/images/church-logo.jpg"],
  },
};

export const viewport: Viewport = {
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
