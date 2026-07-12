import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

type Kegiatan = {
  id: number;
  judul: string;
  slug: string | null;
  tanggal: Date;
  lokasi: string | null;
  ringkasan: string | null;
};

export function KegiatanSection({ data }: { data: Kegiatan[] }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-desa">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle title="Kegiatan Desa" description="Berita dan dokumentasi kegiatan terbaru di lingkungan desa." />
          <Link href="/kegiatan" className="font-semibold text-blue-700">Lihat semua →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {data.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="h-44 bg-blue-100" />
              <div className="p-6">
                <p className="text-sm text-blue-600">{item.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{item.judul}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.ringkasan}</p>
                <Link href={`/kegiatan/${item.slug || item.id}`} className="mt-5 inline-block font-semibold text-blue-700">Baca selengkapnya →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
