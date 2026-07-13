import { prisma } from "@/lib/prisma";

export async function getKegiatanTerbaru() {
  return prisma.kegiatan.findMany({
    where: {
      status: "publish" as any,
    },
    orderBy: {
      tanggal: "desc",
    },
    take: 3,
    select: {
      id: true,
      judul: true,
      slug: true,
      tanggal: true,
      lokasi: true,
      ringkasan: true,
      gambar: true,
      status: true,
    },
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
