import { prisma } from "@/lib/prisma";

export async function getKontakDesa() {
  return prisma.kontakDesa.findMany({ orderBy: { id: "asc" } });
}
