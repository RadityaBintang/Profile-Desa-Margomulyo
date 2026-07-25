"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const STORAGE_BUCKET = "desa-assets";
const STORAGE_FOLDER = "kegiatan";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type UploadedImage = {
  publicUrl: string;
  storagePath: string;
};

export type DeleteKegiatanResult = {
  success: boolean;
  message: string;
};

function createSlug(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `kegiatan-${Date.now()}`;
}

async function saveImage(
  file: File | null
): Promise<UploadedImage | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];

  if (!extension) {
    throw new Error(
      "Format gambar harus JPG, PNG, atau WebP."
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Ukuran gambar maksimal 5 MB."
    );
  }

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const storagePath = `${STORAGE_FOLDER}/${fileName}`;

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(
      "Supabase Storage upload error:",
      error
    );

    throw new Error(
      `Gagal mengunggah gambar: ${error.message}`
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
      "Gagal memperoleh URL gambar dari Supabase Storage."
    );
  }

  return {
    publicUrl: data.publicUrl,
    storagePath,
  };
}

/**
 * Mengambil object path dari URL publik Supabase.
 * Gambar lama seperti /uploads/... tidak akan diproses.
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
 * Menghapus file gambar dari Supabase Storage.
 * Kegagalan menghapus file tidak membatalkan perubahan database.
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
      "Gagal menghapus gambar dari Supabase Storage:",
      error.message
    );
  }
}

export async function createPublicKegiatan(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const judul = String(
    formData.get("judul") ?? ""
  ).trim();

  const tanggal = String(
    formData.get("tanggal") ?? ""
  ).trim();

  const lokasi = String(
    formData.get("lokasi") ?? ""
  ).trim();

  const kategori = String(
    formData.get("kategori") ?? ""
  ).trim();

  const ringkasan = String(
    formData.get("ringkasan") ?? ""
  ).trim();

  const isi = String(
    formData.get("isi") ?? ""
  ).trim();

  const fileValue = formData.get("gambar");

  const file =
    fileValue instanceof File
      ? fileValue
      : null;

  if (!judul || !tanggal) {
    throw new Error(
      "Judul dan tanggal wajib diisi."
    );
  }

  const parsedTanggal = new Date(tanggal);

  if (Number.isNaN(parsedTanggal.getTime())) {
    throw new Error(
      "Format tanggal kegiatan tidak valid."
    );
  }

  const uploadedImage = await saveImage(file);

  try {
    await prisma.kegiatan.create({
      data: {
        judul,
        slug: `${createSlug(judul)}-${Date.now()}`,
        tanggal: parsedTanggal,
        lokasi: lokasi || null,
        kategori: kategori || null,
        ringkasan: ringkasan || null,
        isi: isi || null,
        gambar: uploadedImage?.publicUrl ?? "",
        status: "publish",
      },
    });
  } catch (error) {
    /*
     * Apabila gambar berhasil diunggah tetapi data gagal
     * disimpan, hapus gambar agar tidak menjadi file yatim.
     */
    if (uploadedImage) {
      await deleteStoredImage(
        uploadedImage.publicUrl
      );
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/kegiatan");

  redirect("/kegiatan");
}

export async function updatePublicKegiatan(
  id: number,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID kegiatan tidak valid."
    );
  }

  const judul = String(
    formData.get("judul") ?? ""
  ).trim();

  const tanggal = String(
    formData.get("tanggal") ?? ""
  ).trim();

  const lokasi = String(
    formData.get("lokasi") ?? ""
  ).trim();

  const kategori = String(
    formData.get("kategori") ?? ""
  ).trim();

  const ringkasan = String(
    formData.get("ringkasan") ?? ""
  ).trim();

  const isi = String(
    formData.get("isi") ?? ""
  ).trim();

  const gambarLama = String(
    formData.get("gambar_lama") ?? ""
  ).trim();

  const fileValue = formData.get("gambar");

  const file =
    fileValue instanceof File
      ? fileValue
      : null;

  if (!judul || !tanggal) {
    throw new Error(
      "Judul dan tanggal wajib diisi."
    );
  }

  const parsedTanggal = new Date(tanggal);

  if (Number.isNaN(parsedTanggal.getTime())) {
    throw new Error(
      "Format tanggal kegiatan tidak valid."
    );
  }

  const kegiatanLama =
    await prisma.kegiatan.findUnique({
      where: {
        id,
      },
      select: {
        slug: true,
        gambar: true,
      },
    });

  if (!kegiatanLama) {
    throw new Error(
      "Kegiatan yang akan diperbarui tidak ditemukan."
    );
  }

  const uploadedImage = await saveImage(file);

  try {
    await prisma.kegiatan.update({
      where: {
        id,
      },
      data: {
        judul,

        /*
         * ID ditambahkan agar slug tidak bertabrakan
         * dengan kegiatan lain yang memiliki judul sama.
         */
        slug: `${createSlug(judul)}-${id}`,

        tanggal: parsedTanggal,
        lokasi: lokasi || null,
        kategori: kategori || null,
        ringkasan: ringkasan || null,
        isi: isi || null,
        gambar:
          uploadedImage?.publicUrl ||
          gambarLama ||
          kegiatanLama.gambar ||
          "",
        status: "publish",
      },
    });
  } catch (error) {
    if (uploadedImage) {
      await deleteStoredImage(
        uploadedImage.publicUrl
      );
    }

    throw error;
  }

  /*
   * Gambar lama baru dihapus setelah perubahan database
   * berhasil disimpan.
   */
  const gambarSebelumnya =
    gambarLama || kegiatanLama.gambar || "";

  if (
    uploadedImage &&
    gambarSebelumnya &&
    gambarSebelumnya !== uploadedImage.publicUrl
  ) {
    await deleteStoredImage(
      gambarSebelumnya
    );
  }

  revalidatePath("/");
  revalidatePath("/kegiatan");
  revalidatePath(
    `/kegiatan/${kegiatanLama.slug}`
  );

  redirect("/kegiatan");
}

/**
 * Menghapus data kegiatan dari database dan menghapus
 * gambarnya dari Supabase Storage.
 *
 * Fungsi mengembalikan hasil agar dapat dipanggil dari
 * Client Component tanpa redirect.
 */
export async function deletePublicKegiatan(
  id: number
): Promise<DeleteKegiatanResult> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: "ID kegiatan tidak valid.",
    };
  }

  const kegiatan =
    await prisma.kegiatan.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        gambar: true,
      },
    });

  if (!kegiatan) {
    return {
      success: false,
      message: "Kegiatan tidak ditemukan.",
    };
  }

  try {
    await prisma.kegiatan.delete({
      where: {
        id: kegiatan.id,
      },
    });
  } catch (error) {
    console.error(
      "Gagal menghapus kegiatan dari database:",
      error
    );

    return {
      success: false,
      message:
        "Kegiatan gagal dihapus dari database.",
    };
  }

  /*
   * Penghapusan gambar dilakukan setelah data berhasil
   * dihapus. Error Storage tidak membatalkan penghapusan DB.
   */
  if (kegiatan.gambar) {
    await deleteStoredImage(kegiatan.gambar);
  }

  revalidatePath("/");
  revalidatePath("/kegiatan");
  revalidatePath(`/kegiatan/${kegiatan.slug}`);

  return {
    success: true,
    message: `Kegiatan "${kegiatan.judul}" berhasil dihapus.`,
  };
}