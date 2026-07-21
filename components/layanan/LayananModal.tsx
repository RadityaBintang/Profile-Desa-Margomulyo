"use client";

import { useEffect } from "react";
import { Phone, X } from "lucide-react";
import type { LayananDesa } from "@prisma/client";

const waCenter: { wilayah: string; nomor: string; cakupan: string }[] = [
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

type PersyaratanGroup = {
  /** null = daftar rata tanpa sub-judul */
  header: string | null;
  items: string[];
};

/**
 * Baris yang diakhiri tanda titik dua (":") dianggap sub-judul baru.
 * Baris "Catatan:" dikasih gaya kotak highlight khusus.
 * Ini murni logika tampilan — tidak butuh perubahan di form/database.
 */
function parsePersyaratan(text: string | null): PersyaratanGroup[] {
  const lines = (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const groups: PersyaratanGroup[] = [];
  let current: PersyaratanGroup = { header: null, items: [] };
  let currentHasContent = false;

  for (const line of lines) {
    if (line.endsWith(":")) {
      if (currentHasContent) groups.push(current);
      current = { header: line.slice(0, -1), items: [] };
      currentHasContent = true;
    } else {
      current.items.push(line);
      currentHasContent = true;
    }
  }
  if (currentHasContent) groups.push(current);

  return groups;
}

export function LayananModal({ item, onClose }: { item: LayananDesa; onClose: () => void }) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const groups = parsePersyaratan(item.persyaratan);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Persyaratan
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-900">{item.namaLayanan}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm leading-6 text-slate-700">
          {groups.length === 0 ? (
            <p className="rounded-2xl bg-amber-50 p-4 text-amber-800">
              Persyaratan untuk layanan ini belum kami lengkapi. Silakan hubungi
              WA Center desa untuk informasi lebih lanjut.
            </p>
          ) : (
            groups.map((group, groupIndex) => {
              if (group.header === null) {
                return (
                  <ol key={groupIndex} className="list-decimal space-y-2 pl-5">
                    {group.items.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                );
              }

              const isCatatan = group.header.toLowerCase().startsWith("catatan");

              if (isCatatan) {
                return (
                  <div key={groupIndex} className="rounded-2xl bg-blue-50 p-4">
                    <p className="font-bold text-blue-900">{group.header}:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-blue-900">
                      {group.items.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <div key={groupIndex}>
                  <p className="font-bold text-slate-900">{group.header}:</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {group.items.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="font-bold text-slate-900">Kesulitan? Hubungi WA Center</p>
            <div className="mt-3 space-y-3">
              {waCenter.map((wa) => {
                const isMargomulyo = wa.wilayah === "Wilayah Tengah";
                return (
                  <div
                    key={wa.wilayah}
                    className={`rounded-xl p-3 ${
                      isMargomulyo ? "bg-blue-50 ring-1 ring-blue-200" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-900">
                        {wa.wilayah}
                        {isMargomulyo && (
                          <span className="ml-2 text-xs font-bold text-blue-600">
                            (Desa Margomulyo)
                          </span>
                        )}
                      </p>
                      <a
                        href={`https://wa.me/62${wa.nomor.replace(/-/g, "").replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
                      >
                        <Phone size={14} />
                        {wa.nomor}
                      </a>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{wa.cakupan}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}