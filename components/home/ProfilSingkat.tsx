import { SectionTitle } from "@/components/ui/SectionTitle";

type Profil = {
  namaDesa: string;
  kecamatan: string | null;
  kabupaten: string | null;
  deskripsi: string | null;
};

export function ProfilSingkat({ profil }: { profil: Profil | null }) {
  return (
    <section className="py-20">
      <div className="container-desa grid items-center gap-10 lg:grid-cols-2">
        <div className="h-80 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-300 p-8 shadow-lg">
          <div className="flex h-full items-end rounded-2xl bg-white/60 p-6">
            <p className="text-2xl font-bold text-blue-900">Foto Kantor / Pemandangan Desa</p>
          </div>
        </div>
        <div>
          <SectionTitle label="Tentang Desa" title={profil?.namaDesa || "Desa Margomulyo"} />
          <p className="leading-8 text-slate-600">
            {profil?.deskripsi || "Desa Margomulyo merupakan desa yang berkomitmen dalam memberikan pelayanan publik yang baik, transparan, dan mudah diakses masyarakat."}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-blue-50 p-4"><p className="text-2xl font-bold text-blue-700">5.128</p><p className="text-sm text-slate-600">Jumlah Penduduk</p></div>
            <div className="rounded-2xl bg-blue-50 p-4"><p className="text-2xl font-bold text-blue-700">1.642</p><p className="text-sm text-slate-600">Jumlah KK</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
