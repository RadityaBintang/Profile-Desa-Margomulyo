import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ImageIcon,
  MapPin,
  Save,
  Tag,
} from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { updatePublicKegiatan } from "../../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditKegiatanPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatTanggalInput(date: Date): string {
  const tanggal = new Date(date);

  const tahun = tanggal.getFullYear();
  const bulan = String(
    tanggal.getMonth() + 1
  ).padStart(2, "0");
  const hari = String(
    tanggal.getDate()
  ).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

export default async function EditKegiatanPage({
  params,
}: EditKegiatanPageProps) {
  const { slug } = await params;

  const session = await getAdminSession();

  if (!session) {
    const redirectTo =
      `/kegiatan/${encodeURIComponent(slug)}/edit`;

    redirect(
      `/login?redirectTo=${encodeURIComponent(
        redirectTo
      )}`
    );
  }

  const numericId = Number(slug);

  const isNumericId =
    Number.isInteger(numericId) &&
    numericId > 0;

  const kegiatan =
    await prisma.kegiatan.findFirst({
      where: {
        OR: [
          {
            slug,
          },
          ...(isNumericId
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

  const updateKegiatanById =
    updatePublicKegiatan.bind(
      null,
      kegiatan.id
    );

  const tanggalValue =
    formatTanggalInput(kegiatan.tanggal);

  return (
    <main className="activity-form-page">
      <div className="container-desa">
        <div className="activity-form-header">
          <div>
            <p className="activity-form-label">
              Form Kegiatan
            </p>

            <h1 className="activity-form-title">
              Edit Kegiatan Desa
            </h1>

            <p className="activity-form-description">
              Perbarui informasi kegiatan desa.
              Data yang disimpan akan otomatis
              ditampilkan pada halaman kegiatan
              dan beranda website.
            </p>
          </div>

          <Link
            href="/kegiatan"
            className="activity-back-button"
          >
            <ArrowLeft size={17} />
            <span>Kembali</span>
          </Link>
        </div>

        <div className="activity-form-card">
          <form
            action={updateKegiatanById}
            className="activity-form"
          >
            <input
              type="hidden"
              name="gambar_lama"
              value={kegiatan.gambar || ""}
            />

            <div className="activity-input-group">
              <label htmlFor="judul">
                <FileText size={16} />
                <span>Judul Kegiatan</span>
              </label>

              <input
                id="judul"
                name="judul"
                type="text"
                defaultValue={kegiatan.judul}
                placeholder="Masukkan judul kegiatan"
                required
              />
            </div>

            <div className="activity-form-grid">
              <div className="activity-input-group">
                <label htmlFor="tanggal">
                  <CalendarDays size={16} />
                  <span>Tanggal Kegiatan</span>
                </label>

                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  defaultValue={tanggalValue}
                  required
                />
              </div>

              <div className="activity-input-group">
                <label htmlFor="kategori">
                  <Tag size={16} />
                  <span>Kategori</span>
                </label>

                <input
                  id="kategori"
                  name="kategori"
                  type="text"
                  defaultValue={
                    kegiatan.kategori || ""
                  }
                  placeholder="Contoh: Sosial atau Pertanian"
                />
              </div>
            </div>

            <div className="activity-input-group">
              <label htmlFor="lokasi">
                <MapPin size={16} />
                <span>Lokasi Kegiatan</span>
              </label>

              <input
                id="lokasi"
                name="lokasi"
                type="text"
                defaultValue={
                  kegiatan.lokasi || ""
                }
                placeholder="Contoh: Balai Desa Margomulyo"
              />
            </div>

            <div className="activity-input-group">
              <label>
                <ImageIcon size={16} />
                <span>Foto Kegiatan Saat Ini</span>
              </label>

              {kegiatan.gambar ? (
                <div className="activity-current-image-box">
                  <img
                    src={kegiatan.gambar}
                    alt={kegiatan.judul}
                    className="activity-current-image"
                  />

                  <div>
                    <p className="activity-current-image-title">
                      Gambar sedang digunakan
                    </p>

                    <p className="activity-current-image-path">
                      Unggah gambar baru hanya
                      apabila foto kegiatan ingin
                      diganti.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="activity-empty-image">
                  Belum ada gambar untuk kegiatan
                  ini.
                </div>
              )}
            </div>

            <div className="activity-input-group">
              <label htmlFor="gambar">
                <ImageIcon size={16} />
                <span>Ganti Foto Kegiatan</span>
              </label>

              <div className="activity-upload-box">
                <input
                  id="gambar"
                  name="gambar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />

                <small>
                  Kosongkan jika tidak ingin
                  mengganti gambar. Format JPG,
                  PNG, atau WebP. Ukuran maksimal
                  5 MB.
                </small>
              </div>
            </div>

            <div className="activity-input-group">
              <label htmlFor="ringkasan">
                <FileText size={16} />
                <span>Ringkasan</span>
              </label>

              <textarea
                id="ringkasan"
                name="ringkasan"
                rows={4}
                defaultValue={
                  kegiatan.ringkasan || ""
                }
                placeholder="Masukkan ringkasan singkat kegiatan"
              />
            </div>

            <div className="activity-input-group">
              <label htmlFor="isi">
                <FileText size={16} />
                <span>Isi Lengkap</span>
              </label>

              <textarea
                id="isi"
                name="isi"
                rows={8}
                defaultValue={
                  kegiatan.isi || ""
                }
                placeholder="Masukkan isi lengkap kegiatan"
              />
            </div>

            <div className="activity-form-actions">
              <Link
                href="/kegiatan"
                className="activity-cancel-button"
              >
                Batal
              </Link>

              <button
                type="submit"
                className="activity-submit-button"
              >
                <Save size={17} />
                <span>Update Kegiatan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}