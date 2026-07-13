import Link from "next/link";
import { FileDown } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

type ProdukHukum = {
  id: number;
  jenis: string;
  nomor: string;
  tahun: number;
  judul: string;
  fileDokumen: string | null;
};

export function ProdukHukumSection({ data }: { data: ProdukHukum[] }) {
  return (
    <section className="bg-blue-50 py-20">
      <div className="container-desa">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle title="Produk Hukum Desa" description="Dokumen hukum desa seperti Perdes, Perkades, SK Kades, APBDes, dan RKPDes." />
          <Link href="/produk-hukum" className="font-semibold text-blue-700">Lihat semua →</Link>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-5 py-4">No</th>
                  <th className="px-5 py-4">Jenis</th>
                  <th className="px-5 py-4">Nomor</th>
                  <th className="px-5 py-4">Judul</th>
                  <th className="px-5 py-4">Tahun</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.jenis.replaceAll("_", " ")}</span></td>
                    <td className="px-5 py-4">{item.nomor}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">{item.judul}</td>
                    <td className="px-5 py-4">{item.tahun}</td>
                    <td className="px-5 py-4">
                      {item.fileDokumen ? (
                        <a href={`/dokumen/${item.fileDokumen}`} className="inline-flex items-center gap-2 font-semibold text-blue-700">
                          <FileDown size={16} /> Download
                        </a>
                      ) : <span className="text-slate-400">Belum ada file</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
