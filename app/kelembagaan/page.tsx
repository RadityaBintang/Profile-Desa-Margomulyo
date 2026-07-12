import { SectionTitle } from "@/components/ui/SectionTitle";
import { getLembagaAktif } from "@/lib/queries/lembaga";

export default async function KelembagaanPage() {
  const lembaga = await getLembagaAktif();

  return (
    <main className="container-desa py-16">
      <SectionTitle title="Kelembagaan Desa" />
      <div className="grid gap-6 md:grid-cols-3">
        {lembaga.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{item.singkatan || item.namaLembaga}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.deskripsi}</p>
            <p className="mt-4 text-sm text-slate-500">Ketua: {item.ketua || "-"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
