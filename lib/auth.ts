import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 jam

export type AdminSession = {
  adminId: number;
  username: string;
  nama: string | null;
  role: "admin";
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error(
      `AUTH_SECRET tidak tersedia pada environment ${
        process.env.VERCEL_ENV ??
        process.env.NODE_ENV ??
        "unknown"
      }.`
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "AUTH_SECRET harus memiliki minimal 32 karakter."
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Membuat JWT session dan menyimpannya ke cookie.
 * Fungsi ini harus dipanggil dari Server Action atau Route Handler.
 */
export async function createAdminSession(
  payload: AdminSession
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000
  );

  const expiresAtSeconds = Math.floor(
    expiresAt.getTime() / 1000
  );

  const token = await new SignJWT({
    adminId: payload.adminId,
    username: payload.username,
    nama: payload.nama,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAtSeconds)
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Membaca dan memverifikasi session admin.
 */
export async function getAdminSession():
  Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  // Diletakkan di luar try agar error konfigurasi AUTH_SECRET
  // tidak disembunyikan sebagai session null.
  const secretKey = getSecretKey();

  try {
    const { payload } = await jwtVerify(
      token,
      secretKey,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof payload.adminId !== "number" ||
      typeof payload.username !== "string" ||
      payload.role !== "admin"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      username: payload.username,
      nama:
        typeof payload.nama === "string"
          ? payload.nama
          : null,
      role: "admin",
    };
  } catch (error) {
    console.error(
      "Session admin tidak valid:",
      error instanceof Error
        ? error.message
        : "Error tidak diketahui"
    );

    return null;
  }
}

/**
 * Menghapus session admin.
 * Fungsi ini harus dipanggil dari Server Action atau Route Handler.
 */
export async function destroyAdminSession():
  Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Memastikan pengguna sudah login sebagai admin.
 */
export async function requireAdmin():
  Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    throw new Error(
      "UNAUTHORIZED: Anda harus login sebagai admin untuk melakukan aksi ini."
    );
  }

  return session;
}

export { SESSION_COOKIE_NAME };