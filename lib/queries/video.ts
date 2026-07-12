import { prisma } from "@/lib/prisma";

export async function getVideoProfilAktif() {
  return prisma.videoProfil.findFirst({ where: { status: "aktif" }, orderBy: { id: "desc" } });
}
