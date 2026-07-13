import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
<<<<<<< HEAD
import { getAdminSession } from "@/lib/auth";
=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

function formatTanggal(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTanggalSingkat(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDateBadge(date: Date) {
  const tanggal = new Date(date);

  return {
    day: tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
    }),
    month: tanggal.toLocaleDateString("id-ID", {
      month: "short",
    }),
    year: tanggal.toLocaleDateString("id-ID", {
      year: "numeric",
    }),
  };
}

export default async function DetailKegiatanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const numericId = Number(slug);

  const kegiatan = Number.isNaN(numericId)
    ? await prisma.kegiatan.findFirst({
        where: {
          slug,
          status: "publish" as any,
        },
      })
    : await prisma.kegiatan.findFirst({
        where: {
          OR: [
            {
              slug,
            },
            {
              id: numericId,
            },
          ],
          status: "publish" as any,
        },
      });

  if (!kegiatan) {
    notFound();
  }

  const kegiatanLainnya = await prisma.kegiatan.findMany({
    where: {
      status: "publish" as any,
      NOT: {
        id: kegiatan.id,
      },
    },
    orderBy: {
      tanggal: "desc",
    },
    take: 2,
  });

  const semuaKategori = await prisma.kegiatan.findMany({
    where: {
      status: "publish" as any,
      kategori: {
        not: null,
      },
    },
    select: {
      kategori: true,
    },
    distinct: ["kategori"],
  });

  const badge = getDateBadge(kegiatan.tanggal);
<<<<<<< HEAD
  const session = await getAdminSession();
  const activitySlug = kegiatan.slug || String(kegiatan.id);
=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

  return (
    <main className="detail-activity-page">
      <div className="container-desa">
<<<<<<< HEAD
        <div className="detail-toolbar">
          <Link href="/kegiatan" className="detail-back-button">
            ← Kembali ke Kegiatan
          </Link>

          {session && (
            <Link
              href={`/kegiatan/${activitySlug}/edit`}
              className="detail-edit-button"
            >
              Edit Kegiatan
            </Link>
          )}
        </div>
=======
        <Link href="/kegiatan" className="detail-back-button">
          ← Kembali ke Kegiatan
        </Link>
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c

        <div className="detail-activity-layout">
          <article className="detail-activity-main">
            <section className="detail-activity-hero">
              <img
                src={kegiatan.gambar || "/images/kegiatan/default.jpg"}
                alt={kegiatan.judul}
                className="detail-activity-image"
              />

              <div className="detail-activity-date-badge">
                <span>{badge.day}</span>
                <small>
                  {badge.month} {badge.year}
                </small>
              </div>

              <div className="detail-activity-overlay">
                {kegiatan.kategori && (
                  <div className="detail-category-badge">
                    {kegiatan.kategori}
                  </div>
                )}

                <h1>{kegiatan.judul}</h1>

                <div className="detail-meta-row">
                  <span>📅 {formatTanggal(kegiatan.tanggal)}</span>
                  <span>📍 {kegiatan.lokasi || "Lokasi belum diisi"}</span>
                  <span>👤 Desa Margomulyo</span>
                </div>
              </div>
            </section>

            <section className="detail-activity-content-layout">
              <div className="detail-activity-content">
                {kegiatan.ringkasan && (
                  <p className="detail-lead-text">{kegiatan.ringkasan}</p>
                )}

                <div className="detail-body-text">
                  {kegiatan.isi ? (
                    kegiatan.isi
                      .split("\n")
                      .filter((paragraph) => paragraph.trim() !== "")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                  ) : (
                    <p>Isi lengkap kegiatan belum tersedia.</p>
                  )}
                </div>
              </div>

              <aside className="detail-info-card">
                <h2>Informasi Kegiatan</h2>

                <div className="detail-info-item">
                  <span className="detail-info-icon">📅</span>
                  <div>
                    <small>Tanggal</small>
                    <strong>{formatTanggalSingkat(kegiatan.tanggal)}</strong>
                  </div>
                </div>

                <div className="detail-info-item">
                  <span className="detail-info-icon">📍</span>
                  <div>
                    <small>Tempat</small>
                    <strong>{kegiatan.lokasi || "Lokasi belum diisi"}</strong>
                  </div>
                </div>

                {kegiatan.kategori && (
                  <div className="detail-info-item">
                    <span className="detail-info-icon">🏷️</span>
                    <div>
                      <small>Kategori</small>
                      <strong>{kegiatan.kategori}</strong>
                    </div>
                  </div>
                )}
              </aside>
            </section>
          </article>

          <aside className="detail-activity-sidebar">
            <div className="detail-sidebar-card">
              <h2>Kegiatan Lainnya</h2>

              <div className="detail-sidebar-line"></div>

              <div className="other-activity-list">
                {kegiatanLainnya.map((item) => (
                  <Link
                    href={`/kegiatan/${item.slug || item.id}`}
                    className="other-activity-item"
                    key={item.id}
                  >
                    <img
                      src={item.gambar || "/images/kegiatan/default.jpg"}
                      alt={item.judul}
                    />

                    <div>
                      <small>{formatTanggalSingkat(item.tanggal)}</small>
                      <h3>{item.judul}</h3>
                      <p>
                        {item.ringkasan ||
                          "Ringkasan kegiatan belum tersedia."}
                      </p>
                    </div>
                  </Link>
                ))}

                {kegiatanLainnya.length === 0 && (
                  <p className="detail-empty-text">
                    Belum ada kegiatan lainnya.
                  </p>
                )}
              </div>
            </div>

            <div className="detail-sidebar-card">
              <h2>Kategori</h2>

              <div className="detail-sidebar-line"></div>

              <div className="detail-category-list">
                {semuaKategori.map((item) =>
                  item.kategori ? (
                    <span key={item.kategori}>{item.kategori}</span>
                  ) : null
                )}

                {semuaKategori.length === 0 && (
                  <p className="detail-empty-text">Belum ada kategori.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}