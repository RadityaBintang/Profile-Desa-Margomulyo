import Image from "next/image";
import { Upload, Landmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { updateGambarLembagaDesa } from "@/app/actions/lembaga-desa";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LembagaDesaPage() {
  const session = await getAdminSession();
  const isAdmin = Boolean(session);

  const profil = await prisma.profilDesa.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      namaDesa: true,
      gambarLembagaDesa: true,
    },
  });

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
            Informasi lembaga desa yang berperan dalam mendukung pemerintahan,
            pelayanan, dan pemberdayaan masyarakat Desa Margomulyo.
          </p>
        </div>
      </section>

      <section className="-mt-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  {profil?.namaDesa || "Desa Margomulyo"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
                  Gambar Lembaga Desa
                </h2>
              </div>

              {isAdmin && (
                <form
                  action={updateGambarLembagaDesa}
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
              {profil?.gambarLembagaDesa ? (
                <Image
                  src={profil.gambarLembagaDesa}
                  alt="Gambar Lembaga Desa"
                  fill
                  sizes="100vw"
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                    <Landmark size={44} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-900">
                    Gambar Lembaga Desa Belum Diupload
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                    Admin dapat mengunggah gambar lembaga desa melalui tombol
                    upload di bagian atas halaman ini.
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <p className="mt-4 text-center text-xs font-semibold text-blue-700">
                Mode admin aktif. Gambar lembaga desa dapat diperbarui dari
                halaman ini.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}