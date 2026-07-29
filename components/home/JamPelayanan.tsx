import { getAdminSession } from "@/lib/auth";
import { updateJamPelayanan } from "@/app/actions/jam-pelayanan";
import { Building2, Clock, Save } from "lucide-react";

type JamPelayananItem = {
  id?: number;
  hari?: string;
  jamBuka?: Date | string | null;
  jamTutup?: Date | string | null;
  keterangan?: string | null;
  urutan?: number | null;
};

type JamDisplayItem = {
  id?: number;
  hari: string;
  jamBuka: Date | string | null;
  jamTutup: Date | string | null;
  keterangan: string | null;
  urutan: number;
};

const DEFAULT_JAM: JamDisplayItem[] = [
  {
    hari: "Senin - Kamis",
    jamBuka: "08:00",
    jamTutup: "15:30",
    keterangan: null,
    urutan: 1,
  },
  {
    hari: "Jumat",
    jamBuka: "08:00",
    jamTutup: "15:30",
    keterangan: null,
    urutan: 2,
  },
  {
    hari: "Sabtu - Minggu",
    jamBuka: null,
    jamTutup: null,
    keterangan: "Tutup",
    urutan: 3,
  },
];

function normalizeText(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function matchJam(defaultItem: JamDisplayItem, data?: JamPelayananItem[]) {
  const target = normalizeText(defaultItem.hari);

  return data?.find((item) => normalizeText(item.hari) === target);
}

function formatTimeInput(value?: Date | string | null) {
  if (!value) return "";

  if (typeof value === "string") {
    const directMatch = value.match(/^(\d{2}):(\d{2})/);
    if (directMatch) return `${directMatch[1]}:${directMatch[2]}`;

    const isoMatch = value.match(/T(\d{2}):(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}:${isoMatch[2]}`;

    return "";
  }

  const hours = String(value.getUTCHours()).padStart(2, "0");
  const minutes = String(value.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function formatJamLabel(item: JamDisplayItem) {
  if (item.keterangan && item.keterangan.toLowerCase().includes("tutup")) {
    return "Tutup";
  }

  const buka = formatTimeInput(item.jamBuka);
  const tutup = formatTimeInput(item.jamTutup);

  if (!buka || !tutup) {
    return item.keterangan || "Belum diatur";
  }

  return `${buka.replace(":", ".")}–${tutup.replace(":", ".")} WIB`;
}

export async function JamPelayanan({
  data,
  isAdmin: isAdminFromPage = false,
}: {
  data?: JamPelayananItem[];
  isAdmin?: boolean;
}) {
  const session = await getAdminSession();
  const isAdmin = isAdminFromPage || Boolean(session);

  const jamList = DEFAULT_JAM.map((defaultItem) => {
    const databaseItem = matchJam(defaultItem, data);

    return {
      ...defaultItem,
      id: databaseItem?.id,
      hari: databaseItem?.hari || defaultItem.hari,
      jamBuka: databaseItem?.jamBuka ?? defaultItem.jamBuka,
      jamTutup: databaseItem?.jamTutup ?? defaultItem.jamTutup,
      keterangan: databaseItem?.keterangan ?? defaultItem.keterangan,
      urutan: databaseItem?.urutan ?? defaultItem.urutan,
    };
  });

  return (
    <section className="relative z-20 -mt-12">
      <div className="container-desa">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
          <div className="grid min-h-[132px] grid-cols-1 lg:grid-cols-[280px_repeat(3,1fr)]">
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

            {jamList.map((item) => (
              <div
                key={item.hari}
                className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-7 text-center lg:border-l lg:border-t-0"
              >
                <Building2
                  size={30}
                  strokeWidth={2.4}
                  className="mb-3 text-[#0b6fb8]"
                />

                <h3 className="text-lg font-black text-slate-950">
                  {item.hari}
                </h3>

                <p className="mt-3 text-2xl font-medium tracking-tight text-slate-900">
                  {formatJamLabel(item)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
            <div className="mb-5 text-center">
              <p className="text-sm font-extrabold uppercase text-blue-600">
                Mode Admin Aktif
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">
                Edit Jam Operasional
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Ubah jam buka, jam tutup, atau keterangan pelayanan desa
                langsung dari beranda.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {jamList.map((item) => (
                <form
                  key={`edit-${item.hari}`}
                  action={updateJamPelayanan}
                  className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <input type="hidden" name="id" value={item.id || ""} />
                  <input type="hidden" name="hari" value={item.hari} />
                  <input type="hidden" name="urutan" value={item.urutan} />

                  <h4 className="mb-4 text-center text-lg font-black text-blue-900">
                    {item.hari}
                  </h4>

                  <div className="grid gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        name="jamBuka"
                        defaultValue={formatTimeInput(item.jamBuka)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        name="jamTutup"
                        defaultValue={formatTimeInput(item.jamTutup)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        name="keterangan"
                        defaultValue={item.keterangan || ""}
                        placeholder="Contoh: Tutup"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Isi “Tutup” jika layanan tidak buka. Kosongkan jika
                        menggunakan jam buka dan tutup.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800"
                    >
                      <Save size={14} />
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}