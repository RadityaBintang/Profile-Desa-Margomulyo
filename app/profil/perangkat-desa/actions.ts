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
const PERANGKAT_PAGE = "/profil/perangkat-desa";

type PerangkatFormData = {
  nama: string;
  jabatan: string;
  urutan: number;
  status: string;
};

function readText(
  formData: FormData,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = formData.get(key);

    if (typeof value === "string") {
      return value.trim();
    }
  }

  return "";
}

function readPerangkatForm(
  formData: FormData
): PerangkatFormData {
  const nama = readText(
    formData,
    "nama",
    "namaPerangkat"
  );

  const jabatan = readText(
    formData,
    "jabatan"
  );

  const status =
    readText(formData, "status") || "aktif";

  const rawUrutan = Number(
    readText(formData, "urutan") || "0"
  );

  const urutan = Number.isFinite(rawUrutan)
    ? Math.max(0, Math.trunc(rawUrutan))
    : 0;

  if (!nama) {
    throw new Error(
      "Nama perangkat desa wajib diisi."
    );
  }

  if (!jabatan) {
    throw new Error(
      "Jabatan perangkat desa wajib diisi."
    );
  }

  return {
    nama,
    jabatan,
    urutan,
    status,
  };
}

function readImageFile(
  formData: FormData
): File | null {
  const candidates = [
    "foto",
    "gambar",
    "fotoPerangkat",
  ];

  for (const key of candidates) {
    const value = formData.get(key);

    if (
      value instanceof File &&
      value.size > 0
    ) {
      return value;
    }
  }

  return null;
}

function revalidatePerangkatPages(): void {
  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath(PERANGKAT_PAGE);
}

export async function createPerangkatDesa(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const data = readPerangkatForm(formData);
  const file = readImageFile(formData);

  const uploadedImage =
    await uploadImageToStorage(file, {
      folder: "perangkat-desa",
      filePrefix: "perangkat",
      maxSizeBytes: MAX_IMAGE_SIZE,
    });

  try {
    await prisma.perangkatDesa.create({
      data: {
        nama: data.nama,
        jabatan: data.jabatan,
        urutan: data.urutan,
        status: data.status,
        foto:
          uploadedImage?.publicUrl ?? null,
      },
    });
  } catch (databaseError) {
    if (uploadedImage) {
      await deleteImageFromStorage(
        uploadedImage.publicUrl
      );
    }

    console.error(
      "Gagal menambahkan perangkat desa:",
      databaseError
    );

    throw new Error(
      "Data perangkat desa gagal disimpan."
    );
  }

  revalidatePerangkatPages();
  redirect(PERANGKAT_PAGE);
}

export async function updatePerangkatDesa(
  id: number,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID perangkat desa tidak valid."
    );
  }

  const data = readPerangkatForm(formData);
  const file = readImageFile(formData);

  const perangkatLama =
    await prisma.perangkatDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        foto: true,
      },
    });

  if (!perangkatLama) {
    throw new Error(
      "Data perangkat desa tidak ditemukan."
    );
  }

  const uploadedImage =
    await uploadImageToStorage(file, {
      folder: "perangkat-desa",
      filePrefix: `perangkat-${id}`,
      maxSizeBytes: MAX_IMAGE_SIZE,
    });

  try {
    await prisma.perangkatDesa.update({
      where: {
        id,
      },
      data: {
        nama: data.nama,
        jabatan: data.jabatan,
        urutan: data.urutan,
        status: data.status,
        ...(uploadedImage
          ? {
              foto:
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
      "Gagal memperbarui perangkat desa:",
      databaseError
    );

    throw new Error(
      "Data perangkat desa gagal diperbarui."
    );
  }

  if (uploadedImage) {
    await deleteImageFromStorage(
      perangkatLama.foto
    );
  }

  revalidatePerangkatPages();
  redirect(PERANGKAT_PAGE);
}

export async function deletePerangkatDesa(
  id: number
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID perangkat desa tidak valid."
    );
  }

  const perangkat =
    await prisma.perangkatDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        foto: true,
      },
    });

  if (!perangkat) {
    throw new Error(
      "Data perangkat desa tidak ditemukan."
    );
  }

  await prisma.perangkatDesa.delete({
    where: {
      id,
    },
  });

  await deleteImageFromStorage(
    perangkat.foto
  );

  revalidatePerangkatPages();
  redirect(PERANGKAT_PAGE);
}

/*
 * Alias berikut disediakan agar komponen lama tetap bisa
 * memakai nama action create/update/delete yang lebih singkat.
 */
export async function createPerangkat(
  formData: FormData
): Promise<void> {
  return createPerangkatDesa(formData);
}

export async function updatePerangkat(
  id: number,
  formData: FormData
): Promise<void> {
  return updatePerangkatDesa(id, formData);
}

export async function deletePerangkat(
  id: number
): Promise<void> {
  return deletePerangkatDesa(id);
}

export async function tambahPerangkatDesa(
  formData: FormData
): Promise<void> {
  return createPerangkatDesa(formData);
}

export async function editPerangkatDesa(
  id: number,
  formData: FormData
): Promise<void> {
  return updatePerangkatDesa(id, formData);
}

export async function hapusPerangkatDesa(
  id: number
): Promise<void> {
  return deletePerangkatDesa(id);
}
