"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function saveStrukturImage(file: File | null) {
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

  const maxSize = 4 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran gambar maksimal 4MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `struktur-organisasi-${randomUUID()}.${ext}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "struktur-organisasi"
  );

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/struktur-organisasi/${fileName}`;
}

export async function updateStrukturOrganisasi(formData: FormData) {
  await requireAdmin();

  const file = formData.get("strukturOrganisasi") as File | null;
  const imageUrl = await saveStrukturImage(file);

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
        strukturOrganisasi: imageUrl,
      },
    });
  } else {
    await prisma.profilDesa.create({
      data: {
        namaDesa: "Desa Margomulyo",
        strukturOrganisasi: imageUrl,
      },
    });
  }

  revalidatePath("/profil/struktur-organisasi");
}