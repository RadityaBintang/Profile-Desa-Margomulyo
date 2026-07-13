import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-[#0B2E6F] text-white">
      <div className="container-desa grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold">Desa Margomulyo</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-blue-100">
            Mewujudkan desa yang maju, mandiri, sejahtera, dan melayani masyarakat melalui tata kelola pemerintahan yang baik.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Tautan Cepat</h4>
          <div className="mt-4 grid gap-2 text-sm text-blue-100">
            <Link href="/profil">Profil Desa</Link>
            <Link href="/kegiatan">Kegiatan</Link>
            <Link href="/produk-hukum">Produk Hukum</Link>
            <Link href="/kontak">Kontak</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Kontak</h4>
          <p className="mt-4 text-sm leading-6 text-blue-100">Jl. Raya Margomulyo No. 01<br />desamargomulyo@gmail.com<br />(0274) 123456</p>
        </div>
      </div>
      <div className="border-t border-blue-800 py-4 text-center text-sm text-blue-100">© 2026 Desa Margomulyo. All rights reserved.</div>
    </footer>
  );
}
