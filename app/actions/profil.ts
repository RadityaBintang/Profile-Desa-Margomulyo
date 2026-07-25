"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const STORAGE_BUCKET = "desa-assets";
const STORAGE_FOLDER = "profil";
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type UploadedImage = {
  publicUrl: string;
  storagePath: string;
};

/**
 * Mengunggah foto profil desa ke Supabase Storage.
 */
async function saveFotoProfil(
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
      "Ukuran gambar maksimal 3 MB."
    );
  }

  const fileName =
    `foto-desa-${Date.now()}-${randomUUID()}.${extension}`;

  const storagePath =
    `${STORAGE_FOLDER}/${fileName}`;

  const fileBuffer = await file.arrayBuffer();

  const supabase = getSupabaseAdmin();

  const { error: uploadError } =
    await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Gagal upload foto profil ke Supabase:",
      uploadError
    );

    throw new Error(
      `Gagal mengunggah foto profil: ${uploadError.message}`
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
      "URL publik foto profil gagal dibuat."
    );
  }

  return {
    publicUrl: data.publicUrl,
    storagePath,
  };
}

/**
 * Mengambil lokasi file Supabase dari URL publik.
 *
 * URL lama seperti /uploads/profil/... akan dilewati karena
 * file tersebut bukan file Supabase Storage.
 */
function getStoragePathFromPublicUrl(
  publicUrl: string
): string | null {
  if (!publicUrl.startsWith("https://")) {
    return null;
  }

  const marker =
    `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  const markerPosition = publicUrl.indexOf(marker);

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

/**
 * Menghapus foto dari Supabase Storage.
 */
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
      "Gagal menghapus foto profil lama:",
      error.message
    );
  }
}

export async function updateFotoDesa(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const fileValue = formData.get("fotoKantor");

  const file =
    fileValue instanceof File
      ? fileValue
      : null;

  /*
   * Ambil data lama terlebih dahulu agar foto lama
   * dapat dihapus setelah pembaruan berhasil.
   */
  const profilLama =
    await prisma.profilDesa.findFirst({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        fotoKantor: true,
      },
    });

  /*
   * Upload foto baru ke Supabase Storage.
   */
  const uploadedImage =
    await saveFotoProfil(file);

  try {
    if (profilLama) {
      await prisma.profilDesa.update({
        where: {
          id: profilLama.id,
        },
        data: {
          fotoKantor:
            uploadedImage.publicUrl,
        },
      });
    } else {
      await prisma.profilDesa.create({
        data: {
          namaDesa: "Desa Margomulyo",
          kecamatan: "Panggungrejo",
          kabupaten: "Blitar",
          provinsi: "Jawa Timur",
          alamat:
            "Kantor Desa Margomulyo Panggungrejo Blitar",
          telepon: "(+62) 816-1545-3303",
          deskripsi:
            "Desa Margomulyo merupakan desa yang berkomitmen dalam memberikan pelayanan publik yang baik, transparan, dan mudah diakses masyarakat.",
          fotoKantor:
            uploadedImage.publicUrl,
        },
      });
    }
  } catch (databaseError) {
    /*
     * Jika upload berhasil tetapi penyimpanan database
     * gagal, hapus foto baru agar tidak menjadi file yatim.
     */
    await deleteStoredImage(
      uploadedImage.publicUrl
    );

    console.error(
      "Gagal menyimpan foto profil ke database:",
      databaseError
    );

    throw new Error(
      "Foto berhasil diunggah, tetapi gagal disimpan ke database."
    );
  }

  /*
   * Hapus foto lama setelah database berhasil diperbarui.
   */
  if (
    profilLama?.fotoKantor &&
    profilLama.fotoKantor !==
      uploadedImage.publicUrl
  ) {
    await deleteStoredImage(
      profilLama.fotoKantor
    );
  }

  revalidatePath("/");
  revalidatePath("/profil");
}