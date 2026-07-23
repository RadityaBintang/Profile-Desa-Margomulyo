"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function saveFotoProfil(file: File | null) {
  if (!file || file.size === 0) {
    throw new Error("File gambar belum dipilih.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WebP.");
  }

  const maxSize = 3 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran gambar maksimal 3MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `foto-desa-${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "profil");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/profil/${fileName}`;
}

export async function updateFotoDesa(formData: FormData) {
  const file = formData.get("fotoKantor") as File | null;

  const imageUrl = await saveFotoProfil(file);

  const profil = await prisma.profilDesa.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
    },
  });

  if (profil) {
    await prisma.profilDesa.update({
      where: {
        id: profil.id,
      },
      data: {
        fotoKantor: imageUrl,
      },
    });
  } else {
    await prisma.profilDesa.create({
      data: {
        namaDesa: "Desa Margomulyo",
        kecamatan: "Panggungrejo",
        kabupaten: "Blitar",
        provinsi: "Jawa Timur",
        alamat: "Kantor Desa Margomulyo Panggungrejo Blitar",
        telepon: "(+62) 816-1545-3303",
        deskripsi:
          "Desa Margomulyo merupakan desa yang berkomitmen dalam memberikan pelayanan publik yang baik, transparan, dan mudah diakses masyarakat.",
        fotoKantor: imageUrl,
      },
    });
  }

  revalidatePath("/");
}