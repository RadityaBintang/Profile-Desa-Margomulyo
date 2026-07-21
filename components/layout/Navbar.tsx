import Link from "next/link";
import { BookOpen, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/auth";
import { ProfilDesaDropdown } from "./ProfilDesaDropdown";

const menus = [
  { label: "Beranda", href: "/" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Produk Hukum", href: "/produk-hukum" },
  { label: "Kontak", href: "/kontak" },
];

export async function Navbar() {
  const session = await getAdminSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="container-desa flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo-margomulyo.png"
            alt="Logo Desa Margomulyo"
            className="h-12 w-12 rounded-full object-contain"
          />

          <div>
            <p className="font-bold text-slate-900">DESA MARGOMULYO</p>
            <p className="text-xs text-slate-500">
              Kecamatan Panggungrejo, Kabupaten Blitar
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
         <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
  {session && (
    <Link
      href="/admin/link-website"
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
      title="Link Website Admin"
    >
      <BookOpen size={18} />
    </Link>
  )}

  <Link href={menus[0].href} className="transition hover:text-blue-600">
    {menus[0].label}
  </Link>

  <ProfilDesaDropdown />

            {menus.slice(1).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="transition hover:text-blue-600"
              >
                {menu.label}
              </Link>
            ))}
          </div>

          <div className="navbar-admin-area">
            {session ? (
              <>
                <span className="navbar-admin-name">
                  <ShieldCheck size={15} />
                  <span className="navbar-login-text">
                    {session.nama || session.username}
                  </span>
                </span>

                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="navbar-login-button"
                    title="Keluar"
                  >
                    <LogOut size={16} />
                    <span className="navbar-login-text">Keluar</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="navbar-login-button"
                title="Login Admin"
              >
                <LogIn size={16} />
                <span className="navbar-login-text">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}