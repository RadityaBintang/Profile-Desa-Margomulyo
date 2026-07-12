import { Clock } from "lucide-react";

type JamItem = {
  id: number;
  hari: string;
  jamBuka: Date | null;
  jamTutup: Date | null;
  keterangan: string | null;
};

function formatJam(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(value);
}

export function JamPelayanan({ data }: { data: JamItem[] }) {
  return (
    <section className="-mt-8 relative z-10">
      <div className="container-desa rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-700"><Clock /></div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Jam Pelayanan Desa</h2>
            <p className="text-sm text-slate-500">Informasi waktu pelayanan kantor desa untuk masyarakat.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {data.length > 0 ? data.map((item) => (
            <div key={item.id} className="rounded-2xl bg-blue-50 p-5">
              <p className="font-semibold text-slate-900">{item.hari}</p>
              <p className="mt-2 text-blue-700">
                {item.jamBuka && item.jamTutup ? `${formatJam(item.jamBuka)} - ${formatJam(item.jamTutup)} WIB` : item.keterangan || "Tutup"}
              </p>
            </div>
          )) : (
            <p className="text-slate-500">Data jam pelayanan belum tersedia.</p>
          )}
        </div>
      </div>
    </section>
  );
}
