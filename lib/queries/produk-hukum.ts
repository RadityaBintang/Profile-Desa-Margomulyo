import { prisma } from "@/lib/prisma";

export async function getProdukHukumTerbaru(limit = 4) {
  return prisma.produkHukum.findMany({
    where: { status: "publish" },
    orderBy: [{ tahun: "desc" }, { tanggalDitetapkan: "desc" }],
    take: limit,
  });
}

export async function getSemuaProdukHukum() {
  return prisma.produkHukum.findMany({
    where: { status: "publish" },
    orderBy: [{ tahun: "desc" }, { tanggalDitetapkan: "desc" }],
  });
}
