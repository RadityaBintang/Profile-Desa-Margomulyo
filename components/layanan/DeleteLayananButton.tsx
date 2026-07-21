"use client";

import { Trash2 } from "lucide-react";
import { deleteLayanan } from "@/app/layanan/action";

export function DeleteLayananButton({ id, namaLayanan }: { id: number; namaLayanan: string }) {
  return (
    <form
      action={deleteLayanan.bind(null, id)}
      onSubmit={(event) => {
        if (!confirm(`Hapus layanan "${namaLayanan}"? Tindakan ini tidak bisa dibatalkan.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
        title="Hapus layanan"
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}