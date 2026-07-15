"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function saveFotoPerangkat(file: File | null) {
  if (!file || file.size === 0) {
    return "";
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
  const fileName = `perangkat-${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "perangkat");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/perangkat/${fileName}`;
}

export async function updatePerangkatDesa(id: number, formData: FormData) {
  const nama = String(formData.get("nama") || "").trim();
  const jabatan = String(formData.get("jabatan") || "").trim();
  const fotoLama = String(formData.get("foto_lama") || "");
  const file = formData.get("foto") as File | null;

  if (!nama || !jabatan) {
    throw new Error("Nama dan jabatan wajib diisi.");
  }

  const fotoBaru = await saveFotoPerangkat(file);
  const fotoFinal = fotoBaru || fotoLama;

  await prisma.perangkatDesa.update({
    where: {
      id,
    },
    data: {
      nama,
      jabatan,
      foto: fotoFinal,
    },
  });

  revalidatePath("/profil/perangkat-desa");
}