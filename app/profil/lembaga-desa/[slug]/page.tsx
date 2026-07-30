import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Landmark, Upload } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import {
  findLembagaBySlug,
  getLembagaMeta,
} from "@/lib/lembaga-desa";
import { updateGambarKepengurusanLembaga } from "@/app/actions/lembaga-kepengurusan";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DetailLembagaDesaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const meta = getLembagaMeta(slug);

  if (!meta) {
    notFound();
  }

  const [session, lembaga] = await Promise.all([
    getAdminSession(),
    findLembagaBySlug(slug),
  ]);

  const isAdmin = Boolean(session);
  const uploadAction = updateGambarKepengurusanLembaga.bind(null, slug);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/profil/lembaga-desa"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Kembali ke Lembaga Desa
          </Link>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-blue-100">
            Struktur Kepengurusan
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            {meta.label}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-blue-50 md:text-lg">
            {meta.deskripsi}
          </p>
        </div>
      </section>

      <section className="-mt-10 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  {meta.namaLembaga}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
                  Gambar Kepengurusan {meta.label}
                </h2>
              </div>

              {isAdmin && (
                <form
                  action={uploadAction}
                  className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 md:w-[360px]"
                >
                  <label className="text-sm font-bold text-slate-700">
                    Upload / Ganti Gambar
                  </label>

                  <input
                    type="file"
                    name="gambar"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    required
                    className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm"
                  />

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    <Upload size={16} />
                    Simpan Gambar
                  </button>

                  <p className="text-xs leading-5 text-slate-500">
                    Format gambar: JPG, PNG, atau WebP. Maksimal 4MB.
                  </p>
                </form>
              )}
            </div>

            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50 md:min-h-[620px]">
              {lembaga?.gambarKepengurusan ? (
                <img
                  src={lembaga.gambarKepengurusan}
                  alt={`Gambar Kepengurusan ${meta.label}`}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                    <Landmark size={44} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-900">
                    Gambar Kepengurusan Belum Diupload
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                    Admin dapat mengunggah gambar kepengurusan {meta.label}
                    melalui form upload di bagian atas halaman ini.
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <p className="mt-4 text-center text-xs font-semibold text-blue-700">
                Mode admin aktif. Gambar kepengurusan {meta.label} dapat
                diperbarui dari halaman ini.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}