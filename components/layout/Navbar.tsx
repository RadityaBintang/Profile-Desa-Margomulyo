import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/auth";

export async function Navbar() {
  const session = await getAdminSession();

  const profilMenus = [
    {
      label: "Visi & Misi",
      href: "/profil/visi-misi",
    },
    {
      label: "Struktur Organisasi",
      href: "/profil/struktur-organisasi",
    },
    {
      label: "Lembaga Desa",
      href: "/profil/lembaga-desa",
    },
    {
      label: "Perangkat Desa",
      href: "/profil/perangkat-desa",
    },
    {
      label: "Layanan Publik",
      href: "/layanan",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="bg-white">
        <div className="container-desa flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-4">
            <img
              src="/images/logo-margomulyo.png"
              alt="Logo Desa Margomulyo"
              className="h-14 w-14 rounded-full object-contain"
            />

            <div>
              <h1 className="text-lg font-black leading-tight text-slate-900">
                DESA MARGOMULYO
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Kecamatan Panggungrejo, Kabupaten Blitar
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {session && (
              <Link
                href="/admin/link-website"
                title="Link Website Admin"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
              >
                <BookOpen size={20} />
              </Link>
            )}

            <Link
              href="/"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Beranda
            </Link>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-blue-600">
                Profil Desa
                <ChevronDown
                  size={14}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="absolute left-0 top-full z-[999] mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
                {profilMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    {menu.label}
                  </Link>
                ))}
              </div>
            </details>

            <Link
              href="/kegiatan"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Kegiatan
            </Link>

            <Link
              href="/produk-hukum"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Produk Hukum
            </Link>

            <Link
              href="/kontak"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Kontak
            </Link>

            <div className="h-8 w-px bg-slate-200" />

            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
                  <ShieldCheck size={18} />
                  Administrator
                </div>

                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}