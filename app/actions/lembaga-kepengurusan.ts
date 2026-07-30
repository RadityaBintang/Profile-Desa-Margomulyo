"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "@/lib/supabase-storage";
import {
  getLembagaMeta,
  getOrCreateLembagaBySlug,
} from "@/lib/lembaga-desa";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export async function updateGambarKepengurusanLembaga(
  slug: string,
  formData: FormData
) {
  await requireAdmin();

  const meta = getLembagaMeta(slug);

  if (!meta) {
    throw new Error("Lembaga desa tidak valid.");
  }

  const fileValue = formData.get("gambar");

  const file =
    fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  if (!file) {
    throw new Error("File gambar belum dipilih.");
  }

  const lembaga = await getOrCreateLembagaBySlug(slug);

  const uploadedImage = await uploadImageToStorage(file, {
    folder: "lembaga",
    filePrefix: `kepengurusan-${slug}`,
    maxSizeBytes: MAX_IMAGE_SIZE,
    required: true,
  });

  if (!uploadedImage) {
    throw new Error("Gagal mengupload gambar kepengurusan lembaga.");
  }

  await prisma.lembagaDesa.update({
    where: {
      id: lembaga.id,
    },
    data: {
      gambarKepengurusan: uploadedImage.publicUrl,
    },
  });

  if (lembaga.gambarKepengurusan) {
    await deleteImageFromStorage(lembaga.gambarKepengurusan);
  }

  revalidatePath("/profil/lembaga-desa");
  revalidatePath(`/profil/lembaga-desa/${slug}`);
  revalidatePath("/");

  redirect(`/profil/lembaga-desa/${slug}`);
}