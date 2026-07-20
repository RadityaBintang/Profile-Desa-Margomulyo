"use client";

import { useRef, useState } from "react";
import { updateFotoDesa } from "@/app/actions/profil";

type FotoDesaUploadProps = {
  imageUrl?: string | null;
  isAdmin?: boolean;
};

export function FotoDesaUpload({
  imageUrl,
  isAdmin = false,
}: FotoDesaUploadProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  function handleClickUpload() {
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
      action={updateFotoDesa}
      className="relative h-80 overflow-hidden rounded-3xl bg-blue-200 shadow-lg"
    >
      {preview ? (
        <img
          src={preview}
          alt="Foto Kantor atau Pemandangan Desa"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#8fb0d3] p-8 text-center">
          <p className="text-2xl font-bold text-blue-950">
            Foto Kantor / Pemandangan Desa
          </p>
        </div>
      )}

      {preview && <div className="absolute inset-0 bg-black/15" />}

      {isAdmin && (
        <>
          <input
            ref={inputRef}
            type="file"
            name="fotoKantor"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            <button
              type="button"
              onClick={handleClickUpload}
              disabled={isUploading}
              className="rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUploading ? "Mengupload..." : "Upload Foto"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}