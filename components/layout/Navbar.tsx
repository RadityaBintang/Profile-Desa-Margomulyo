import Link from "next/link";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/auth";

const menus = [
  { label: "Beranda", href: "/" },
 { label: "Profil Desa", href: "/profil/visi-misi" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Kelembagaan", href: "/kelembagaan" },
  { label: "Produk Hukum", href: "/produk-hukum" },
  { label: "Kontak", href: "/kontak" },
  { label: "Perangkat Desa", href: "/profil/perangkat-desa" },
];

export async function Navbar() {
  // Navbar adalah Server Component async, jadi session admin bisa langsung
  // dibaca di sini tanpa perlu request tambahan di sisi client.
  const session = await getAdminSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="container-desa flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg font-bold text-white">D</div>
          <div>
            <p className="font-bold text-slate-900">DESA MARGOMULYO</p>
            <p className="text-xs text-slate-500">Kecamatan Ngemplak, Kabupaten Sleman</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
            {menus.map((menu) => (
              <Link key={menu.href} href={menu.href} className="transition hover:text-blue-600">
                {menu.label}
              </Link>
            ))}
          </div>

          {/* Area khusus admin: sengaja dipisah dengan garis dan gaya yang
              lebih senyap dari menu publik supaya tidak mengganggu
              pengunjung biasa, tapi tetap mudah ditemukan admin. */}
          <div className="navbar-admin-area">
            {session ? (
              <>
                <span className="navbar-admin-name">
                  <ShieldCheck size={15} />
                  <span className="navbar-login-text">{session.nama || session.username}</span>
                </span>
                <form action={logoutAdmin}>
                  <button type="submit" className="navbar-login-button" title="Keluar">
                    <LogOut size={16} />
                    <span className="navbar-login-text">Keluar</span>
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="navbar-login-button" title="Login Admin">
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
