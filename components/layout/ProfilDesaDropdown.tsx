"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const profilMenus = [
  {
    label: "Visi & Misi",
    href: "/profil/visi-misi",
  },
  {
    label: "Struktur Organisasi",
    href: "/profil/struktur-organisasi",
  },
  {
    label: "Perangkat Desa",
    href: "/profil/perangkat-desa",
  },
  {
    label: "Layanan Publik",
    href: "/layanan",
  },
];

export function ProfilDesaDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-blue-600"
      >
        Profil Desa
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup dropdown"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />

          <div className="absolute left-0 top-full z-50 mt-3 w-60 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
            {profilMenus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {menu.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}