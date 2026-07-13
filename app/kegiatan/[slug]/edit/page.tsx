import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePublicKegiatan } from "../../actions";
import { getAdminSession } from "@/lib/auth";

export default async function EditKegiatanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getAdminSession();

  if (!session) {
    redirect(`/login?redirectTo=/kegiatan/${slug}/edit`);
  }

  const numericId = Number(slug);

  const kegiatan = await prisma.kegiatan.findFirst({
    where: {
      OR: [
        {
          slug: slug,
        },
        ...(Number.isNaN(numericId)
          ? []
          : [
              {
                id: numericId,
              },
            ]),
      ],
    },
  });

  if (!kegiatan) {
    notFound();
  }

  const updateKegiatanById = updatePublicKegiatan.bind(null, kegiatan.id);

  const tanggalValue = new Date(kegiatan.tanggal).toISOString().split("T")[0];

  return (
    <main className="activity-form-page">
      <div className="container-desa">
        <div className="activity-form-header">
          <div>
            <p className="activity-form-label">FORM KEGIATAN</p>
            <h1 className="activity-form-title">Edit Kegiatan Desa</h1>
            <p className="activity-form-description">
              Perbarui informasi kegiatan desa. Data yang diubah akan otomatis
              tampil pada halaman kegiatan dan beranda website.
            </p>
          </div>

          <Link href="/kegiatan" className="activity-back-button">
            Kembali
          </Link>
        </div>

        <div className="activity-form-card">
          <form action={updateKegiatanById} className="activity-form">
            <input
              type="hidden"
              name="gambar_lama"
              value={kegiatan.gambar || ""}
            />

            <div className="activity-input-group">
              <label htmlFor="judul">Judul Kegiatan</label>
              <input
                id="judul"
                name="judul"
                type="text"
                defaultValue={kegiatan.judul}
                required
              />
            </div>

            <div className="activity-form-grid">
              <div className="activity-input-group">
                <label htmlFor="tanggal">Tanggal Kegiatan</label>
                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  defaultValue={tanggalValue}
                  required
                />
              </div>

              <div className="activity-input-group">
                <label htmlFor="kategori">Kategori</label>
                <input
                  id="kategori"
                  name="kategori"
                  type="text"
                  defaultValue={kegiatan.kategori || ""}
                  placeholder="Sosial, Pemerintahan, Pemuda"
                />
              </div>
            </div>

            <div className="activity-input-group">
              <label htmlFor="lokasi">Lokasi Kegiatan</label>
              <input
                id="lokasi"
                name="lokasi"
                type="text"
                defaultValue={kegiatan.lokasi || ""}
              />
            </div>

            <div className="activity-input-group">
              <label>Foto Kegiatan Saat Ini</label>

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
                      {kegiatan.gambar}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="activity-empty-image">
                  Belum ada gambar untuk kegiatan ini.
                </div>
              )}
            </div>

            <div className="activity-input-group">
              <label htmlFor="gambar">Ganti Foto Kegiatan</label>
              <div className="activity-upload-box">
                <input id="gambar" name="gambar" type="file" accept="image/*" />
                <small>
                  Kosongkan jika tidak ingin mengganti gambar. Format JPG, PNG,
                  atau WebP. Maksimal 2MB.
                </small>
              </div>
            </div>

            <div className="activity-input-group">
              <label htmlFor="ringkasan">Ringkasan</label>
              <textarea
                id="ringkasan"
                name="ringkasan"
                rows={4}
                defaultValue={kegiatan.ringkasan || ""}
              ></textarea>
            </div>

            <div className="activity-input-group">
              <label htmlFor="isi">Isi Lengkap</label>
              <textarea
                id="isi"
                name="isi"
                rows={8}
                defaultValue={kegiatan.isi || ""}
              ></textarea>
            </div>

            <div className="activity-form-actions">
              <Link href="/kegiatan" className="activity-cancel-button">
                Batal
              </Link>

              <button type="submit" className="activity-submit-button">
                Update Kegiatan
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}