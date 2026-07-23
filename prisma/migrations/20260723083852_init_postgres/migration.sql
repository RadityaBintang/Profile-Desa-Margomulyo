-- CreateEnum
CREATE TYPE "StatusAktif" AS ENUM ('aktif', 'nonaktif');

-- CreateEnum
CREATE TYPE "StatusPublikasi" AS ENUM ('draft', 'publish');

-- CreateEnum
CREATE TYPE "JenisProdukHukum" AS ENUM ('Perdes', 'Perkades', 'SK Kades', 'Keputusan BPD', 'APBDes', 'RKPDes', 'Lainnya');

-- CreateEnum
CREATE TYPE "TipeKontak" AS ENUM ('Kantor Desa', 'Perangkat Desa', 'Layanan', 'Lainnya');

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profil_desa" (
    "id" SERIAL NOT NULL,
    "nama_desa" VARCHAR(100) NOT NULL,
    "kecamatan" VARCHAR(100),
    "kabupaten" VARCHAR(100),
    "provinsi" VARCHAR(100),
    "alamat" TEXT,
    "kode_pos" VARCHAR(10),
    "email" VARCHAR(100),
    "telepon" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "deskripsi" TEXT,
    "visi" TEXT,
    "misi" TEXT,
    "logo" VARCHAR(255),
    "foto_kantor" VARCHAR(255),
    "maps_embed" TEXT,
    "struktur_organisasi" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profil_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_profil" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(150) NOT NULL,
    "deskripsi" TEXT,
    "url_video" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(255),
    "status" "StatusAktif" DEFAULT 'aktif',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jam_pelayanan" (
    "id" SERIAL NOT NULL,
    "hari" VARCHAR(100) NOT NULL,
    "jam_buka" TIME(6),
    "jam_tutup" TIME(6),
    "keterangan" VARCHAR(100),
    "urutan" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jam_pelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kegiatan" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220),
    "tanggal" DATE NOT NULL,
    "lokasi" VARCHAR(150),
    "kategori" VARCHAR(100),
    "ringkasan" TEXT,
    "isi" TEXT,
    "gambar" VARCHAR(255),
    "status" "StatusPublikasi" DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lembaga_desa" (
    "id" SERIAL NOT NULL,
    "nama_lembaga" VARCHAR(150) NOT NULL,
    "singkatan" VARCHAR(50),
    "deskripsi" TEXT,
    "ketua" VARCHAR(100),
    "periode" VARCHAR(50),
    "ikon" VARCHAR(255),
    "foto" VARCHAR(255),
    "status" "StatusAktif" DEFAULT 'aktif',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lembaga_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_lembaga" (
    "id" SERIAL NOT NULL,
    "lembaga_id" INTEGER NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jabatan" VARCHAR(100),
    "foto" VARCHAR(255),
    "urutan" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anggota_lembaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_hukum" (
    "id" SERIAL NOT NULL,
    "jenis" "JenisProdukHukum" NOT NULL,
    "nomor" VARCHAR(100) NOT NULL,
    "tahun" INTEGER NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "tanggal_ditetapkan" DATE,
    "file_dokumen" VARCHAR(255),
    "keterangan" TEXT,
    "status" "StatusPublikasi" DEFAULT 'publish',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produk_hukum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layanan_desa" (
    "id" SERIAL NOT NULL,
    "nama_layanan" VARCHAR(150) NOT NULL,
    "kategori" VARCHAR(100) NOT NULL DEFAULT 'Umum',
    "deskripsi" TEXT,
    "persyaratan" TEXT,
    "ikon" VARCHAR(255),
    "tampilan_besar" BOOLEAN NOT NULL DEFAULT false,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusAktif" DEFAULT 'aktif',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layanan_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kontak_desa" (
    "id" SERIAL NOT NULL,
    "nama_kontak" VARCHAR(100) NOT NULL,
    "jabatan" VARCHAR(100),
    "telepon" VARCHAR(30),
    "email" VARCHAR(100),
    "alamat" TEXT,
    "tipe" "TipeKontak" DEFAULT 'Kantor Desa',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kontak_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perangkat_desa" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jabatan" VARCHAR(150) NOT NULL,
    "foto" VARCHAR(255),
    "urutan" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'aktif',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "perangkat_desa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "kegiatan_slug_key" ON "kegiatan"("slug");

-- CreateIndex
CREATE INDEX "anggota_lembaga_lembaga_id_idx" ON "anggota_lembaga"("lembaga_id");

-- AddForeignKey
ALTER TABLE "anggota_lembaga" ADD CONSTRAINT "fk_anggota_lembaga" FOREIGN KEY ("lembaga_id") REFERENCES "lembaga_desa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
