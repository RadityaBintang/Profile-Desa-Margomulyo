import Link from "next/link";
import { Eye, MapPin, Pencil, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { DeleteKegiatanButton } from "@/components/kegiatan/DeleteKegiatanButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type KegiatanItem = {
  id: number;
  judul: string;
  slug: string | null;
  tanggal: Date;
  lokasi: string | null;
  ringkasan: string | null;
  gambar: string | null;
  status: string | null;
};

function getDateParts(date: Date) {
  const tanggal = new Date(date);

  return {
    day: tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
    }),
    month: tanggal.toLocaleDateString("id-ID", {
      month: "long",
    }),
    year: tanggal.toLocaleDateString("id-ID", {
      year: "numeric",
    }),
  };
}

export default async function KegiatanPage() {
  const [kegiatan, session] = await Promise.all([
    prisma.kegiatan.findMany({
      where: {
        status: "publish" as any,
      },
      orderBy: {
        tanggal: "desc",
      },
    }) as Promise<KegiatanItem[]>,

    getAdminSession(),
  ]);

  const isAdmin = session?.role === "admin";

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="mx-auto w-[min(1280px,calc(100%-32px))]">
        <section className="relative mt-10 overflow-hidden rounded-[28px] bg-blue-700 bg-cover bg-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 92, 180, 0.72), rgba(0, 92, 180, 0.72)), url('/images/kegiatan/hero-kegiatan.jpg')",
            }}
          />

          <div className="relative flex min-h-[150px] items-center justify-center px-6 text-center text-white">
            <h1 className="text-3xl font-black md:text-4xl">
              Kegiatan Desa
            </h1>
          </div>

          {isAdmin && (
            <Link
              href="/kegiatan/tambah"
              className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Tambah Kegiatan</span>
            </Link>
          )}
        </section>

        <section className="mt-12">
          <div className="grid grid-cols-1 gap-9 md:grid-cols-2 xl:grid-cols-3">
            {kegiatan.map((activity) => {
              const date = getDateParts(activity.tanggal);
              const activitySlug = activity.slug || String(activity.id);

              return (
                <article
                  className="group overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl"
                  key={activity.id}
                >
                  <Link
                    href={`/kegiatan/${activitySlug}`}
                    className="block"
                    aria-label={`Buka detail ${activity.judul}`}
                  >
                    <div className="relative h-64 overflow-hidden bg-blue-100">
                      <img
                        src={
                          activity.gambar ||
                          "/images/kegiatan/default.jpg"
                        }
                        alt={activity.judul}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-0 top-0 flex h-36 w-28 flex-col items-center justify-center bg-blue-700 text-white shadow-lg">
                        <span className="text-5xl font-black leading-none">
                          {date.day}
                        </span>

                        <span className="mt-1 text-base font-bold leading-tight">
                          {date.month}
                        </span>

                        <span className="text-base font-bold leading-tight">
                          {date.year}
                        </span>

                        <div className="absolute -bottom-[18px] h-0 w-0 border-l-[56px] border-r-[56px] border-t-[18px] border-l-transparent border-r-transparent border-t-blue-700" />
                      </div>
                    </div>
                  </Link>

                  <div className="p-8">
                    <Link
                      href={`/kegiatan/${activitySlug}`}
                      className="block"
                    >
                      <h2 className="text-2xl font-black leading-tight text-slate-950 transition group-hover:text-blue-700">
                        {activity.judul}
                      </h2>
                    </Link>

                    <p className="mt-4 line-clamp-3 text-lg leading-8 text-slate-600">
                      {activity.ringkasan ||
                        "Warga bergotong royong mendukung program pembangunan dan kebersamaan desa."}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-base text-slate-500">
                      <MapPin size={18} strokeWidth={2} className="text-blue-700" />

                      <span>
                        {activity.lokasi || "Padukuhan Margomulyo"}
                      </span>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <Link
                        href={`/kegiatan/${activitySlug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md"
                      >
                        <Eye size={17} strokeWidth={2.2} />
                        <span>Lihat Detail</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href={`/kegiatan/edit?id=${activity.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-700 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-700 hover:text-white hover:shadow-md"
                        >
                          <Pencil size={16} strokeWidth={2.2} />
                          <span>Edit</span>
                        </Link>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="mt-3">
                        <DeleteKegiatanButton
                          id={activity.id}
                          judul={activity.judul}
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {kegiatan.length === 0 && (
              <div className="col-span-full rounded-3xl border border-blue-100 bg-blue-50 p-10 text-center">
                <h2 className="text-2xl font-black text-slate-950">
                  Belum Ada Kegiatan Desa
                </h2>

                <p className="mt-2 text-slate-600">
                  Data kegiatan desa belum tersedia.
                </p>

                {isAdmin && (
                  <Link
                    href="/kegiatan/tambah"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    <Plus size={17} />
                    Tambah Kegiatan
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}