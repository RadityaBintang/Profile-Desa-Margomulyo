import { prisma } from "@/lib/prisma";

export async function getProfilDesa() {
  return prisma.profilDesa.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      namaDesa: true,
      kecamatan: true,
      kabupaten: true,
      provinsi: true,
      alamat: true,
      email: true,
      telepon: true,
      whatsapp: true,
      deskripsi: true,
      visi: true,
      misi: true,
      logo: true,
      fotoKantor: true,
      mapsEmbed: true,
    },
  });
}