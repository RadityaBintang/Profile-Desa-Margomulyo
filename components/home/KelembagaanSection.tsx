import { UsersRound } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

type Lembaga = {
  id: number;
  namaLembaga: string;
  singkatan: string | null;
  deskripsi: string | null;
};

export function KelembagaanSection({ data }: { data: Lembaga[] }) {
  return (
    <section className="py-20">
      <div className="container-desa">
        <SectionTitle title="Kelembagaan Desa" description="Daftar lembaga desa yang mendukung tata kelola dan pemberdayaan masyarakat." />
        <div className="grid gap-5 md:grid-cols-5">
          {data.map((item) => (
            <div key={item.id} className="rounded-3xl border border-blue-100 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-700"><UsersRound /></div>
              <h3 className="mt-4 font-bold text-slate-900">{item.singkatan || item.namaLembaga}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.deskripsi || item.namaLembaga}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
