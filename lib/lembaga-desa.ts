import { prisma } from "@/lib/prisma";

export const LEMBAGA_DESA_ITEMS = [
  {
    slug: "bpd",
    label: "BPD",
    namaLembaga: "Badan Permusyawaratan Desa",
    singkatan: "BPD",
    deskripsi:
      "Badan Permusyawaratan Desa yang berfungsi menampung dan menyalurkan aspirasi masyarakat desa.",
    matches: ["BPD", "Badan Permusyawaratan Desa"],
  },
  {
    slug: "pkk",
    label: "PKK",
    namaLembaga: "Pemberdayaan dan Kesejahteraan Keluarga",
    singkatan: "PKK",
    deskripsi:
      "Lembaga kemasyarakatan yang berperan dalam pemberdayaan dan kesejahteraan keluarga.",
    matches: ["PKK", "Pemberdayaan dan Kesejahteraan Keluarga"],
  },
  {
    slug: "rt-rw",
    label: "RT/RW",
    namaLembaga: "Rukun Tetangga dan Rukun Warga",
    singkatan: "RT/RW",
    deskripsi:
      "Lembaga yang membantu pelayanan masyarakat di tingkat lingkungan RT dan RW.",
    matches: ["RT/RW", "Rukun Tetangga dan Rukun Warga"],
  },
  {
    slug: "karang-taruna",
    label: "Karang Taruna",
    namaLembaga: "Karang Taruna",
    singkatan: "Karang Taruna",
    deskripsi:
      "Organisasi sosial kepemudaan yang berperan dalam kegiatan sosial dan pemberdayaan pemuda desa.",
    matches: ["Karang Taruna"],
  },
  {
    slug: "lpmd",
    label: "LPMD",
    namaLembaga: "Lembaga Pemberdayaan Masyarakat Desa",
    singkatan: "LPMD",
    deskripsi:
      "Lembaga yang membantu pemerintah desa dalam perencanaan dan pelaksanaan pembangunan desa.",
    matches: ["LPMD", "Lembaga Pemberdayaan Masyarakat Desa"],
  },
] as const;

export type LembagaSlug = (typeof LEMBAGA_DESA_ITEMS)[number]["slug"];

export function getLembagaMeta(slug: string) {
  return LEMBAGA_DESA_ITEMS.find((item) => item.slug === slug) || null;
}

const lembagaSelect = {
  id: true,
  namaLembaga: true,
  singkatan: true,
  deskripsi: true,
  gambarKepengurusan: true,
};

export async function findLembagaBySlug(slug: string) {
  const meta = getLembagaMeta(slug);

  if (!meta) return null;

  const matches = [...meta.matches];

  return prisma.lembagaDesa.findFirst({
    where: {
      OR: [
        {
          singkatan: {
            in: matches,
          },
        },
        {
          namaLembaga: {
            in: matches,
          },
        },
      ],
    },
    select: lembagaSelect,
  });
}

export async function getOrCreateLembagaBySlug(slug: string) {
  const meta = getLembagaMeta(slug);

  if (!meta) {
    throw new Error("Lembaga desa tidak ditemukan.");
  }

  const existing = await findLembagaBySlug(slug);

  if (existing) return existing;

  return prisma.lembagaDesa.create({
    data: {
      namaLembaga: meta.namaLembaga,
      singkatan: meta.singkatan,
      deskripsi: meta.deskripsi,
      status: "aktif",
    },
    select: lembagaSelect,
  });
}