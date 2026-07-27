import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";

const siteUrl =
  process.env.SITE_URL ||
  "https://profile-desa-margomulyo.vercel.app";

const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Website Resmi Desa Margomulyo | Panggungrejo, Blitar",
    template:
      "%s | Desa Margomulyo",
  },

  description:
    "Website resmi Desa Margomulyo, Kecamatan Panggungrejo, Kabupaten Blitar. Temukan profil desa, kegiatan, layanan, kelembagaan, perangkat desa, dan produk hukum.",

  applicationName:
    "Website Desa Margomulyo",

  keywords: [
    "Desa Margomulyo",
    "Margomulyo Panggungrejo",
    "Desa Margomulyo Blitar",
    "Panggungrejo Blitar",
    "Website Desa Margomulyo",
    "Pemerintah Desa Margomulyo",
    "Profil Desa Margomulyo",
  ],

  authors: [
    {
      name: "Pemerintah Desa Margomulyo",
    },
  ],

  creator:
    "Pemerintah Desa Margomulyo",

  publisher:
    "Pemerintah Desa Margomulyo",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName:
      "Website Resmi Desa Margomulyo",
    title:
      "Website Resmi Desa Margomulyo | Panggungrejo, Blitar",
    description:
      "Informasi profil, pelayanan, kegiatan, kelembagaan, perangkat desa, dan produk hukum Desa Margomulyo.",
  },

  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <TopBar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
