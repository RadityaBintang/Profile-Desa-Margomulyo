"use client";

import { useEffect } from "react";
import { Phone, X } from "lucide-react";
import { waCenter, type LayananItem } from "@/lib/data/LayananPublik";

export function LayananModal({
  item,
  onClose,
}: {
  item: LayananItem;
  onClose: () => void;
}) {
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

  const { persyaratan } = item;

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
            <h3 className="mt-1 text-xl font-black text-slate-900">{item.title}</h3>
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
          {persyaratan.belumTersedia ? (
            <p className="rounded-2xl bg-amber-50 p-4 text-amber-800">
              Persyaratan untuk layanan ini belum kami lengkapi. Silakan hubungi
              WA Center desa untuk informasi lebih lanjut.
            </p>
          ) : (
            <>
              {persyaratan.intro && <p>{persyaratan.intro}</p>}

              {persyaratan.list && (
                <ol className="list-decimal space-y-2 pl-5">
                  {persyaratan.list.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              )}

              {persyaratan.subsections?.map((sub) => (
                <div key={sub.title}>
                  <p className="font-bold text-slate-900">{sub.title}</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {sub.list.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {persyaratan.catatan && (
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="font-bold text-blue-900">Catatan:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-blue-900">
                    {persyaratan.catatan.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
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