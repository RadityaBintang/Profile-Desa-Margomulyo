"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";

export type LoginState = {
  error: string | null;
};

function isSafeRedirect(path: string) {
  // Cegah open-redirect: hanya izinkan path relatif di dalam aplikasi sendiri.
  return path.startsWith("/") && !path.startsWith("//");
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectToRaw = String(formData.get("redirectTo") || "/");
  const redirectTo = isSafeRedirect(redirectToRaw) ? redirectToRaw : "/";

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const admin = await prisma.admin.findUnique({ where: { username } });

  // Pesan error sengaja dibuat sama antara "user tidak ada" dan "password
  // salah" agar tidak membocorkan username mana saja yang terdaftar.
  if (!admin) {
    return { error: "Username atau password salah." };
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    return { error: "Username atau password salah." };
  }

  await createAdminSession({
    adminId: admin.id,
    username: admin.username,
    nama: admin.nama,
    role: "admin",
  });

  redirect(redirectTo);
}
