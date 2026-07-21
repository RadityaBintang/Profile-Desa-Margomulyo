-- AlterTable
ALTER TABLE `layanan_desa`
  ADD COLUMN `kategori` VARCHAR(100) NOT NULL DEFAULT 'Umum',
  ADD COLUMN `tampilan_besar` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `urutan` INTEGER NOT NULL DEFAULT 0;