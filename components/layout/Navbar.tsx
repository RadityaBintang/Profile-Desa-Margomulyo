import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
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

  const mainMenus = [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Kegiatan",
      href: "/kegiatan",
    },
    {
      label: "Produk Hukum",
      href: "/produk-hukum",
    },
    {
      label: "Kontak",
      href: "/kontak",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="bg-white">
        <div className="container-desa relative flex items-center justify-between gap-4 py-4 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3 lg:gap-4">
            <img
              src="/images/logo-margomulyo.png"
              alt="Logo Desa Margomulyo"
              className="h-11 w-11 shrink-0 rounded-full object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black leading-tight text-slate-900 sm:text-base lg:text-lg">
                DESA MARGOMULYO
              </h1>
              <p className="max-w-[190px] text-xs font-medium leading-5 text-slate-500 sm:max-w-none sm:text-sm">
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

          <details className="group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100">
              <Menu size={22} />
            </summary>

            <div className="absolute right-0 top-full z-[999] mt-3 w-[min(92vw,360px)] rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl">
              <div className="mb-4 rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  DESA MARGOMULYO
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Kecamatan Panggungrejo, Kabupaten Blitar
                </p>
              </div>

              <div className="grid gap-2">
                {session && (
                  <Link
                    href="/admin/link-website"
                    className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    <BookOpen size={18} />
                    Link Website Admin
                  </Link>
                )}

                {mainMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    {menu.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-slate-100" />

                <p className="px-4 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Profil Desa
                </p>

                {profilMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    {menu.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-slate-100" />

                {session ? (
                  <>
                    <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                      <ShieldCheck size={18} />
                      Administrator
                    </div>

                    <form action={logoutAdmin}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    <LogIn size={16} />
                    Login Admin
                  </Link>
                )}
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}