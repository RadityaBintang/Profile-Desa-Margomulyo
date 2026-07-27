import type {
  MetadataRoute,
} from "next";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

const siteUrl =
  process.env.SITE_URL ||
  "https://profile-desa-margomulyo.vercel.app";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const kegiatan =
    await prisma.kegiatan.findMany({
      where: {
        status: "publish" as any,
      },

      select: {
        id: true,
        slug: true,
      },

      orderBy: {
        tanggal: "desc",
      },
    });

  const halamanUtama:
    MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/profil`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url:
        `${siteUrl}/profil/visi-misi`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url:
        `${siteUrl}/profil/perangkat-desa`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url:
        `${siteUrl}/profil/struktur-organisasi`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kegiatan`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/layanan`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url:
        `${siteUrl}/produk-hukum`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kontak`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const halamanKegiatan:
    MetadataRoute.Sitemap =
    kegiatan.map((item) => ({
      url:
        `${siteUrl}/kegiatan/${
          item.slug || item.id
        }`,

      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...halamanUtama,
    ...halamanKegiatan,
  ];
}