import { prisma } from "@/lib/prisma";

export async function getKegiatanTerbaru(limit = 3) {
  return prisma.kegiatan.findMany({
    where: { status: "publish" },
    orderBy: { tanggal: "desc" },
    take: limit,
  });
}

export async function getSemuaKegiatan() {
  return prisma.kegiatan.findMany({
    where: { status: "publish" },
    orderBy: { tanggal: "desc" },
  });
}

export async function getKegiatanBySlug(slug: string) {
  return prisma.kegiatan.findUnique({ where: { slug } });
}
