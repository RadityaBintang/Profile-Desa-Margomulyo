"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const STORAGE_BUCKET = "desa-assets";
const STORAGE_FOLDER = "struktur-organisasi";
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type UploadedImage = {
  publicUrl: string;
  storagePath: string;
};

async function saveStrukturImage(
  file: File | null
): Promise<UploadedImage> {
  if (!file || file.size === 0) {
    throw new Error("File gambar belum dipilih.");
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];

  if (!extension) {
    throw new Error(
      "Format gambar harus JPG, PNG, atau WebP."
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Ukuran gambar maksimal 4 MB."
    );
  }

  const fileName =
    `struktur-organisasi-${Date.now()}-${randomUUID()}.${extension}`;

  const storagePath =
    `${STORAGE_FOLDER}/${fileName}`;

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const supabase = getSupabaseAdmin();

  const { error: uploadError } =
    await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Gagal upload struktur organisasi:",
      uploadError
    );

    throw new Error(
      `Gagal mengunggah struktur organisasi: ${uploadError.message}`
    );
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  if (!data.publicUrl) {
    await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    throw new Error(
      "URL publik struktur organisasi gagal dibuat."
    );
  }

  return {
    publicUrl: data.publicUrl,
    storagePath,
  };
}

/**
 * Mengambil lokasi file dari URL publik Supabase.
 * URL lokal lama seperti /uploads/... akan dilewati.
 */
function getStoragePathFromPublicUrl(
  publicUrl: string
): string | null {
  if (!publicUrl.startsWith("https://")) {
    return null;
  }

  const marker =
    `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  const markerPosition =
    publicUrl.indexOf(marker);

  if (markerPosition === -1) {
    return null;
  }

  const encodedPath = publicUrl.slice(
    markerPosition + marker.length
  );

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

async function deleteStoredImage(
  publicUrl: string
): Promise<void> {
  const storagePath =
    getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath) {
    return;
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error(
      "Gagal menghapus struktur organisasi lama:",
      error.message
    );
  }
}

export async function updateStrukturOrganisasi(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const fileValue =
    formData.get("strukturOrganisasi");

  const file =
    fileValue instanceof File
      ? fileValue
      : null;

  /*
   * Ambil data lama supaya gambar lama dapat dihapus
   * setelah database berhasil diperbarui.
   */
  const profilLama =
    await prisma.profilDesa.findFirst({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        strukturOrganisasi: true,
      },
    });

  const uploadedImage =
    await saveStrukturImage(file);

  try {
    if (profilLama) {
      await prisma.profilDesa.update({
        where: {
          id: profilLama.id,
        },
        data: {
          strukturOrganisasi:
            uploadedImage.publicUrl,
        },
      });
    } else {
      await prisma.profilDesa.create({
        data: {
          namaDesa: "Desa Margomulyo",
          strukturOrganisasi:
            uploadedImage.publicUrl,
        },
      });
    }
  } catch (databaseError) {
    /*
     * Jika upload berhasil tetapi database gagal,
     * hapus gambar baru agar tidak menjadi file yatim.
     */
    await deleteStoredImage(
      uploadedImage.publicUrl
    );

    console.error(
      "Gagal menyimpan struktur organisasi:",
      databaseError
    );

    throw new Error(
      "Gambar berhasil diunggah, tetapi gagal disimpan ke database."
    );
  }

  /*
   * Hapus gambar lama setelah database berhasil
   * diperbarui.
   */
  if (
    profilLama?.strukturOrganisasi &&
    profilLama.strukturOrganisasi !==
      uploadedImage.publicUrl
  ) {
    await deleteStoredImage(
      profilLama.strukturOrganisasi
    );
  }

  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath(
    "/profil/struktur-organisasi"
  );
}