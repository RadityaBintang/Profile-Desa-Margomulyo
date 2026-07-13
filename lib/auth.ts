import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 jam

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET belum diatur di file .env. Tambahkan AUTH_SECRET sebelum menjalankan fitur login."
    );
  }

  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  adminId: number;
  username: string;
  nama: string | null;
  role: "admin";
};

/**
 * Membuat session JWT dan menyimpannya sebagai httpOnly cookie.
 * Dipanggil setelah kredensial admin berhasil diverifikasi.
 */
export async function createAdminSession(payload: AdminSession) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Membaca dan memverifikasi session dari cookie.
 * Mengembalikan null jika tidak ada session atau token tidak valid/kedaluwarsa.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Menghapus session (logout).
 */
export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Guard untuk dipanggil di awal setiap Server Action yang hanya boleh
 * diakses admin. Lempar error jika belum login, sehingga aksi dibatalkan
 * meskipun request langsung menyasar action (bukan lewat halaman).
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    throw new Error("UNAUTHORIZED: Anda harus login sebagai admin untuk melakukan aksi ini.");
  }

  return session;
}

export { SESSION_COOKIE_NAME };
