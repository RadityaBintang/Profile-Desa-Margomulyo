import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import {
  findLembagaBySlug,
  LEMBAGA_DESA_ITEMS,
} from "@/lib/lembaga-desa";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LembagaDesaPage() {
  const session = await getAdminSession();
  const isAdmin = Boolean(session);

  const lembagaList = await Promise.all(
    LEMBAGA_DESA_ITEMS.map(async (item) => {
      const data = await findLembagaBySlug(item.slug);

      return {
        ...item,
        gambarKepengurusan: data?.gambarKepengurusan || null,
      };
    })
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-100">
            Profil Desa
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Lembaga Desa
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-blue-50 md:text-lg">
            Pilih lembaga desa untuk melihat atau mengunggah gambar struktur
            kepengurusan masing-masing lembaga.
          </p>
        </div>
      </section>

      <section className="-mt-12 px-6">
        <div className="mx-auto max-w-6xl">
          {isAdmin && (
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-bold text-blue-700">
              Mode admin aktif. Setiap lembaga memiliki halaman upload gambar
              kepengurusan masing-masing.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lembagaList.map((item) => (
              <Link
                key={item.slug}
                href={`/profil/lembaga-desa/${item.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-blue-50">
                  {item.gambarKepengurusan ? (
                    <img
                      src={item.gambarKepengurusan}
                      alt={`Gambar Kepengurusan ${item.label}`}
                      className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                        <Landmark size={38} />
                      </div>
                      <p className="mt-4 text-sm font-bold text-slate-500">
                        Gambar belum diupload
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-950">
                    {item.namaLembaga}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                    {item.deskripsi}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    Buka Halaman
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}