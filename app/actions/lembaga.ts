"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function saveIkonLembaga(file: File | null) {
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

  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran gambar maksimal 2MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `lembaga-${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "lembaga");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/lembaga/${fileName}`;
}

export async function updateIkonLembaga(id: number, formData: FormData) {
  const file = formData.get("ikon") as File | null;

  const imageUrl = await saveIkonLembaga(file);

  await prisma.lembagaDesa.update({
    where: {
      id,
    },
    data: {
      ikon: imageUrl,
    },
  });

  revalidatePath("/");
}