"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth";

async function saveLayananImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

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
  const fileName = `layanan-${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "layanan");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/layanan/${fileName}`;
}

function readLayananForm(formData: FormData) {
  const namaLayanan = String(formData.get("namaLayanan") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim();
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;
  const persyaratan = String(formData.get("persyaratan") || "").trim() || null;
  const tampilanBesar = formData.get("tampilanBesar") === "on";
  const urutan = Number(formData.get("urutan") || 0);

  if (!namaLayanan || !kategori) {
    throw new Error("Nama layanan dan kategori wajib diisi.");
  }

  return { namaLayanan, kategori, deskripsi, persyaratan, tampilanBesar, urutan };
}

export async function createLayanan(formData: FormData) {
  await requireAdmin();

  const data = readLayananForm(formData);
  const gambarUrl = await saveLayananImage(formData.get("gambar") as File | null);

  await prisma.layananDesa.create({
    data: { ...data, ikon: gambarUrl, status: "aktif" },
  });

  revalidatePath("/layanan");
  redirect("/layanan");
}

export async function updateLayanan(id: number, formData: FormData) {
  await requireAdmin();

  const data = readLayananForm(formData);
  const gambarBaru = await saveLayananImage(formData.get("gambar") as File | null);

  await prisma.layananDesa.update({
    where: { id },
    data: {
      ...data,
      // Kalau admin tidak upload file baru, gambar lama dibiarkan seperti semula.
      ...(gambarBaru ? { ikon: gambarBaru } : {}),
    },
  });

  revalidatePath("/layanan");
  redirect("/layanan");
}

export async function deleteLayanan(id: number) {
  await requireAdmin();

  await prisma.layananDesa.delete({ where: { id } });

  revalidatePath("/layanan");
}