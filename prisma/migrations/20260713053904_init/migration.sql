-- CreateTable
CREATE TABLE `profil_desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_desa` VARCHAR(100) NOT NULL,
    `kecamatan` VARCHAR(100) NULL,
    `kabupaten` VARCHAR(100) NULL,
    `provinsi` VARCHAR(100) NULL,
    `alamat` TEXT NULL,
    `kode_pos` VARCHAR(10) NULL,
    `email` VARCHAR(100) NULL,
    `telepon` VARCHAR(30) NULL,
    `whatsapp` VARCHAR(30) NULL,
    `deskripsi` TEXT NULL,
    `visi` TEXT NULL,
    `misi` TEXT NULL,
    `logo` VARCHAR(255) NULL,
    `foto_kantor` VARCHAR(255) NULL,
    `maps_embed` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video_profil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(150) NOT NULL,
    `deskripsi` TEXT NULL,
    `url_video` VARCHAR(255) NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `status` ENUM('aktif', 'nonaktif') NULL DEFAULT 'aktif',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jam_pelayanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hari` VARCHAR(100) NOT NULL,
    `jam_buka` TIME(0) NULL,
    `jam_tutup` TIME(0) NULL,
    `keterangan` VARCHAR(100) NULL,
    `urutan` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NULL,
    `tanggal` DATE NOT NULL,
    `lokasi` VARCHAR(150) NULL,
    `kategori` VARCHAR(100) NULL,
    `ringkasan` TEXT NULL,
    `isi` LONGTEXT NULL,
    `gambar` VARCHAR(255) NULL,
    `status` ENUM('draft', 'publish') NULL DEFAULT 'draft',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lembaga_desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lembaga` VARCHAR(150) NOT NULL,
    `singkatan` VARCHAR(50) NULL,
    `deskripsi` TEXT NULL,
    `ketua` VARCHAR(100) NULL,
    `periode` VARCHAR(50) NULL,
    `ikon` VARCHAR(255) NULL,
    `foto` VARCHAR(255) NULL,
    `status` ENUM('aktif', 'nonaktif') NULL DEFAULT 'aktif',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_lembaga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lembaga_id` INTEGER NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jabatan` VARCHAR(100) NULL,
    `foto` VARCHAR(255) NULL,
    `urutan` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_anggota_lembaga`(`lembaga_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk_hukum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` ENUM('Perdes', 'Perkades', 'SK Kades', 'Keputusan BPD', 'APBDes', 'RKPDes', 'Lainnya') NOT NULL,
    `nomor` VARCHAR(100) NOT NULL,
    `tahun` YEAR NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `tanggal_ditetapkan` DATE NULL,
    `file_dokumen` VARCHAR(255) NULL,
    `keterangan` TEXT NULL,
    `status` ENUM('draft', 'publish') NULL DEFAULT 'publish',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layanan_desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_layanan` VARCHAR(150) NOT NULL,
    `deskripsi` TEXT NULL,
    `persyaratan` TEXT NULL,
    `alur_layanan` TEXT NULL,
    `estimasi_waktu` VARCHAR(100) NULL,
    `biaya` VARCHAR(100) NULL,
    `ikon` VARCHAR(255) NULL,
    `status` ENUM('aktif', 'nonaktif') NULL DEFAULT 'aktif',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kontak_desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kontak` VARCHAR(100) NOT NULL,
    `jabatan` VARCHAR(100) NULL,
    `telepon` VARCHAR(30) NULL,
    `email` VARCHAR(100) NULL,
    `alamat` TEXT NULL,
    `tipe` ENUM('Kantor Desa', 'Perangkat Desa', 'Layanan', 'Lainnya') NULL DEFAULT 'Kantor Desa',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `anggota_lembaga` ADD CONSTRAINT `fk_anggota_lembaga` FOREIGN KEY (`lembaga_id`) REFERENCES `lembaga_desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
