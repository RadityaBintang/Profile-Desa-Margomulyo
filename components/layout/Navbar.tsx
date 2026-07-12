import Link from "next/link";

const menus = [
  { label: "Beranda", href: "/" },
  { label: "Profil Desa", href: "/profil" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Kelembagaan", href: "/kelembagaan" },
  { label: "Produk Hukum", href: "/produk-hukum" },
  { label: "Kontak", href: "/kontak" },
];

export function Navbar() {
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
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
          {menus.map((menu) => (
            <Link key={menu.href} href={menu.href} className="transition hover:text-blue-600">
              {menu.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
