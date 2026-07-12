import { KontakLokasi } from "@/components/home/KontakLokasi";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getProfilDesa } from "@/lib/queries/profil";

export default async function ProfilPage() {
  const profil = await getProfilDesa();

  const profilKontak = profil
    ? {
        alamat: profil.alamat,
        email: profil.email,
        telepon: profil.telepon,
        mapsEmbed: profil.mapsEmbed,
      }
    : null;

  return (
    <main>
      <section className="container-desa py-16">
        <SectionTitle title="Profil Desa" />

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">
            {profil?.namaDesa || "Desa Margomulyo"}
          </h1>

          <p className="mt-4 leading-8 text-slate-600">
            {profil?.deskripsi || "Data profil desa belum tersedia."}
          </p>

          <h2 className="mt-8 text-xl font-bold">Visi</h2>
          <p className="mt-2 text-slate-600">
            {profil?.visi || "Visi desa belum tersedia."}
          </p>

          <h2 className="mt-8 text-xl font-bold">Misi</h2>
          <p className="mt-2 whitespace-pre-line text-slate-600">
            {profil?.misi || "Misi desa belum tersedia."}
          </p>
        </div>
      </section>

      <KontakLokasi profil={profilKontak} />
    </main>
  );
}