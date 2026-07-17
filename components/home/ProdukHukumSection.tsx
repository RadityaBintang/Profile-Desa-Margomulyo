"use client";

import { useState } from "react";
import { ArrowRight, FileText, X } from "lucide-react";

type ProdukHukum = {
  id: number;
  jenis?: string | null;
  judul?: string | null;
  nomor?: string | null;
  tahun?: number | null;
  fileDokumen?: string | null;
};

type ProdukHukumItem = {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
};

const PRODUK_HUKUM_LIST: ProdukHukumItem[] = [
  {
    id: 1,
    title: "PERDES",
    shortTitle: "Peraturan Desa",
    description:
      "Peraturan Desa (PERDES) adalah peraturan perundang-undangan yang ditetapkan oleh Kepala Desa setelah dibahas dan disepakati bersama Badan Permusyawaratan Desa (BPD). PERDES menjadi dasar hukum dalam penyelenggaraan pemerintahan, pelaksanaan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat di tingkat desa.",
  },
  {
    id: 2,
    title: "PERKADES",
    shortTitle: "Peraturan Kepala Desa",
    description:
      "Peraturan Kepala Desa (PERKADES) adalah peraturan yang ditetapkan oleh Kepala Desa sebagai pedoman pelaksanaan Peraturan Desa atau untuk menjalankan kewenangan yang dimiliki oleh pemerintah desa. PERKADES mengatur hal-hal yang bersifat teknis dan operasional agar penyelenggaraan pemerintahan desa berjalan secara efektif dan tertib.",
  },
  {
    id: 3,
    title: "SK Kepala Desa",
    shortTitle: "Surat Keputusan Kepala Desa",
    description:
      "Surat Keputusan Kepala Desa (SK Kepala Desa) merupakan keputusan resmi yang dikeluarkan oleh Kepala Desa untuk menetapkan suatu kebijakan, pengangkatan atau pemberhentian perangkat desa, pembentukan kepanitiaan, penetapan penerima bantuan, maupun keputusan administratif lainnya yang memiliki kekuatan hukum sesuai dengan kewenangan Kepala Desa.",
  },
  {
    id: 4,
    title: "Peraturan Bersama Kepala Desa",
    shortTitle: "Peraturan Bersama Kepala Desa",
    description:
      "Peraturan Bersama Kepala Desa adalah peraturan yang disusun dan ditetapkan oleh dua atau lebih Kepala Desa untuk mengatur kepentingan bersama antar desa. Peraturan ini menjadi dasar hukum dalam pelaksanaan kerja sama desa, pengelolaan sumber daya bersama, penyelenggaraan pelayanan publik, maupun pelaksanaan program pembangunan yang melibatkan beberapa desa secara terpadu.",
  },
];

export function ProdukHukumSection({ data }: { data?: ProdukHukum[] }) {
  const [selectedItem, setSelectedItem] = useState<ProdukHukumItem | null>(
    null
  );

  return (
    <section className="bg-white py-16">
      <div className="container-desa">
        <div className="mb-10 flex items-start gap-4">
          <div className="h-20 w-1.5 rounded-full bg-blue-600" />

          <div>
            <p className="text-xl font-extrabold uppercase leading-tight text-blue-600">
              Produk
            </p>
            <h2 className="text-4xl font-black leading-tight text-slate-950">
              Hukum
            </h2>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {PRODUK_HUKUM_LIST.map((item) => (
            <article
              key={item.id}
              className="border border-blue-300 bg-white px-8 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-600 bg-white text-blue-600">
                <FileText size={42} strokeWidth={2.1} />
              </div>

              <h3 className="mt-6 min-h-[56px] text-xl font-black leading-tight text-slate-950">
                {item.shortTitle}
              </h3>

              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-md border border-blue-600 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                Selengkapnya
                <ArrowRight size={19} />
              </button>
            </article>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label="Tutup popup"
            >
              <X size={20} />
            </button>

            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-blue-600 bg-blue-50 text-blue-600">
              <FileText size={42} strokeWidth={2.1} />
            </div>

            <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-blue-600">
              Produk Hukum Desa
            </p>

            <h3 className="mt-2 pr-10 text-3xl font-black leading-tight text-slate-950">
              {selectedItem.title}
            </h3>

            <div className="mt-4 h-1 w-20 rounded-full bg-blue-600" />

            <p className="mt-6 text-base leading-8 text-slate-700">
              {selectedItem.description}
            </p>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}