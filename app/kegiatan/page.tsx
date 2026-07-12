import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePublicKegiatan } from "./actions";

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

export default async function KegiatanPage() {
  const kegiatan: KegiatanItem[] = await prisma.kegiatan.findMany({
    where: {
      status: "publish" as any,
    },
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <main className="public-page">
      <section className="kegiatan-section">
        <div className="container-desa">
          <div className="public-section-header">
            <div className="section-heading">
              <div className="section-line"></div>

              <div>
                <p className="section-subtitle">KEGIATAN-KEGIATAN</p>
                <h1 className="section-title">Desa</h1>
              </div>
            </div>

            <Link href="/kegiatan/tambah" className="public-primary-button">
              + Tambah Kegiatan
            </Link>
          </div>

          <div className="activity-grid">
            {kegiatan.map((activity: KegiatanItem) => {
              const tanggal = new Date(activity.tanggal);

              const day = tanggal.toLocaleDateString("id-ID", {
                day: "2-digit",
              });

              const month = tanggal.toLocaleDateString("id-ID", {
                month: "long",
              });

              const year = tanggal.toLocaleDateString("id-ID", {
                year: "numeric",
              });

              const activitySlug = activity.slug ?? String(activity.id);

              return (
                <article className="activity-card" key={activity.id}>
                  <div className="activity-image-wrapper">
                    <img
                      src={activity.gambar || "/images/kegiatan/default.jpg"}
                      alt={activity.judul}
                      className="activity-image"
                    />

                    <div className="activity-date">
                      <span className="activity-date-number">{day}</span>
                      <span className="activity-date-month">{month}</span>
                      <span className="activity-date-year">{year}</span>
                    </div>
                  </div>

                  <div className="activity-content">
                    <h3 className="activity-title">{activity.judul}</h3>

                    <p className="activity-description">
                      {activity.ringkasan || "Belum ada ringkasan kegiatan."}
                    </p>

                    <div className="activity-location">
                      <span>▣</span>
                      <span>{activity.lokasi || "Lokasi belum diisi"}</span>
                    </div>

                    <div className="public-action-row">
                      <Link
                        href={`/kegiatan/${activitySlug}`}
                        className="public-edit-button"
                      >
                        Detail
                      </Link>

                      

                      <form action={deletePublicKegiatan.bind(null, activity.id)}>
                        <button type="submit" className="public-delete-button">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}

            {kegiatan.length === 0 && (
              <p>Belum ada data kegiatan. Silakan tambahkan kegiatan baru.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}