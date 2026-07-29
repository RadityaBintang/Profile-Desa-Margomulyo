"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function timeStringToDate(value: string | null) {
  if (!value) return null;

  const cleanValue = value.trim();

  if (!cleanValue) return null;

  return new Date(`1970-01-01T${cleanValue}:00.000Z`);
}

export async function updateJamPelayanan(formData: FormData) {
  await requireAdmin();

  const idValue = String(formData.get("id") || "");
  const hari = String(formData.get("hari") || "").trim();
  const jamBuka = String(formData.get("jamBuka") || "").trim();
  const jamTutup = String(formData.get("jamTutup") || "").trim();
  const keterangan = String(formData.get("keterangan") || "").trim();
  const urutan = Number(formData.get("urutan") || 0);

  if (!hari) {
    throw new Error("Hari wajib diisi.");
  }

  const data = {
    hari,
    jamBuka: timeStringToDate(jamBuka),
    jamTutup: timeStringToDate(jamTutup),
    keterangan: keterangan || null,
    urutan,
  };

  const id = Number(idValue);

  if (idValue && Number.isInteger(id) && id > 0) {
    await prisma.jamPelayanan.update({
      where: {
        id,
      },
      data,
    });
  } else {
    await prisma.jamPelayanan.create({
      data,
    });
  }

  revalidatePath("/");
}