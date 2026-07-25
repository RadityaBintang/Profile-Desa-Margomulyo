"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deletePublicKegiatan } from "@/app/kegiatan/actions";

type DeleteKegiatanButtonProps = {
  id: number;
  judul: string;
};

export function DeleteKegiatanButton({
  id,
  judul,
}: DeleteKegiatanButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] = useState<
    string | null
  >(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kegiatan "${judul}"?`
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result =
          await deletePublicKegiatan(id);

        if (!result.success) {
          setError(result.message);
          return;
        }

        router.refresh();
      } catch (error) {
        console.error(
          "Gagal menghapus kegiatan:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus kegiatan."
        );
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="
          inline-flex items-center justify-center gap-2
          rounded-lg bg-red-600 px-4 py-2
          text-sm font-semibold text-white
          transition hover:bg-red-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <Trash2 size={16} />

        {isPending
          ? "Menghapus..."
          : "Hapus"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}