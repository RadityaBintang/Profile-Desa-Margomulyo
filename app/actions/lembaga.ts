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

type StatusLembaga = "aktif" | "nonaktif";
type ImageDatabaseField = "foto" | "ikon";

type LembagaFormData = {
  namaLembaga: string;
  singkatan: string | null;
  deskripsi: string | null;
  ketua: string | null;
  periode: string | null;
  status: StatusLembaga;
};

type LembagaImageInput = {
  file: File | null;
  databaseField: ImageDatabaseField;
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

function readLembagaForm(
  formData: FormData
): LembagaFormData {
  const namaLembaga = readText(
    formData,
    "namaLembaga",
    "nama_lembaga"
  );

  const singkatan = readText(
    formData,
    "singkatan"
  );

  const deskripsi = readText(
    formData,
    "deskripsi"
  );

  const ketua = readText(
    formData,
    "ketua"
  );

  const periode = readText(
    formData,
    "periode"
  );

  const statusValue = readText(
    formData,
    "status"
  );

  const status: StatusLembaga =
    statusValue === "nonaktif"
      ? "nonaktif"
      : "aktif";

  if (!namaLembaga) {
    throw new Error(
      "Nama lembaga wajib diisi."
    );
  }

  return {
    namaLembaga,
    singkatan: singkatan || null,
    deskripsi: deskripsi || null,
    ketua: ketua || null,
    periode: periode || null,
    status,
  };
}

function readLembagaImage(
  formData: FormData
): LembagaImageInput {
  const candidates: Array<{
    key: string;
    databaseField: ImageDatabaseField;
  }> = [
    {
      key: "foto",
      databaseField: "foto",
    },
    {
      key: "gambar",
      databaseField: "foto",
    },
    {
      key: "ikon",
      databaseField: "ikon",
    },
  ];

  for (const candidate of candidates) {
    const value = formData.get(candidate.key);

    if (
      value instanceof File &&
      value.size > 0
    ) {
      return {
        file: value,
        databaseField:
          candidate.databaseField,
      };
    }
  }

  return {
    file: null,
    databaseField: "foto",
  };
}

function readReturnPath(
  formData: FormData
): string {
  const value = readText(
    formData,
    "returnTo",
    "redirectTo"
  );

  if (
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/";
}

function revalidateLembagaPages(): void {
  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/lembaga");
}

export async function createLembaga(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const data = readLembagaForm(formData);
  const imageInput =
    readLembagaImage(formData);

  const uploadedImage =
    await uploadImageToStorage(
      imageInput.file,
      {
        folder: "lembaga",
        filePrefix: "lembaga",
        maxSizeBytes: MAX_IMAGE_SIZE,
      }
    );

  const imageData =
    uploadedImage
      ? imageInput.databaseField === "ikon"
        ? {
            ikon: uploadedImage.publicUrl,
          }
        : {
            foto: uploadedImage.publicUrl,
          }
      : {};

  try {
    await prisma.lembagaDesa.create({
      data: {
        ...data,
        ...imageData,
      },
    });
  } catch (databaseError) {
    if (uploadedImage) {
      await deleteImageFromStorage(
        uploadedImage.publicUrl
      );
    }

    console.error(
      "Gagal membuat lembaga:",
      databaseError
    );

    throw new Error(
      "Data lembaga gagal disimpan."
    );
  }

  const returnPath =
    readReturnPath(formData);

  revalidateLembagaPages();
  redirect(returnPath);
}

export async function updateLembaga(
  id: number,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID lembaga tidak valid."
    );
  }

  const data = readLembagaForm(formData);
  const imageInput =
    readLembagaImage(formData);

  const lembagaLama =
    await prisma.lembagaDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        foto: true,
        ikon: true,
      },
    });

  if (!lembagaLama) {
    throw new Error(
      "Data lembaga tidak ditemukan."
    );
  }

  const uploadedImage =
    await uploadImageToStorage(
      imageInput.file,
      {
        folder: "lembaga",
        filePrefix: `lembaga-${id}`,
        maxSizeBytes: MAX_IMAGE_SIZE,
      }
    );

  const imageData =
    uploadedImage
      ? imageInput.databaseField === "ikon"
        ? {
            ikon: uploadedImage.publicUrl,
          }
        : {
            foto: uploadedImage.publicUrl,
          }
      : {};

  try {
    await prisma.lembagaDesa.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...imageData,
      },
    });
  } catch (databaseError) {
    if (uploadedImage) {
      await deleteImageFromStorage(
        uploadedImage.publicUrl
      );
    }

    console.error(
      "Gagal memperbarui lembaga:",
      databaseError
    );

    throw new Error(
      "Data lembaga gagal diperbarui."
    );
  }

  if (uploadedImage) {
    const oldImage =
      imageInput.databaseField === "ikon"
        ? lembagaLama.ikon
        : lembagaLama.foto;

    await deleteImageFromStorage(
      oldImage
    );
  }

  const returnPath =
    readReturnPath(formData);

  revalidateLembagaPages();
  redirect(returnPath);
}

export async function deleteLembaga(
  id: number
): Promise<void> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      "ID lembaga tidak valid."
    );
  }

  const lembaga =
    await prisma.lembagaDesa.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        foto: true,
        ikon: true,
      },
    });

  if (!lembaga) {
    throw new Error(
      "Data lembaga tidak ditemukan."
    );
  }

  await prisma.lembagaDesa.delete({
    where: {
      id,
    },
  });

  await Promise.all([
    deleteImageFromStorage(lembaga.foto),
    deleteImageFromStorage(lembaga.ikon),
  ]);

  revalidateLembagaPages();
}
