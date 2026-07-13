import Link from "next/link";
import { prisma } from "@/lib/prisma";
<<<<<<< HEAD
import { getAdminSession } from "@/lib/auth";
=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

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
<<<<<<< HEAD
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
=======
  const kegiatan: KegiatanItem[] = await prisma.kegiatan.findMany({
    where: {
      status: "publish" as any,
    },
    orderBy: {
      tanggal: "desc",
    },
  });
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

  return (
    <main className="kegiatan-page">
      <div className="container-desa">
        <section className="kegiatan-hero-banner">
          <div className="kegiatan-hero-overlay">
            <h1>Kegiatan Desa</h1>
          </div>
<<<<<<< HEAD

          {session && (
            <Link href="/kegiatan/tambah" className="kegiatan-admin-add-button">
              + Tambah Kegiatan
            </Link>
          )}
=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c
        </section>

        <section className="kegiatan-list-section">
          <div className="kegiatan-card-grid">
            {kegiatan.map((activity) => {
              const date = getDateParts(activity.tanggal);
              const activitySlug = activity.slug || String(activity.id);

              return (
                <Link
                  href={`/kegiatan/${activitySlug}`}
                  className="kegiatan-card"
                  key={activity.id}
                >
                  <div className="kegiatan-image-wrapper">
                    <img
                      src={activity.gambar || "/images/kegiatan/default.jpg"}
                      alt={activity.judul}
                      className="kegiatan-image"
                    />

                    <div className="kegiatan-date-badge">
                      <span className="kegiatan-date-day">{date.day}</span>
                      <span className="kegiatan-date-month">{date.month}</span>
                      <span className="kegiatan-date-year">{date.year}</span>
                    </div>
                  </div>

                  <div className="kegiatan-card-content">
                    <h2>{activity.judul}</h2>

                    <p>
                      {activity.ringkasan ||
                        "Warga bergotong royong mendukung program pembangunan dan kebersamaan desa."}
                    </p>

                    <div className="kegiatan-location">
                      <span>▣</span>
                      <span>{activity.lokasi || "Padukuhan Margomulyo"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {kegiatan.length === 0 && (
              <div className="kegiatan-empty-state">
                Belum ada data kegiatan desa.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}