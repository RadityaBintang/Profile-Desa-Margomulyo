"use client";

import { useRef, useState } from "react";
import { ArrowRight, Camera, Users, X } from "lucide-react";
import { updateIkonLembaga } from "@/app/actions/lembaga";

type Lembaga = {
  id: number;
  namaLembaga?: string | null;
  singkatan?: string | null;
  deskripsi?: string | null;
  ikon?: string | null;
};

type LembagaItem = {
  id: number;
  databaseId?: number;
  singkatan: string;
  nama: string;
  deskripsiSingkat: string;
  detail: string;
  ikon?: string | null;
};

const DEFAULT_LEMBAGA: LembagaItem[] = [
  {
    id: 1,
    singkatan: "BPD",
    nama: "Badan Permusyawaratan Desa",
    deskripsiSingkat: "Badan Permusyawaratan Desa",
    detail:
      "Badan Permusyawaratan Desa (BPD) adalah lembaga yang mewakili masyarakat desa dalam menyampaikan aspirasi dan mengawasi jalannya pemerintahan desa. BPD juga bekerja sama dengan kepala desa dalam membahas dan menetapkan peraturan desa.",
  },
  {
    id: 2,
    singkatan: "LPMD",
    nama: "Lembaga Pemberdayaan Masyarakat Desa",
    deskripsiSingkat: "Lembaga Pemberdayaan Masyarakat Desa",
    detail:
      "Lembaga Pemberdayaan Masyarakat Desa (LPMD) adalah lembaga yang membantu pemerintah desa dalam merencanakan, melaksanakan, dan mengembangkan kegiatan pembangunan. LPMD berperan mendorong partisipasi masyarakat agar pembangunan desa sesuai dengan kebutuhan warga.",
  },
  {
    id: 3,
    singkatan: "PKK",
    nama: "Pemberdayaan dan Kesejahteraan Keluarga",
    deskripsiSingkat: "Pemberdayaan Kesejahteraan Keluarga",
    detail:
      "Pemberdayaan dan Kesejahteraan Keluarga (PKK) adalah organisasi kemasyarakatan yang bertujuan meningkatkan kesejahteraan keluarga. Kegiatan PKK meliputi bidang kesehatan, pendidikan, keterampilan, lingkungan hidup, serta pembinaan keluarga.",
  },
  {
    id: 4,
    singkatan: "RT/RW",
    nama: "Rukun Tetangga dan Rukun Warga",
    deskripsiSingkat: "Rukun Tetangga dan Rukun Warga",
    detail:
      "Rukun Tetangga dan Rukun Warga (RT/RW) adalah lembaga kemasyarakatan yang membantu pemerintah desa dalam memberikan pelayanan kepada masyarakat di lingkungan tempat tinggal. RT dan RW juga berperan menjaga ketertiban, kerukunan, kebersihan, serta menyampaikan informasi kepada warga.",
  },
  {
    id: 5,
    singkatan: "Karang Taruna",
    nama: "Karang Taruna",
    deskripsiSingkat: "Organisasi sosial kepemudaan",
    detail:
      "Karang Taruna adalah organisasi sosial yang menjadi wadah bagi generasi muda untuk mengembangkan potensi, kreativitas, dan kepedulian sosial. Karang Taruna biasanya melaksanakan kegiatan kepemudaan, olahraga, kesenian, kewirausahaan, dan kegiatan sosial di lingkungan desa.",
  },
];

function matchLembaga(defaultItem: LembagaItem, data?: Lembaga[]) {
  const aliases: Record<string, string[]> = {
    BPD: ["bpd", "badan permusyawaratan"],
    LPMD: ["lpmd", "lembaga pemberdayaan"],
    PKK: ["pkk", "pemberdayaan kesejahteraan"],
    "RT/RW": ["rt/rw", "rt", "rw", "rukun tetangga", "rukun warga"],
    "Karang Taruna": ["karang taruna"],
  };

  const keywords = aliases[defaultItem.singkatan] || [
    defaultItem.singkatan.toLowerCase(),
  ];

  return data?.find((item) => {
    const nama = item.namaLembaga?.toLowerCase() || "";
    const singkatan = item.singkatan?.toLowerCase() || "";

    return keywords.some(
      (keyword) => nama.includes(keyword) || singkatan.includes(keyword)
    );
  });
}

export function KelembagaanSection({
  data,
  isAdmin = false,
}: {
  data?: Lembaga[];
  isAdmin?: boolean;
}) {
  const [selectedLembaga, setSelectedLembaga] = useState<LembagaItem | null>(
    null
  );

  const lembagaList = DEFAULT_LEMBAGA.map((defaultItem) => {
    const databaseItem = matchLembaga(defaultItem, data);

    return {
      ...defaultItem,
      databaseId: databaseItem?.id,
      nama: databaseItem?.namaLembaga || defaultItem.nama,
      deskripsiSingkat: databaseItem?.deskripsi || defaultItem.deskripsiSingkat,
      ikon: databaseItem?.ikon || null,
    };
  });

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-desa">
        <div className="mb-10 flex items-start gap-4">
          <div className="h-20 w-1.5 rounded-full bg-blue-600" />

          <div>
            <p className="text-xl font-extrabold uppercase text-blue-600">
              Lembaga
            </p>
            <h2 className="text-4xl font-black text-slate-950">Desa</h2>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            Mode admin aktif. Klik ikon/foto lembaga untuk mengupload gambar.
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {lembagaList.map((item) => (
            <LembagaCard
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              onOpenDetail={() => setSelectedLembaga(item)}
            />
          ))}
        </div>
      </div>

      {selectedLembaga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedLembaga(null)}
              className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              aria-label="Tutup popup"
            >
              <X size={20} />
            </button>

            <div className="pr-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">
                {selectedLembaga.ikon ? (
                  <img
                    src={selectedLembaga.ikon}
                    alt={selectedLembaga.singkatan}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users size={34} strokeWidth={2.5} />
                )}
              </div>

              <p className="text-sm font-extrabold uppercase text-blue-600">
                {selectedLembaga.singkatan}
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-950">
                {selectedLembaga.nama}
              </h3>

              <div className="mt-4 h-1 w-20 rounded-full bg-blue-600" />

              <p className="mt-6 text-base leading-8 text-slate-700">
                {selectedLembaga.detail}
              </p>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLembaga(null)}
                  className="rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function LembagaCard({
  item,
  isAdmin,
  onOpenDetail,
}: {
  item: LembagaItem;
  isAdmin: boolean;
  onOpenDetail: () => void;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canUpload = isAdmin && Boolean(item.databaseId);

  function handleIconClick() {
    if (canUpload) {
      inputRef.current?.click();
    }
  }

  function handleFileChange() {
    formRef.current?.requestSubmit();
  }

  return (
    <article className="border border-blue-300 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {item.databaseId && (
        <form
          ref={formRef}
          action={updateIkonLembaga.bind(null, item.databaseId)}
          className="hidden"
        >
          <input
            ref={inputRef}
            type="file"
            name="ikon"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </form>
      )}

      <button
        type="button"
        onClick={handleIconClick}
        disabled={!canUpload}
        className={`relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700 ${
          canUpload ? "cursor-pointer ring-2 ring-blue-300" : "cursor-default"
        }`}
        title={
          canUpload
            ? "Klik untuk upload ikon lembaga"
            : "Ikon hanya dapat diubah oleh admin"
        }
      >
        {item.ikon ? (
          <img
            src={item.ikon}
            alt={item.singkatan}
            className="h-full w-full object-cover"
          />
        ) : (
          <Users size={48} strokeWidth={2.5} />
        )}

        {canUpload && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
            <Camera size={28} className="text-white" />
          </div>
        )}
      </button>

      {!item.databaseId && isAdmin && (
        <p className="mt-3 text-xs font-semibold text-red-600">
          Data lembaga belum terhubung ke database.
        </p>
      )}

      <h3 className="mt-6 text-2xl font-black text-slate-950">
        {item.singkatan}
      </h3>

      <p className="mt-2 min-h-[48px] text-base leading-6 text-slate-700">
        {item.deskripsiSingkat}
      </p>

      <button
        type="button"
        onClick={onOpenDetail}
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-md border border-blue-500 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Selengkapnya
        <ArrowRight size={20} />
      </button>
    </article>
  );
}