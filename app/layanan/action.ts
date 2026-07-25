"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "@/lib/supabase-storage";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

function readLayananForm(
  formData: FormData
) {
  const namaLayanan = String(
    formData.get("namaLayanan") ?? ""
  ).trim();

  const kategori = String(
    formData.get("kategori") ?? ""
  ).trim();

  const deskripsi = String(
    formData.get("deskripsi") ?? ""
  ).trim();

  const persyaratan = String(
    formData.get("persyaratan") ?? ""
  ).trim();

  const tampilanBesar =
    formData.get("tampilanBesar") === "on" ||
    formData.get("tampilanBesar") === "true";

  const rawUrutan = Number(
    formData.get("urutan") ?? 0
  );

  const urutan =
    Number.isFinite(rawUrutan)
      ? Math.trunc(rawUrutan)
      : 0;

  if (!namaLayanan || !kategori) {
    throw new Error(
      "Nama layanan dan kategori wajib diisi."
    );
  }

  return {
    namaLayanan,
    kategori,
    deskripsi: deskripsi || null,
    persyaratan: persyaratan || null,
    tampilanBesar,
    urutan,
  };
}

function readImageFile(
  formData: FormData
): File | null {
  const value = formData.get("gambar");

  return value instanceof File &&
    value.size > 0
    ? value
    : null;
}

function revalidateLayananPages(): void {
  revalidatePath("/");
  revalidatePath("/layanan");
}

export async function createLayanan(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const data = readLayananForm(formData);
  const file = readImageFile(formData);

  const uploadedImage =
    await uploadImageToStorage(file, {
      folder: "layanan",
      filePrefix: "layanan",
      maxSizeBytes: MAX_IMAGE_SIZE,
    });

  try {
    await prisma.layananDesa.create({
      data: {
        ...data,
        ikon:
          uploadedImage?.publicUrl ?? null,
        status: "aktif",
      },
    });
  } catch (databaseError) {
    if (uploadedImage) {
      await deleteImageFromStorage(
        uploadedImage.publicUrl
      );
    }

    console.error(
      "Gagal membuat layanan:",
      databaseError
    );

    throw new Error(
      "Data layanan gagal disimpan."
    );
  }

  revalidateLayananPages();
  redirect("/layanan");
}

export async function updateLayanan(
  id: number,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID layanan tidak valid."
    );
  }

  const data = readLayananForm(formData);
  const file = readImageFile(formData);

  const layananLama =
    await prisma.layananDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ikon: true,
      },
    });

  if (!layananLama) {
    throw new Error(
      "Data layanan tidak ditemukan."
    );
  }

  const uploadedImage =
    await uploadImageToStorage(file, {
      folder: "layanan",
      filePrefix: `layanan-${id}`,
      maxSizeBytes: MAX_IMAGE_SIZE,
    });

  try {
    await prisma.layananDesa.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(uploadedImage
          ? {
              ikon:
                uploadedImage.publicUrl,
            }
          : {}),
      },
    });
  } catch (databaseError) {
    if (uploadedImage) {
      await deleteImageFromStorage(
        uploadedImage.publicUrl
      );
    }

    console.error(
      "Gagal memperbarui layanan:",
      databaseError
    );

    throw new Error(
      "Data layanan gagal diperbarui."
    );
  }

  if (uploadedImage) {
    await deleteImageFromStorage(
      layananLama.ikon
    );
  }

  revalidateLayananPages();
  redirect("/layanan");
}

export async function deleteLayanan(
  id: number
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID layanan tidak valid."
    );
  }

  const layanan =
    await prisma.layananDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ikon: true,
      },
    });

  if (!layanan) {
    throw new Error(
      "Data layanan tidak ditemukan."
    );
  }

  await prisma.layananDesa.delete({
    where: {
      id,
    },
  });

  await deleteImageFromStorage(
    layanan.ikon
  );

  revalidateLayananPages();
}
