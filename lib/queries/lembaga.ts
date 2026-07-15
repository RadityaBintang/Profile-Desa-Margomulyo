import { prisma } from "@/lib/prisma";

export async function getLembagaAktif() {
  return prisma.lembagaDesa.findMany({
    where: {
      status: "aktif" as any,
    },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      namaLembaga: true,
      singkatan: true,
      deskripsi: true,
      ikon: true,
    },
  });
}