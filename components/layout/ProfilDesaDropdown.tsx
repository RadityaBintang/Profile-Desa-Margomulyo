"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const profilMenus = [
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
  { label: "Perangkat Desa", href: "/profil/perangkat-desa" },
  { label: "Layanan Publik", href: "/layanan" },
];

export function ProfilDesaDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-dropdown-wrapper" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="navbar-dropdown-trigger"
        aria-expanded={open}
      >
        Profil Desa
        <ChevronDown
          size={16}
          className={`navbar-dropdown-chevron ${open ? "navbar-dropdown-chevron-open" : ""}`}
        />
      </button>

      {open && (
        <div className="navbar-dropdown-panel">
          {profilMenus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar-dropdown-item"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}