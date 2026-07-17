// Data statis untuk halaman Layanan Publik.
// Sumber persyaratan: dokumen "Layanan Publik - Margomulyo.docx" yang diberikan.
//
// CATATAN PENTING:
// Dokumen yang diberikan hanya berisi syarat untuk layanan ADMINDUK
// (Akta Kelahiran, Akta Kematian, KK, KTP, KIA, Pindah Keluar/Datang).
// Item lain (Surat Keterangan generik, seluruh Bantuan Sosial, DTSEN,
// PBI BBL, dan seluruh PBB-P2) BELUM ada datanya — ditandai
// `belumTersedia: true` supaya modal menampilkan pesan yang jujur,
// bukan syarat karangan. Tinggal lengkapi field `persyaratan`-nya nanti.

export type PersyaratanBlock = {
  intro?: string;
  list?: string[];
  subsections?: { title: string; list: string[] }[];
  catatan?: string[];
  belumTersedia?: boolean;
};

export type LayananItem = {
  slug: string;
  title: string;
  iconName: string;
  /** Hanya dipakai untuk kartu besar (layout "single") */
  description?: string;
  persyaratan: PersyaratanBlock;
};

export type LayananSection = {
  title: string;
  layout: "single" | "grid";
  items: LayananItem[];
};

export const waCenter: { wilayah: string; nomor: string; cakupan: string }[] = [
  {
    wilayah: "Wilayah Barat",
    nomor: "0895-3332-22226",
    cakupan: "Srengat, Wonodadi, Udanawu, Ponggok, Sanankulon",
  },
  {
    wilayah: "Wilayah Tengah",
    nomor: "0895-3332-22227",
    cakupan:
      "Kanigoro, Sutojaya, Garum, Talun, Wonotirto, Kademangan, Bakung, Panggungrejo, Nglegok",
  },
  {
    wilayah: "Wilayah Timur",
    nomor: "0895-3332-22228",
    cakupan: "Selorejo, Wlingi, Kesamben, Doko, Gandungsari, Binangun, Wates, Selopuro",
  },
];

const belumTersedia: PersyaratanBlock = {
  belumTersedia: true,
};

export const layananSections: LayananSection[] = [
  {
    title: "Surat Keterangan",
    layout: "single",
    items: [
      {
        slug: "surat-keterangan",
        title: "Surat Keterangan",
        iconName: "FileText",
        description:
          "Layanan Surat Keterangan digunakan untuk membantu masyarakat memperoleh berbagai surat yang dibutuhkan untuk keperluan administrasi, seperti surat domisili, surat keterangan usaha, surat keterangan tidak mampu, surat kehilangan, dan surat keterangan lainnya sesuai kebutuhan. Silakan ajukan permohonan dengan melengkapi persyaratan yang telah ditentukan agar proses pelayanan dapat dilakukan dengan lebih cepat.",
        persyaratan: belumTersedia,
      },
    ],
  },
  {
    title: "ADMINDUK",
    layout: "grid",
    items: [
      {
        slug: "akta-kelahiran",
        title: "Akta Kelahiran",
        iconName: "Baby",
        persyaratan: {
          intro: "Mengisi Formulir F2.01, dengan melampirkan:",
          list: [
            "Surat Keterangan Kelahiran dari penolong (jika ada).",
            "Fotokopi Buku Nikah/Kutipan Akta Perkawinan/Kutipan Akta Perceraian/SPTJM F1.05.",
            "Fotokopi Kartu Keluarga.",
            "Fotokopi KTP-el Pelapor (bila pelapor bukan orang tua bayi).",
            "Fotokopi KTP-el orang tua bayi.",
            "Fotokopi KTP-el 2 orang saksi.",
          ],
          catatan: [
            "SPTJM Kebenaran Data Kelahiran digunakan apabila pemohon tidak dapat melampirkan surat keterangan kelahiran.",
            "SPTJM Kebenaran Pasangan Suami Istri digunakan apabila pemohon tidak dapat melampirkan akta nikah/perkawinan yang bersangkutan atau orang tua yang sah tetapi status hubungan dalam KK.",
          ],
        },
      },
      {
        slug: "akta-kematian",
        title: "Akta Kematian",
        iconName: "FileMinus2",
        persyaratan: {
          intro: "Mengisi Formulir F2.01, dengan melampirkan:",
          list: [
            "Surat Keterangan Kematian.",
            "Fotokopi KK.",
            "Fotokopi KTP-el Pelapor.",
            "Fotokopi KTP-el 2 orang saksi.",
          ],
          catatan: [
            "Bagi penduduk yang meninggal sudah lama tetapi memiliki dokumen, melampirkan SPTJM kebenaran data kematian. Sedangkan yang tidak memiliki dokumen, melampirkan putusan pengadilan.",
          ],
        },
      },
      {
        slug: "kartu-keluarga",
        title: "Kartu Keluarga (KK)",
        iconName: "Users",
        persyaratan: {
          subsections: [
            {
              title: "Pengajuan KK Baru",
              list: [
                "Mengisi Formulir F1.01.",
                "Fotokopi Paspor (bagi yang pernah tinggal di luar negeri).",
                "Fotokopi Buku Nikah/Akta Perkawinan atau Akta Perceraian (bagi yang sudah).",
              ],
            },
            {
              title: "Pecah KK",
              list: ["Mengisi Formulir F1.02.", "KK Asli."],
            },
            {
              title: "Cetak Ulang KK — Karena Hilang",
              list: [
                "Surat Keterangan Kehilangan dari Kepolisian (untuk terbitan sebelum 01 Juni 2020).",
              ],
            },
            {
              title: "Cetak Ulang KK — Karena Rusak",
              list: ["Kartu Keluarga Asli (untuk terbitan sebelum 01 Juni 2020)."],
            },
          ],
          catatan: [
            "Lampirkan Fotokopi Buku Nikah/Kutipan Akta Perkawinan/Kutipan Akta Perceraian/Akta Kematian (bila ada perubahan data).",
            "Untuk KK terbit setelah 01 Juni 2020, dapat mencetak ulang secara mandiri menggunakan PIN dan email.",
          ],
        },
      },
      {
        slug: "ktp",
        title: "Kartu Tanda Penduduk (KTP)",
        iconName: "CreditCard",
        persyaratan: {
          subsections: [
            {
              title: "Pencetakan & Perekaman KTP-el Pemula",
              list: ["Fotokopi KK."],
            },
            {
              title: "Pencetakan KTP-el Ulang",
              list: [
                "Fotokopi KK.",
                "KTP-el asli (yang ada perubahan data atau rusak).",
                "Surat keterangan kehilangan dari kepolisian (karena kehilangan).",
              ],
            },
          ],
        },
      },
      {
        slug: "kia",
        title: "Kartu Identitas Anak (KIA)",
        iconName: "IdCard",
        persyaratan: {
          list: [
            "Fotokopi Akta Kelahiran.",
            "Fotokopi Kartu Keluarga.",
            "Pasfoto 3×4 sebanyak 2 lembar untuk anak usia di atas 5 tahun (background biru untuk tahun kelahiran genap, background merah untuk tahun kelahiran ganjil).",
          ],
        },
      },
      {
        slug: "skpwni",
        title: "SKPWNI",
        iconName: "ArrowUpRight",
        persyaratan: {
          intro: "Surat Keterangan Pindah, Warga Negara Indonesia — syarat pindah keluar:",
          list: ["Mengisi Formulir F1.03.", "KK Asli.", "KTP-el Asli."],
          catatan: [
            "Apabila diperlukan, lampirkan Surat Persetujuan Suami/Istri/Orang Tua (apabila pindah tidak semua anggota keluarga dalam 1 KK).",
          ],
        },
      },
      {
        slug: "pindah-masuk",
        title: "Surat Pindah Masuk",
        iconName: "ArrowDownLeft",
        persyaratan: {
          list: [
            "Mengisi Formulir F1.02.",
            "Surat Keterangan Pindah dari Dukcapil asal dan KTP-el asli.",
            "Fotokopi Buku Nikah/Akta Perkawinan atau Akta Perceraian (bagi yang melakukan perubahan data).",
          ],
          catatan: ["KK Asli yang dituju (jika numpang KK)."],
        },
      },
      {
        slug: "pindah-antar-dinas",
        title: "Pindah Antar Dinas",
        iconName: "Building2",
        persyaratan: belumTersedia,
      },
    ],
  },
  {
    title: "Pengusulan Bantuan Sosial",
    layout: "grid",
    items: [
      { slug: "pkh", title: "PKH", iconName: "HandCoins", persyaratan: belumTersedia },
      { slug: "bpnt", title: "BPNT", iconName: "ShoppingBasket", persyaratan: belumTersedia },
      {
        slug: "yatim-piatu",
        title: "Yatim Piatu",
        iconName: "HeartHandshake",
        persyaratan: belumTersedia,
      },
      {
        slug: "disabilitas",
        title: "Disabilitas",
        iconName: "Accessibility",
        persyaratan: belumTersedia,
      },
      { slug: "pbi", title: "PBI", iconName: "ShieldCheck", persyaratan: belumTersedia },
    ],
  },
  {
    title: "Pembaruan DTSEN",
    layout: "single",
    items: [
      {
        slug: "dtsen",
        title: "Pembaruan DTSEN",
        iconName: "Database",
        description:
          "Perbarui data sosial ekonomi agar informasi kependudukan tetap akurat dan sesuai kondisi terbaru.",
        persyaratan: belumTersedia,
      },
    ],
  },
  {
    title: "Pengusulan PBI BBL",
    layout: "single",
    items: [
      {
        slug: "pbi-bbl",
        title: "Pengusulan PBI BBL",
        iconName: "HeartPulse",
        description:
          "Pengajuan kepesertaan Penerima Bantuan Iuran (PBI) BPJS Kesehatan bagi masyarakat yang memenuhi kriteria.",
        persyaratan: belumTersedia,
      },
    ],
  },
  {
    title: "Pelayanan PBB-P2",
    layout: "grid",
    items: [
      { slug: "pbb-mutasi", title: "Mutasi", iconName: "ArrowRightLeft", persyaratan: belumTersedia },
      { slug: "pbb-perbaikan", title: "Perbaikan", iconName: "Wrench", persyaratan: belumTersedia },
      {
        slug: "pbb-keberatan",
        title: "Keberatan",
        iconName: "AlertTriangle",
        persyaratan: belumTersedia,
      },
      {
        slug: "pbb-pemunculan",
        title: "Pemunculan",
        iconName: "PlusCircle",
        persyaratan: belumTersedia,
      },
      {
        slug: "pbb-penghapusan",
        title: "Penghapusan",
        iconName: "MinusCircle",
        persyaratan: belumTersedia,
      },
      {
        slug: "pbb-pembatalan",
        title: "Pembatalan",
        iconName: "XCircle",
        persyaratan: belumTersedia,
      },
    ],
  },
];