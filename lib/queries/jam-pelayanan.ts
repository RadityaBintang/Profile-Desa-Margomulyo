import { prisma } from "@/lib/prisma";

export async function getJamPelayanan() {
  return prisma.jamPelayanan.findMany({ orderBy: { urutan: "asc" } });
}
