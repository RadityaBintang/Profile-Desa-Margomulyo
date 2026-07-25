import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Tag,
  UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatTanggal(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTanggalSingkat(date: Date): string {
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

type DetailKegiatanPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DetailKegiatanPage({
  params,
}: DetailKegiatanPageProps) {
  const { slug } = await params;

  const numericId = Number(slug);
  const isNumericSlug =
    Number.isInteger(numericId) && numericId > 0;

  const kegiatan = await prisma.kegiatan.findFirst({
    where: {
      status: "publish" as any,
      OR: [
        {
          slug,
        },
        ...(isNumericSlug
          ? [
              {
                id: numericId,
              },
            ]
          : []),
      ],
    },
  });

  if (!kegiatan) {
    notFound();
  }

  const [kegiatanLainnya, semuaKategori, session] =
    await Promise.all([
      prisma.kegiatan.findMany({
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
      }),

      prisma.kegiatan.findMany({
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
      }),

      getAdminSession(),
    ]);

  const badge = getDateBadge(kegiatan.tanggal);
  const isAdmin = session?.role === "admin";

  return (
    <main className="detail-activity-page">
      <div className="container-desa">
        {/* Toolbar halaman */}
        <div className="detail-toolbar">
          <Link
            href="/kegiatan"
            className="
              detail-back-button
              inline-flex items-center justify-center gap-2
              rounded-xl border border-slate-200
              bg-white px-4 py-2.5
              text-sm font-semibold text-slate-700
              shadow-sm transition-all duration-200
              hover:-translate-y-0.5
              hover:border-blue-300
              hover:bg-blue-50
              hover:text-blue-700
              hover:shadow-md
            "
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Kegiatan</span>
          </Link>

          {isAdmin && (
            <Link
              href={`/kegiatan/edit?id=${kegiatan.id}`}
              className="
                detail-edit-button
                inline-flex items-center justify-center gap-2
                rounded-xl border border-blue-600
                bg-blue-600 px-5 py-2.5
                text-sm font-semibold text-white
                shadow-sm transition-all duration-200
                hover:-translate-y-0.5
                hover:border-blue-700
                hover:bg-blue-700
                hover:shadow-lg
              "
            >
              <Pencil size={17} strokeWidth={2.2} />
              <span>Edit Kegiatan</span>
            </Link>
          )}
        </div>

        <div className="detail-activity-layout">
          <article className="detail-activity-main">
            {/* Gambar utama */}
            <section className="detail-activity-hero">
              <img
                src={
                  kegiatan.gambar ||
                  "/images/kegiatan/default.jpg"
                }
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
                    <Tag size={15} />
                    <span>{kegiatan.kategori}</span>
                  </div>
                )}

                <h1>{kegiatan.judul}</h1>

                <div className="detail-meta-row">
                  <span>
                    <CalendarDays size={17} />
                    {formatTanggal(kegiatan.tanggal)}
                  </span>

                  <span>
                    <MapPin size={17} />
                    {kegiatan.lokasi ||
                      "Lokasi belum diisi"}
                  </span>

                  <span>
                    <UserRound size={17} />
                    Desa Margomulyo
                  </span>
                </div>
              </div>
            </section>

            {/* Isi kegiatan */}
            <section className="detail-activity-content-layout">
              <div className="detail-activity-content">
                {kegiatan.ringkasan && (
                  <p className="detail-lead-text">
                    {kegiatan.ringkasan}
                  </p>
                )}

                <div className="detail-body-text">
                  {kegiatan.isi ? (
                    kegiatan.isi
                      .split("\n")
                      .filter(
                        (paragraph) =>
                          paragraph.trim() !== ""
                      )
                      .map((paragraph, index) => (
                        <p key={index}>
                          {paragraph}
                        </p>
                      ))
                  ) : (
                    <p>
                      Isi lengkap kegiatan belum tersedia.
                    </p>
                  )}
                </div>
              </div>

              {/* Informasi kegiatan */}
              <aside className="detail-info-card">
                <h2>Informasi Kegiatan</h2>

                <div className="detail-info-item">
                  <span className="detail-info-icon">
                    <CalendarDays size={20} />
                  </span>

                  <div>
                    <small>Tanggal</small>

                    <strong>
                      {formatTanggalSingkat(
                        kegiatan.tanggal
                      )}
                    </strong>
                  </div>
                </div>

                <div className="detail-info-item">
                  <span className="detail-info-icon">
                    <MapPin size={20} />
                  </span>

                  <div>
                    <small>Tempat</small>

                    <strong>
                      {kegiatan.lokasi ||
                        "Lokasi belum diisi"}
                    </strong>
                  </div>
                </div>

                {kegiatan.kategori && (
                  <div className="detail-info-item">
                    <span className="detail-info-icon">
                      <Tag size={20} />
                    </span>

                    <div>
                      <small>Kategori</small>
                      <strong>
                        {kegiatan.kategori}
                      </strong>
                    </div>
                  </div>
                )}
              </aside>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="detail-activity-sidebar">
            <div className="detail-sidebar-card">
              <h2>Kegiatan Lainnya</h2>

              <div className="detail-sidebar-line" />

              <div className="other-activity-list">
                {kegiatanLainnya.map((item) => (
                  <Link
                    href={`/kegiatan/${
                      item.slug || item.id
                    }`}
                    className="other-activity-item"
                    key={item.id}
                  >
                    <img
                      src={
                        item.gambar ||
                        "/images/kegiatan/default.jpg"
                      }
                      alt={item.judul}
                    />

                    <div>
                      <small>
                        {formatTanggalSingkat(
                          item.tanggal
                        )}
                      </small>

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

              <div className="detail-sidebar-line" />

              <div className="detail-category-list">
                {semuaKategori.map((item) =>
                  item.kategori ? (
                    <span key={item.kategori}>
                      <Tag size={14} />
                      {item.kategori}
                    </span>
                  ) : null
                )}

                {semuaKategori.length === 0 && (
                  <p className="detail-empty-text">
                    Belum ada kategori.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}