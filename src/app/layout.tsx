import type { Metadata, Viewport } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nuuyoma Senior Secondary School | Oshikuku, Namibia",
    template: "%s | Nuuyoma Senior Secondary School",
  },
  description:
    "Nuuyoma Senior Secondary School is a state secondary school in Oshikuku, Omusati Region, Namibia, offering Grades 8 to 12 with boarding facilities.",
  applicationName: "Nuuyoma Senior Secondary School",
  keywords: [
    "Nuuyoma Senior Secondary School",
    "NSSS",
    "Oshikuku school",
    "Omusati secondary school",
    "Namibia secondary school",
    "school admissions Namibia",
  ],
  authors: [{ name: "Nuuyoma Senior Secondary School" }],
  openGraph: {
    type: "website",
    siteName: "Nuuyoma Senior Secondary School",
    title: "Nuuyoma Senior Secondary School",
    description:
      "A state senior secondary school in Oshikuku, Omusati Region, Namibia. Grades 8–12, boarding and a community built on knowledge, discipline and service.",
    images: [{ url: "/assets/school-crest.webp", width: 512, height: 512, alt: "NSSS crest" }],
  },
  twitter: {
    card: "summary",
    title: "Nuuyoma Senior Secondary School",
    description: "Grades 8–12 · Oshikuku, Omusati Region, Namibia",
    images: ["/assets/school-crest.webp"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0d6db7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${baloo.variable}`}>
      <body className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
