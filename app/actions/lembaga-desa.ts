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

export async function updateGambarLembagaDesa(formData: FormData) {
  await requireAdmin();

  const fileValue = formData.get("gambar");

  const file =
    fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  if (!file) {
    throw new Error("File gambar belum dipilih.");
  }

  const profilLama = await prisma.profilDesa.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      gambarLembagaDesa: true,
    },
  });

  const uploadedImage = await uploadImageToStorage(file, {
    folder: "profil-desa",
    filePrefix: "gambar-lembaga-desa",
    maxSizeBytes: MAX_IMAGE_SIZE,
    required: true,
  });

  if (!uploadedImage) {
    throw new Error("Gagal mengupload gambar lembaga desa.");
  }

  const imageUrl = uploadedImage.publicUrl;

  if (profilLama) {
    await prisma.profilDesa.update({
      where: {
        id: profilLama.id,
      },
      data: {
        gambarLembagaDesa: imageUrl,
      },
    });

    if (profilLama.gambarLembagaDesa) {
      await deleteImageFromStorage(profilLama.gambarLembagaDesa);
    }
  } else {
    await prisma.profilDesa.create({
      data: {
        namaDesa: "Desa Margomulyo",
        gambarLembagaDesa: imageUrl,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/profil/lembaga-desa");

  redirect("/profil/lembaga-desa");
}