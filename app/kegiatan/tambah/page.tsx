import Link from "next/link";
import { createPublicKegiatan } from "../actions";

export default function TambahKegiatanPage() {
  return (
    <main className="activity-form-page">
      <div className="container-desa">
        <div className="activity-form-header">
          <div>
            <p className="activity-form-label">FORM KEGIATAN</p>
            <h1 className="activity-form-title">Tambah Kegiatan Desa</h1>
            <p className="activity-form-description">
              Tambahkan informasi kegiatan desa agar dapat ditampilkan pada
              halaman kegiatan dan beranda website.
            </p>
          </div>

          <Link href="/kegiatan" className="activity-back-button">
            Kembali
          </Link>
        </div>

        <div className="activity-form-card">
          <form action={createPublicKegiatan} className="activity-form">
            <div className="activity-input-group">
              <label htmlFor="judul">Judul Kegiatan</label>
              <input
                id="judul"
                name="judul"
                type="text"
                placeholder="Contoh: Kerja Bakti Lingkungan"
                required
              />
            </div>

            <div className="activity-form-grid">
              <div className="activity-input-group">
                <label htmlFor="tanggal">Tanggal Kegiatan</label>
                <input id="tanggal" name="tanggal" type="date" required />
              </div>

              <div className="activity-input-group">
                <label htmlFor="kategori">Kategori</label>
                <input
                  id="kategori"
                  name="kategori"
                  type="text"
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
                placeholder="Contoh: Padukuhan Margomulyo"
              />
            </div>

            <div className="activity-input-group">
              <label htmlFor="gambar">Foto Kegiatan</label>
              <div className="activity-upload-box">
                <input id="gambar" name="gambar" type="file" accept="image/*" />
                <small>Format JPG, PNG, atau WebP. Maksimal 2MB.</small>
              </div>
            </div>

            <div className="activity-input-group">
              <label htmlFor="ringkasan">Ringkasan</label>
              <textarea
                id="ringkasan"
                name="ringkasan"
                rows={4}
                placeholder="Tulis ringkasan singkat kegiatan..."
              ></textarea>
            </div>

            <div className="activity-input-group">
              <label htmlFor="isi">Isi Lengkap</label>
              <textarea
                id="isi"
                name="isi"
                rows={8}
                placeholder="Tulis deskripsi lengkap kegiatan desa..."
              ></textarea>
            </div>

            <div className="activity-form-actions">
              <Link href="/kegiatan" className="activity-cancel-button">
                Batal
              </Link>

              <button type="submit" className="activity-submit-button">
                Simpan Kegiatan
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}