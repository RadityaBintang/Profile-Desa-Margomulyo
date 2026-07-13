import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session";

// Daftar halaman yang hanya boleh diakses admin yang sudah login.
// Tambahkan pola baru di sini setiap kali membuat halaman kelola/tambah/edit baru.
const ADMIN_ONLY_PATTERNS: RegExp[] = [
  /^\/kegiatan\/tambah$/,
  /^\/kegiatan\/[^/]+\/edit$/,
];

function isAdminOnlyPath(pathname: string) {
  return ADMIN_ONLY_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminOnlyPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error("AUTH_SECRET tidak diatur");

    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/kegiatan/tambah", "/kegiatan/:slug/edit"],
};
