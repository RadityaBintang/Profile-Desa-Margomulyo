"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ImageIcon, Pencil } from "lucide-react";
import type { LayananDesa } from "@prisma/client";
import { LayananModal } from "./LayananModal";
import { DeleteLayananButton } from "./DeleteLayananButton";

function LayananImage({ src, size }: { src: string | null; size: number }) {
  if (!src) {
    return <ImageIcon size={size * 0.55} className="text-blue-300" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-full w-full rounded-2xl object-cover" />
  );
}

function groupByKategori(items: LayananDesa[]) {
  const map = new Map<string, LayananDesa[]>();
  for (const item of items) {
    const group = map.get(item.kategori) || [];
    group.push(item);
    map.set(item.kategori, group);
  }
  return Array.from(map.entries()).map(([kategori, items]) => ({ kategori, items }));
}

export function LayananPublikContent({
  items,
  isAdmin,
}: {
  items: LayananDesa[];
  isAdmin: boolean;
}) {
  const [activeItem, setActiveItem] = useState<LayananDesa | null>(null);
  const sections = groupByKategori(items);

  return (
    <div className="space-y-14">
      {isAdmin && (
        <Link
          href="/layanan/tambah"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          + Tambah Layanan
        </Link>
      )}

      {sections.length === 0 && (
        <p className="text-center text-slate-500">Belum ada layanan yang ditambahkan.</p>
      )}

      {sections.map((section) => {
        const besar = section.items.filter((item) => item.tampilanBesar);
        const biasa = section.items.filter((item) => !item.tampilanBesar);

        return (
          <section key={section.kategori}>
            <h2 className="mb-6 text-2xl font-black text-slate-900">{section.kategori}</h2>

            {besar.length > 0 && (
              <div className="mb-6 grid gap-6 md:grid-cols-2">
                {besar.map((item) => (
                  <SingleCard
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    onSelengkapnya={setActiveItem}
                  />
                ))}
              </div>
            )}

            {biasa.length > 0 && (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {biasa.map((item) => (
                  <GridCard
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    onSelengkapnya={setActiveItem}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {activeItem && <LayananModal item={activeItem} onClose={() => setActiveItem(null)} />}
    </div>
  );
}

function AdminControls({ item }: { item: LayananDesa }) {
  return (
    <div className="absolute -right-2 -top-2 flex gap-1.5">
      <Link
        href={`/layanan/${item.id}/edit`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50"
        title="Edit layanan"
      >
        <Pencil size={14} />
      </Link>
      <DeleteLayananButton id={item.id} namaLayanan={item.namaLayanan} />
    </div>
  );
}

function SingleCard({
  item,
  isAdmin,
  onSelengkapnya,
}: {
  item: LayananDesa;
  isAdmin: boolean;
  onSelengkapnya: (item: LayananDesa) => void;
}) {
  return (
    <div className="relative flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
      {isAdmin && <AdminControls item={item} />}

      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
        <LayananImage src={item.ikon} size={44} />
      </div>

      <div className="flex flex-1 flex-col">
        <p className="font-bold text-slate-900">{item.namaLayanan}</p>
        {item.deskripsi && <p className="mt-1 text-sm leading-6 text-slate-600">{item.deskripsi}</p>}
        <button
          type="button"
          onClick={() => onSelengkapnya(item)}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Selengkapnya
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function GridCard({
  item,
  isAdmin,
  onSelengkapnya,
}: {
  item: LayananDesa;
  isAdmin: boolean;
  onSelengkapnya: (item: LayananDesa) => void;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {isAdmin && <AdminControls item={item} />}

      <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-50">
        <LayananImage src={item.ikon} size={40} />
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">{item.namaLayanan}</p>

      <button
        type="button"
        onClick={() => onSelengkapnya(item)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
      >
        Selengkapnya
        <ArrowRight size={14} />
      </button>
    </div>
  );
}