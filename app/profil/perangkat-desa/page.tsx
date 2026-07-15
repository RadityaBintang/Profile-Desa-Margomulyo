import { prisma } from "@/lib/prisma";
import { updatePerangkatDesa } from "./actions";

type PageProps = {
  searchParams: Promise<{
    admin?: string;
  }>;
};

type PerangkatItem = {
  id: number;
  nama: string;
  jabatan: string;
  foto: string | null;
};

export default async function PerangkatDesaPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Sementara:
  // /profil/perangkat-desa       -> tampilan biasa
  // /profil/perangkat-desa?admin=1 -> mode edit admin
  const isAdmin = params.admin === "1";

  const perangkat = await prisma.perangkatDesa.findMany({
    where: {
      status: "aktif",
    },
    orderBy: {
      urutan: "asc",
    },
  });

  const kepalaDesa = perangkat[0];
  const sekretaris = perangkat[1];
  const perangkatLain = perangkat.slice(2);

  return (
    <main className="min-h-screen bg-white pb-20">
      <section className="container-desa py-10">
        <div
          className="relative overflow-hidden rounded-[28px] bg-blue-700 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 92, 180, 0.72), rgba(0, 92, 180, 0.72)), url('/images/kegiatan/hero-kegiatan.jpg')",
          }}
        >
          <div className="flex min-h-[140px] flex-col items-center justify-center px-6 text-center text-white">
            <p className="text-sm font-extrabold uppercase tracking-wide">
              Profil Desa
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Perangkat Desa
            </h1>
          </div>
        </div>

        {isAdmin && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-800">
            Mode admin aktif. Foto, nama, dan jabatan perangkat desa dapat
            diedit langsung dari halaman ini.
          </div>
        )}

        <div className="mt-14">
          {kepalaDesa && (
            <div className="flex justify-center">
              <PerangkatCard item={kepalaDesa} isAdmin={isAdmin} besar />
            </div>
          )}

          {sekretaris && (
            <div className="mt-10 flex justify-center">
              <PerangkatCard item={sekretaris} isAdmin={isAdmin} besar />
            </div>
          )}

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {perangkatLain.map((item) => (
              <PerangkatCard key={item.id} item={item} isAdmin={isAdmin} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PerangkatCard({
  item,
  isAdmin,
  besar = false,
}: {
  item: PerangkatItem;
  isAdmin: boolean;
  besar?: boolean;
}) {
  if (isAdmin) {
    return <EditablePerangkatCard item={item} besar={besar} />;
  }

  return <StaticPerangkatCard item={item} besar={besar} />;
}

function StaticPerangkatCard({
  item,
  besar = false,
}: {
  item: PerangkatItem;
  besar?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto overflow-hidden rounded-2xl bg-blue-100 ${
          besar ? "h-40 w-40" : "h-36 w-36"
        }`}
      >
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.nama}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs font-bold text-blue-800">
            Foto Perangkat
          </div>
        )}
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-950">{item.nama}</h2>
      <p className="mt-1 text-sm text-slate-500">{item.jabatan}</p>
    </div>
  );
}

function EditablePerangkatCard({
  item,
  besar = false,
}: {
  item: PerangkatItem;
  besar?: boolean;
}) {
  const updateById = updatePerangkatDesa.bind(null, item.id);

  return (
    <form
      action={updateById}
      className="w-full max-w-[260px] rounded-3xl border border-blue-100 bg-white p-4 text-center shadow-md"
    >
      <input type="hidden" name="foto_lama" value={item.foto || ""} />

      <div
        className={`relative mx-auto overflow-hidden rounded-2xl bg-blue-100 ${
          besar ? "h-40 w-40" : "h-36 w-36"
        }`}
      >
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.nama}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs font-bold text-blue-800">
            Foto Perangkat
          </div>
        )}
      </div>

      <label className="mt-3 block cursor-pointer rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-100">
        Ganti Foto
        <input
          type="file"
          name="foto"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </label>

      <input
        name="nama"
        defaultValue={item.nama}
        placeholder="Nama perangkat"
        className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-black text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <input
        name="jabatan"
        defaultValue={item.jabatan}
        placeholder="Jabatan"
        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-xs text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="submit"
        className="mt-3 w-full rounded-full bg-blue-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}