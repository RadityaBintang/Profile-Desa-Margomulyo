import { prisma } from "@/lib/prisma";

export async function getLayananAktif() {
  return prisma.layananDesa.findMany({
    where: { status: "aktif" },
    orderBy: { id: "asc" },
  });
}
