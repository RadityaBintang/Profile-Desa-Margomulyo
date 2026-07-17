"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { layananSections, type LayananItem } from "@/lib/data/LayananPublik";
import { LayananModal } from "./LayananModal";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.FileQuestion;
}

export function LayananPublikContent() {
  const [activeItem, setActiveItem] = useState<LayananItem | null>(null);

  return (
    <div className="space-y-14">
      {layananSections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-6 text-2xl font-black text-slate-900">{section.title}</h2>

          {section.layout === "single" ? (
            <div className="grid gap-6 md:grid-cols-2">
              {section.items.map((item) => (
                <SingleCard key={item.slug} item={item} onSelengkapnya={setActiveItem} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {section.items.map((item) => (
                <GridCard key={item.slug} item={item} onSelengkapnya={setActiveItem} />
              ))}
            </div>
          )}
        </section>
      ))}

      {activeItem && <LayananModal item={activeItem} onClose={() => setActiveItem(null)} />}
    </div>
  );
}

function SingleCard({
  item,
  onSelengkapnya,
}: {
  item: LayananItem;
  onSelengkapnya: (item: LayananItem) => void;
}) {
  const Icon = getIcon(item.iconName);

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
        <Icon size={44} className="text-blue-600" />
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
        <button
          type="button"
          onClick={() => onSelengkapnya(item)}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Selengkapnya
          <Icons.ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function GridCard({
  item,
  onSelengkapnya,
}: {
  item: LayananItem;
  onSelengkapnya: (item: LayananItem) => void;
}) {
  const Icon = getIcon(item.iconName);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-50">
        <Icon size={40} className="text-blue-600" />
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">{item.title}</p>

      <button
        type="button"
        onClick={() => onSelengkapnya(item)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
      >
        Selengkapnya
        <Icons.ArrowRight size={14} />
      </button>
    </div>
  );
}