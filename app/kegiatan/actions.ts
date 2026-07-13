"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
<<<<<<< HEAD
import { requireAdmin } from "@/lib/auth";
=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function saveImage(file: File | null) {
  if (!file || file.size === 0) {
    return "";
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran gambar maksimal 2MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "kegiatan");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/kegiatan/${fileName}`;
}

export async function createPublicKegiatan(formData: FormData) {
<<<<<<< HEAD
  await requireAdmin();

=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c
  const judul = String(formData.get("judul") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const lokasi = String(formData.get("lokasi") || "");
  const kategori = String(formData.get("kategori") || "");
  const ringkasan = String(formData.get("ringkasan") || "");
  const isi = String(formData.get("isi") || "");
  const file = formData.get("gambar") as File | null;

  if (!judul || !tanggal) {
    throw new Error("Judul dan tanggal wajib diisi.");
  }

  const gambarPath = await saveImage(file);

  await prisma.kegiatan.create({
    data: {
      judul,
      slug: createSlug(judul),
      tanggal: new Date(tanggal),
      lokasi,
      kategori,
      ringkasan,
      isi,
      gambar: gambarPath,
      status: "publish" as any,
    },
  });

  revalidatePath("/");
  revalidatePath("/kegiatan");

  redirect("/kegiatan");
}

export async function updatePublicKegiatan(id: number, formData: FormData) {
<<<<<<< HEAD
  await requireAdmin();

=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c
  const judul = String(formData.get("judul") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const lokasi = String(formData.get("lokasi") || "");
  const kategori = String(formData.get("kategori") || "");
  const ringkasan = String(formData.get("ringkasan") || "");
  const isi = String(formData.get("isi") || "");
  const gambarLama = String(formData.get("gambar_lama") || "");
  const file = formData.get("gambar") as File | null;

  if (!judul || !tanggal) {
    throw new Error("Judul dan tanggal wajib diisi.");
  }

  const gambarBaru = await saveImage(file);
  const gambarFinal = gambarBaru || gambarLama;

  await prisma.kegiatan.update({
    where: {
      id,
    },
    data: {
      judul,
      slug: createSlug(judul),
      tanggal: new Date(tanggal),
      lokasi,
      kategori,
      ringkasan,
      isi,
      gambar: gambarFinal,
      status: "publish" as any,
    },
  });

  revalidatePath("/");
  revalidatePath("/kegiatan");

  redirect("/kegiatan");
}

export async function deletePublicKegiatan(id: number) {
<<<<<<< HEAD
  await requireAdmin();

=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c
  await prisma.kegiatan.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/kegiatan");

  redirect("/kegiatan");
}