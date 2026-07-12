import { SectionTitle } from "@/components/ui/SectionTitle";
import { getLayananAktif } from "@/lib/queries/layanan";

export default async function LayananPage() {
  const layanan = await getLayananAktif();

  return (
    <main className="container-desa py-16">
      <SectionTitle title="Layanan Desa" />
      <div className="grid gap-6 md:grid-cols-3">
        {layanan.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{item.namaLayanan}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.deskripsi}</p>
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700">
              <p><strong>Estimasi:</strong> {item.estimasiWaktu || "-"}</p>
              <p><strong>Biaya:</strong> {item.biaya || "-"}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
