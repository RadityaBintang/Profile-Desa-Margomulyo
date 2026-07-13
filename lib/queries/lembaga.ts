import { prisma } from "@/lib/prisma";

export async function getLembagaAktif() {
  return prisma.lembagaDesa.findMany({
    where: { status: "aktif" },
    orderBy: { id: "asc" },
  });
}

export async function getLembagaDetail(id: number) {
  return prisma.lembagaDesa.findUnique({
    where: { id },
    include: { anggota: { orderBy: { urutan: "asc" } } },
  });
}
