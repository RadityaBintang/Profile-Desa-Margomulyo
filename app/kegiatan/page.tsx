import Link from "next/link";
import {
  Eye,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";

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
    <main className="kegiatan-page">
      <div className="container-desa">
        <section className="kegiatan-hero-banner">
          <div className="kegiatan-hero-overlay">
            <h1>Kegiatan Desa</h1>
          </div>

          {isAdmin && (
            <Link
              href="/kegiatan/tambah"
              className="kegiatan-admin-add-button"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Tambah Kegiatan</span>
            </Link>
          )}
        </section>

        <section className="kegiatan-list-section">
          <div className="kegiatan-card-grid">
            {kegiatan.map((activity) => {
              const date = getDateParts(activity.tanggal);

              const activitySlug =
                activity.slug || String(activity.id);

              return (
                <article
                  className="kegiatan-card"
                  key={activity.id}
                >
                  <Link
                    href={`/kegiatan/${activitySlug}`}
                    className="kegiatan-card-detail-link"
                    aria-label={`Buka detail ${activity.judul}`}
                  >
                    <div className="kegiatan-image-wrapper">
                      <img
                        src={
                          activity.gambar ||
                          "/images/kegiatan/default.jpg"
                        }
                        alt={activity.judul}
                        className="kegiatan-image"
                      />

                      <div className="kegiatan-date-badge">
                        <span className="kegiatan-date-day">
                          {date.day}
                        </span>

                        <span className="kegiatan-date-month">
                          {date.month}
                        </span>

                        <span className="kegiatan-date-year">
                          {date.year}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="kegiatan-card-content">
                    <Link
                      href={`/kegiatan/${activitySlug}`}
                      className="kegiatan-title-link"
                    >
                      <h2>{activity.judul}</h2>
                    </Link>

                    <p className="kegiatan-card-description">
                      {activity.ringkasan ||
                        "Warga bergotong royong mendukung program pembangunan dan kebersamaan desa."}
                    </p>

                    <div className="kegiatan-location">
                      <MapPin size={16} strokeWidth={2} />

                      <span>
                        {activity.lokasi ||
                          "Padukuhan Margomulyo"}
                      </span>
                    </div>

                    <div className="kegiatan-card-actions">
                      <Link
                        href={`/kegiatan/${activitySlug}`}
                        className="kegiatan-action-button kegiatan-detail-button"
                      >
                        <Eye size={17} strokeWidth={2.2} />
                        <span>Lihat Detail</span>
                      </Link>

                      {isAdmin && (
                        <div className="kegiatan-admin-actions">
                          <Link
                            href={`/kegiatan/edit?id=${activity.id}`}
                            className="kegiatan-action-button kegiatan-edit-button"
                          >
                            <Pencil
                              size={16}
                              strokeWidth={2.2}
                            />

                            <span>Edit</span>
                          </Link>

                          <DeleteKegiatanButton
                            id={activity.id}
                            judul={activity.judul}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
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