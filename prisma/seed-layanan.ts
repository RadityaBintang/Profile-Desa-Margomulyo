/**
 * Migrasi satu kali: pindahkan data lama dari lib/data/LayananPublik.ts
 * (statis) ke tabel `layanan_desa` di database.
 *
 * Cara pakai (jalankan sekali saja):
 *   npx tsx prisma/seed-layanan.ts
 *
 * Aman dijalankan berkali-kali — item yang sudah ada (dicek dari kombinasi
 * namaLayanan + kategori) akan di-skip, tidak dobel.
 *
 * Catatan: item yang di file lama punya `subsections` (Kartu Keluarga,
 * Kartu Tanda Penduduk) di-"ratakan" jadi teks biasa per baris, karena
 * struktur admin yang baru cuma mendukung daftar syarat satu tingkat.
 * Judul sub-bagiannya tetap disimpan sebagai baris tersendiri.
 */
import { PrismaClient } from "@prisma/client";
import { layananSections } from "../lib/data/LayananPublik";

const prisma = new PrismaClient();

function flattenPersyaratan(persyaratan: (typeof layananSections)[number]["items"][number]["persyaratan"]) {
  if (persyaratan.belumTersedia) return null;

  const lines: string[] = [];

  if (persyaratan.intro) lines.push(persyaratan.intro);
  if (persyaratan.list) lines.push(...persyaratan.list);

  if (persyaratan.subsections) {
    for (const sub of persyaratan.subsections) {
      lines.push(`${sub.title}:`);
      lines.push(...sub.list);
    }
  }

  if (persyaratan.catatan) {
    lines.push("Catatan:");
    lines.push(...persyaratan.catatan);
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

async function main() {
  let urutan = 0;
  let dibuat = 0;
  let dilewati = 0;

  for (const section of layananSections) {
    for (const item of section.items) {
      urutan += 1;

      const sudahAda = await prisma.layananDesa.findFirst({
        where: { namaLayanan: item.title, kategori: section.title },
      });

      if (sudahAda) {
        dilewati += 1;
        continue;
      }

      await prisma.layananDesa.create({
        data: {
          namaLayanan: item.title,
          kategori: section.title,
          deskripsi: item.description || null,
          persyaratan: flattenPersyaratan(item.persyaratan),
          ikon: null,
          tampilanBesar: section.layout === "single",
          urutan,
          status: "aktif",
        },
      });
      dibuat += 1;
    }
  }

  console.log(`Selesai. ${dibuat} layanan dibuat, ${dilewati} dilewati (sudah ada).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });