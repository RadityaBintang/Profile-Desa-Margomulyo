import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import {
  createPerangkatDesa,
  deletePerangkatDesa,
  updatePerangkatDesa,
} from "./actions";

type PerangkatItem = {
  id: number;
  nama: string;
  jabatan: string;
  foto: string | null;
  urutan: number | null;
};

export default async function PerangkatDesaPage() {
  const session = await getAdminSession();
  const isAdmin = Boolean(session);

  const perangkat = await prisma.perangkatDesa.findMany({
    where: {
      status: "aktif",
    },
    orderBy: [{ urutan: "asc" }, { id: "asc" }],
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
          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-black text-blue-950">
              Tambah Perangkat Desa
            </h2>

            <form
              action={createPerangkatDesa}
              className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_120px] md:items-end"
            >
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Nama
                </label>
                <input
                  name="nama"
                  type="text"
                  placeholder="Nama perangkat desa"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Jabatan
                </label>
                <input
                  name="jabatan"
                  type="text"
                  placeholder="Jabatan"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Urutan
                </label>
                <input
                  name="urutan"
                  type="number"
                  defaultValue={perangkat.length + 1}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700">
                  Foto
                </label>
                <input
                  name="foto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Tambah
              </button>
            </form>
          </div>
        )}

        {isAdmin && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-800">
            Mode admin aktif. Kamu dapat menambah, mengedit, menghapus, dan
            mengupload foto perangkat desa.
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

          {perangkat.length === 0 && (
            <p className="mt-10 text-center text-slate-500">
              Belum ada data perangkat desa.
            </p>
          )}
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
  const deleteById = deletePerangkatDesa.bind(null, item.id);

  return (
    <div className="w-full max-w-[280px] rounded-3xl border border-blue-100 bg-white p-4 text-center shadow-md">
      <form action={updateById}>
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
          Upload / Ganti Foto
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

        <input
          name="urutan"
          type="number"
          defaultValue={item.urutan || 0}
          placeholder="Urutan"
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-xs text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-blue-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
        >
          Simpan Perubahan
        </button>
      </form>

      <form action={deleteById} className="mt-2">
        <button
          type="submit"
          className="w-full rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
        >
          Hapus
        </button>
      </form>
    </div>
  );
}