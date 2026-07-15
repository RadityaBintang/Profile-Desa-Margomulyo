-- CreateTable
CREATE TABLE `perangkat_desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `jabatan` VARCHAR(150) NOT NULL,
    `foto` VARCHAR(255) NULL,
    `urutan` INTEGER NULL DEFAULT 0,
    `status` VARCHAR(20) NULL DEFAULT 'aktif',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
