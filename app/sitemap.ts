import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const siteUrl =
  process.env.SITE_URL?.replace(/\/$/, "") ||
  "https://profile-desa-margomulyo.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/profil`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/profil/visi-misi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/profil/perangkat-desa`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/profil/struktur-organisasi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kegiatan`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/layanan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/produk-hukum`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kontak`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const kegiatan = await prisma.kegiatan.findMany({
      where: {
        status: "publish" as never,
      },
      select: {
        id: true,
        slug: true,
        tanggal: true,
        updatedAt: true,
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    const kegiatanPages: MetadataRoute.Sitemap =
      kegiatan.map((item) => ({
        url: `${siteUrl}/kegiatan/${encodeURIComponent(
          item.slug || String(item.id)
        )}`,
        lastModified:
          item.updatedAt || item.tanggal,
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [...staticPages, ...kegiatanPages];
  } catch (error) {
    console.error(
      "Gagal mengambil kegiatan untuk sitemap:",
      error
    );

    // Sitemap tetap menghasilkan HTTP 200 berisi halaman statis.
    return staticPages;
  }
}