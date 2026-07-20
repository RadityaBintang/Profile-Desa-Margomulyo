"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { updateStrukturOrganisasi } from "@/app/actions/struktur-organisasi";

type StrukturOrganisasiUploadProps = {
  imageUrl?: string | null;
  isAdmin?: boolean;
};

export function StrukturOrganisasiUpload({
  imageUrl,
  isAdmin = false,
}: StrukturOrganisasiUploadProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  function handleUploadClick() {
    if (!isAdmin) return;
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setIsUploading(true);

    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 100);
  }

  return (
    <form
      ref={formRef}
      action={updateStrukturOrganisasi}
      className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg"
    >
      <div className="relative min-h-[420px] bg-blue-50">
        {preview ? (
          <img
            src={preview}
            alt="Struktur Organisasi Desa"
            className="h-full min-h-[420px] w-full object-contain p-6"
          />
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Upload size={38} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-blue-950">
              Struktur Organisasi Desa
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Gambar struktur organisasi belum tersedia.
            </p>
          </div>
        )}

        {isAdmin && (
          <>
            <input
              ref={inputRef}
              type="file"
              name="strukturOrganisasi"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploading ? "Mengupload..." : "Upload Struktur Organisasi"}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}