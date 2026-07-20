import { Building2, Clock } from "lucide-react";

type JamPelayananItem = {
  id?: number;
  hari?: string;
  jamBuka?: Date | string | null;
  jamTutup?: Date | string | null;
  keterangan?: string | null;
};

export function JamPelayanan({ data }: { data?: JamPelayananItem[] }) {
  return (
    <section className="relative z-20 -mt-12">
      <div className="container-desa">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
          <div className="grid min-h-[132px] grid-cols-1 lg:grid-cols-[280px_repeat(3,1fr)]">
            {/* Bagian kiri biru */}
            <div className="flex items-center gap-6 bg-[#0b6fb8] px-8 py-7 text-white">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[5px] border-white">
                <Clock size={36} strokeWidth={2.8} />
              </div>

              <div className="h-20 w-1.5 shrink-0 bg-[#f7c948]" />

              <div>
                <p className="text-xl leading-none">Jam</p>
                <h2 className="mt-1 text-2xl font-black leading-none">
                  Operasional
                </h2>
              </div>
            </div>

            {/* Senin - Kamis */}
            <div className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-7 text-center lg:border-l lg:border-t-0">
              <Building2 size={30} strokeWidth={2.4} className="mb-3 text-[#0b6fb8]" />

              <h3 className="text-lg font-black text-slate-950">
                Senin - Kamis
              </h3>

              <p className="mt-3 text-2xl font-medium tracking-tight text-slate-900">
                08.00–15.30 WIB
              </p>
            </div>

            {/* Jumat */}
            <div className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-7 text-center lg:border-l lg:border-t-0">
              <Building2 size={30} strokeWidth={2.4} className="mb-3 text-[#0b6fb8]" />

              <h3 className="text-lg font-black text-slate-950">
                Jumat
              </h3>

              <p className="mt-3 text-2xl font-medium tracking-tight text-slate-900">
                08.00–15.30 WIB
              </p>
            </div>

            {/* Sabtu - Minggu */}
            <div className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-7 text-center lg:border-l lg:border-t-0">
              <Building2 size={30} strokeWidth={2.4} className="mb-3 text-[#0b6fb8]" />

              <h3 className="text-lg font-black text-slate-950">
                Sabtu - Minggu
              </h3>

              <p className="mt-3 text-2xl font-medium tracking-tight text-slate-900">
                Tutup
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}