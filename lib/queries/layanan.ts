import { prisma } from "@/lib/prisma";

export async function getLayananAktif() {
  // Diurutkan pakai `urutan` saja (bukan kategori dulu) supaya admin bisa
  // mengatur urutan KATEGORI juga secara implisit lewat angka urutan item
  // di dalamnya — kategori yang berisi item dengan urutan terkecil akan
  // tampil paling atas. Pengelompokan per kategori dilakukan di komponen.
  return prisma.layananDesa.findMany({
    where: { status: "aktif" },
    orderBy: [{ urutan: "asc" }, { id: "asc" }],
  });
}

export async function getLayananById(id: number) {
  return prisma.layananDesa.findUnique({ where: { id } });
}

export async function getKategoriLayanan() {
  const rows = await prisma.layananDesa.findMany({
    distinct: ["kategori"],
    select: { kategori: true },
    orderBy: { kategori: "asc" },
  });
  return rows.map((row) => row.kategori);
}