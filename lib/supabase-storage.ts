import "server-only";

import { randomUUID } from "crypto";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const STORAGE_BUCKET = "desa-assets";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type UploadedStorageImage = {
  publicUrl: string;
  storagePath: string;
};

type UploadImageOptions = {
  folder: string;
  filePrefix: string;
  maxSizeBytes: number;
  required?: boolean;
};

function cleanPathSegment(value: string): string {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadImageToStorage(
  file: File | null,
  options: UploadImageOptions
): Promise<UploadedStorageImage | null> {
  const {
    folder,
    filePrefix,
    maxSizeBytes,
    required = false,
  } = options;

  if (!file || file.size === 0) {
    if (required) {
      throw new Error("File gambar belum dipilih.");
    }

    return null;
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];

  if (!extension) {
    throw new Error(
      "Format gambar harus JPG, PNG, atau WebP."
    );
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMb = Math.floor(
      maxSizeBytes / (1024 * 1024)
    );

    throw new Error(
      `Ukuran gambar maksimal ${maxSizeMb} MB.`
    );
  }

  const safeFolder = cleanPathSegment(folder);
  const safePrefix =
    cleanPathSegment(filePrefix) || "gambar";

  if (!safeFolder) {
    throw new Error(
      "Folder Supabase Storage tidak valid."
    );
  }

  const fileName =
    `${safePrefix}-${Date.now()}-${randomUUID()}.${extension}`;

  const storagePath =
    `${safeFolder}/${fileName}`;

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
      "Supabase Storage upload error:",
      uploadError
    );

    throw new Error(
      `Gagal mengunggah gambar: ${uploadError.message}`
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
      "URL publik gambar gagal dibuat."
    );
  }

  return {
    publicUrl: data.publicUrl,
    storagePath,
  };
}

export function getStoragePathFromPublicUrl(
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

export async function deleteImageFromStorage(
  publicUrl: string | null | undefined
): Promise<void> {
  if (!publicUrl) {
    return;
  }

  const storagePath =
    getStoragePathFromPublicUrl(publicUrl);

  // URL lama /uploads/... atau nilai ikon teks dilewati.
  if (!storagePath) {
    return;
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error(
      "Supabase Storage delete error:",
      error.message
    );
  }
}
